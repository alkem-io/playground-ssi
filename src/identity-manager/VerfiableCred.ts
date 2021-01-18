import { IdentityManager } from './IdentityManager';
import typeormConfig from './agents-ormconfig';
import { ConnectionOptions, createConnection } from 'typeorm';
import metadata from './metadata'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential';
import fs from "fs";

const credentialsFile = './credentials.json';

var readlineSync = require("readline-sync");

async function init() {
    const conf = typeormConfig as ConnectionOptions;
    const typeormConnection = await createConnection(conf);
    const identityMgr = new IdentityManager(credentialsFile, typeormConnection);

    //Create/load first agent
    const password = readlineSync.question('Enter your password to either load or create new DID:').toString();
    const agent = await identityMgr.loadBasedOnPass(password);
    console.log(agent.identityWallet.did)

    //Create/load another agent
    const password2 = readlineSync.question('Enter another password create/load second DID:').toString();
    const agent2 = await identityMgr.loadBasedOnPass(password2);
    console.log(agent2.identityWallet.did)

    identityMgr.logger.info("About to verify metadata between our 2 loaded/created agents")

    //Const signedcredential based on certain metadata
    const agentCredAboutagent2 = await agent.signedCredential({
        metadata: metadata,
        subject: agent2.identityWallet.did,
        claim: {
          age: 25,
          name: 'Bob',
        },
      })

    //Create offer token
    const agentCredOffer = await agent.credOfferToken({
        callbackURL: 'https://example.com/issuance',
        offeredCredentials: [
        {
            type: 'SimpleExampleCredential',
        },
        ],
    })    

    //Agent 2 proccesses offer token
    const agent2Interaction = await agent2.processJWT(agentCredOffer.encode())
    //Agent 2 creates resonses token
    const agent2CredSelection = await agent2Interaction.createCredentialOfferResponseToken(
      [{ type: 'SimpleExampleCredential' }],
    );
    agent2.processJWT(agent2CredSelection.encode());

    //Issuance and recieving
    const agentInteraction = await agent.processJWT(agent2CredSelection.encode())
    const agentIssuance = await agentInteraction.createCredentialReceiveToken(
      [agentCredAboutagent2],
    );

    await agent.processJWT(agentIssuance.encode());

    const agent2Receives = await agent2.processJWT(agentIssuance.encode());

    const state = (agent2Receives.getSummary() as any).state

    if (state.credentialsAllValid) {
        identityMgr.logger.info("Issued credential interaction is valid!");
        await Promise.all(
          state.issued.map((VC: SignedCredential) =>  agent2.storage.store.verifiableCredential(VC)),
        )
        identityMgr.logger.info("Saving verfied interaction^^");
        await fs.appendFileSync("VerfiedCredential.json", JSON.stringify(state)+"\r\n");
    }
}   
init()