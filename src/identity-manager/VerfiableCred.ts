import { IdentityManager } from './IdentityManager';
import typeormConfig from './agents-ormconfig';
import { ConnectionOptions, createConnection } from 'typeorm';
import metadata from './SimpleCredentialMetaData'
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
    const alice = await identityMgr.loadBasedOnPass(password);
    console.log(alice.identityWallet.did)

    //Create/load another agent
    const password2 = readlineSync.question('Enter another password create/load second DID:').toString();
    const bob = await identityMgr.loadBasedOnPass(password2);
    console.log(bob.identityWallet.did)

    identityMgr.logger.info("About to verify metadata between our 2 loaded/created agents")

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
    bob.processJWT(bobCredExchangeResponse.encode());

    // Alice receives the token response from Bob, finds the interaction + then creates the VC to share
    const aliceCredExchangeInteraction = await alice.processJWT(bobCredExchangeResponse.encode())

    // Create the VC that then will be issued by Alice to Bob, so that Bob can then prove that Alice attested to this credential about him. 
    const aliceAboutBobVC = await alice.signedCredential({
      metadata: metadata,
      subject: bob.identityWallet.did,
      claim: {
        age: 25,
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

    const state = (bobCredExchangeInteraction2.getSummary() as any).state

    if (state.credentialsAllValid) {
        identityMgr.logger.info("Issued credential interaction is valid!");
        await Promise.all(
          state.issued.map((VC: SignedCredential) =>  bob.storage.store.verifiableCredential(VC)),
        )
        identityMgr.logger.info("Saving verfied interaction^^");
        await fs.appendFileSync("VerfiedCredential.json", JSON.stringify(state)+"\r\n");
    }
}   
init()