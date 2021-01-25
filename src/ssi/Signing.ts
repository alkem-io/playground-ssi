import { ConnectionOptions, createConnection } from "typeorm";
import typeormConfig from "./config/agents-ormconfig";
import { JolocomTypeormStorage } from "@jolocom/sdk-storage-typeorm";
import { Agent, JolocomLib, JolocomSDK } from "@jolocom/sdk";
import { KeyTypes } from "@jolocom/vaulted-key-provider";
import { stripHexPrefix } from "jolocom-lib/js/utils/helper";

var readlineSync = require("readline-sync");

async function init() {
  const conf = typeormConfig as ConnectionOptions;
  const typeormConnection = await createConnection(conf);
  const storage = new JolocomTypeormStorage(typeormConnection);

  console.log("about to create SDK instance");
  const sdk = new JolocomSDK({ storage });

  //const Password = readlineSync.question('Create your password:').toString();

  const password = "password";
  const agent = await sdk.createAgent(password, "jun");
  console.log("Agent identity:", agent.identityWallet.identity.did);

  var input_msg = readlineSync.question("Enter data to sign:");
  console.log(`Signing following data: ${input_msg}`);

  const input_msg_buffer = Buffer.from(input_msg);
  const signed_msg_buffer = await agent.identityWallet.sign(
    input_msg_buffer,
    password
  );

  console.log(
    `Signing: ${input_msg}  ==> ${signed_msg_buffer.toString("hex")}`
  );

  // Now validate the signature
  const keyPair = await agent.keyProvider.newKeyPair(
    password,
    KeyTypes.ecdsaSecp256k1VerificationKey2019
  );
  //keyPair.id.
  console.log(`keypair: ${keyPair}`);
  //agent.keyProvider.sign()

  await signAllKnownKeys(password, agent, input_msg_buffer);
}

async function signAllKnownKeys(password: string, agent: Agent, message: Buffer) {
  
  const pubKeys = await agent.keyProvider.getPubKeys(password);
  for (let i = 0; i < pubKeys.length; i++) {
    const pubKey = pubKeys[i];
    console.log(`===== Key #${i} ===> : id '${pubKey.id}' --- controller ${pubKey.controller}' --- type ${pubKey.type}`);

    try {
      const signature = await agent.keyProvider.sign(
      {
        keyRef: pubKey.controller[0],
        encryptionPass: password,
      },
      message
    );
    console.log(
      `sign(${message.toString("utf-8")}) ==> ${signature.toString("hex")}`
    );
    } catch (e) {
      console.error(`Unable to process pub key ${pubKey.type} : ${e}`);
    }
  }
}

init();
