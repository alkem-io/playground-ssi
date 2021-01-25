import { IdentityManager } from './util/IdentityManager';
import typeormConfig from './config/agents-ormconfig';
import { ConnectionOptions, createConnection } from 'typeorm';
import metadata from './credentials/SimpleCredentialMetaData'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential';
import fs from "fs";

const credentialsFile = './credentials.json';

var readlineSync = require("readline-sync");

async function init() {
    const conf = typeormConfig as ConnectionOptions;
    const typeormConnection = await createConnection(conf);
    const identityMgr = new IdentityManager(credentialsFile, typeormConnection);
    const logger = identityMgr.logger;

    //Create/load first agent
    const alice = await identityMgr.createAgent("alicePW");
    logger.info(`Alice: ${alice.identityWallet.did}`);

    //Create/load another agent
    const bob = await identityMgr.createAgent("bobPW");
    logger.info(`Bob: ${bob.identityWallet.did}`);

    logger.info("About to verify metadata between our 2 loaded/created agents...")

    // Alice creates the offer to Bob to sign a simple credential
    const aliceCredOffer = await alice.credOfferToken({
        callbackURL: 'https://example.com/issuance',
        offeredCredentials: [
        {
            type: 'SimpleExampleCredential',
        },
        ],
    })    

    // Bob receives and processes the offered token, to identify the relevant Interaction 
    const bobCredExchangeInteraction = await bob.processJWT(aliceCredOffer.encode())
    // Bob then creates a response token
    const bobCredExchangeResponse = await bobCredExchangeInteraction.createCredentialOfferResponseToken(
      [{ type: 'SimpleExampleCredential' }],
    );
    // Note that all agents need to also process the tokens they generate so that their interaction manager has seen all messages
    await bob.processJWT(bobCredExchangeResponse.encode());

    // Alice receives the token response from Bob, finds the interaction + then creates the VC to share
    const aliceCredExchangeInteraction = await alice.processJWT(bobCredExchangeResponse.encode())

    // Create the VC that then will be issued by Alice to Bob, so that Bob can then prove that Alice attested to this credential about him. 
    const age = readlineSync.question('Enter the age of Bob: ').toString();
    const aliceAboutBobVC = await alice.signedCredential({
      metadata: metadata,
      subject: bob.identityWallet.did,
      claim: {
        age: age,
        name: 'Bob',
      },
    });

    // Create the token wrapping the VC
    const aliceCredIssuance = await aliceCredExchangeInteraction.createCredentialReceiveToken(
      [aliceAboutBobVC],
    );
    // Alice processes her own generated token also
    await alice.processJWT(aliceCredIssuance.encode());

    // Token with signed VC is sent and received by Bob
    // Note: should be same as interaction above....check!
    const bobCredExchangeInteraction2 = await bob.processJWT(aliceCredIssuance.encode());

    const state: any = bobCredExchangeInteraction2.flow.state;
    
    if (state.credentialsAllValid) {
      logger.info("Issued credential interaction is valid!");
        for (let i = 0; i < state.issued.length; i++) {
          const vc = state.issued[i];
          await bob.storage.store.verifiableCredential(vc);
          logger.info(`Saving verfied credential with claim: ${JSON.stringify(vc.claim)}`);
        }
   
        await fs.appendFileSync("VerfiedCredential.json", JSON.stringify(state)+"\r\n");
    }
}   
init()