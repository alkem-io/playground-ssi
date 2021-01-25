import { Connection, ConnectionOptions, createConnection } from "typeorm";
import { JolocomTypeormStorage } from "@jolocom/sdk-storage-typeorm";
import { Agent, JolocomSDK } from "@jolocom/sdk";

const winston = require("winston");
import fs from "fs";
import generator from "generate-password";

export class Credential {
  did: string;
  password: string;
  constructor(did: string, password: string) {
    this.did = did;
    this.password = password;
  }
}

export class IdentityManager {
  logger;

  // the sdk we are wrapping
  sdk: JolocomSDK;

  identitiesPasswordsMap: Map<string, Credential>;

  // file used to store json for credentials
  credentialsFile: string;

  // Create the Factory with logging etc
  constructor(credFile: string, typeormConnection: Connection) {
    this.credentialsFile = credFile;

    // Set up the logging
    const logFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    );
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({ level: "info", format: logFormat }),
        new winston.transports.File({
          filename: "population-info.log",
          level: "warn",
        }),
        new winston.transports.File({
          filename: "population-warnings.log",
          level: "warn",
        }),
      ],
    });

    // Load in known state re credentials
    this.identitiesPasswordsMap = new Map();
    if (!fs.existsSync(this.credentialsFile)) this.persistCredentials();
    this.loadCredentials();

    // Set up the sdk using the provided typeormconnection
    const storage = new JolocomTypeormStorage(typeormConnection);
    this.logger.info("Creating SDK instance");
    this.sdk = new JolocomSDK({ storage });
  }

  loadCredentials() {
    const credentialsStr = fs.readFileSync(this.credentialsFile).toString();
    const credentialsJson = JSON.parse(credentialsStr);
    // convert into map
    for (let i = 0; i < credentialsJson.length; i++) {
      const credentialJson = credentialsJson[i];
      const cred = new Credential(credentialJson.did, credentialJson.password);
      this.identitiesPasswordsMap.set(cred.did, cred);
    }
  }
  
  loadBasedOnPass(password: string): Promise<Agent> {
    //Load or generate a new did based on password
    this.logger.info("Trying to locate your did based on your password");
    var state = false
    var index = 0;
    const credentialsStr = fs.readFileSync(this.credentialsFile).toString();
    const credentialsJson = JSON.parse(credentialsStr);
    for (var i = 0; i < credentialsJson.length; i++){
      if (credentialsJson[i].password == password){
        state = true
        index = i;
      }
    }
    const agent = (() => {
      if (state == true){
          this.logger.info("Succesfully loaded your did!")
          return (this.loadAgent(credentialsJson[index].did))
      }
      else
        this.logger.info("Generated a new did for you based on your password!")
        return (this.createAgent(password))
    })();
    return agent
  }

  persistCredentials() {
    const credentials = [...this.identitiesPasswordsMap.values()];
    const mapStr = JSON.stringify(credentials);
    fs.writeFileSync(this.credentialsFile, mapStr);
  }

  async createAgent(password: string): Promise<Agent> {
    // Use jun method to avoid connecting to entereum chain
    const agent = await this.sdk.createAgent(password, 'jun');
    const cred = new Credential(agent.identityWallet.did, password);
    this.identitiesPasswordsMap.set(cred.did, cred);
    this.persistCredentials();
    return agent;
  }

  async loadAgent(did: string): Promise<Agent> {
    // get the password
    const cred = this.identitiesPasswordsMap.get(did);
    if (!cred)
      throw new Error(
        `Unable to locate agent that has the provided did: ${did}`
      );
    const agent = await this.sdk.loadAgent(cred.password, did);
    return agent;
  }

  generatePassword(): string {
    const password = generator.generate({
      length: 4,
      numbers: true,
      symbols: true,
      excludeSimilarCharacters: true,
      exclude: '"', // avoid causing invalid Json
      strict: true,
    });
    return `pass_${password}`;
  }
}