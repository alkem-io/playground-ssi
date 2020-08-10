require('dotenv').config();
import { JolocomLib } from "jolocom-lib";
import eth, { MAX_INTEGER } from "ethereumjs-utils";
import { fuelKeyWithEther } from "jolocom-lib/js/utils/helper";
import { claimsMetadata } from 'cred-types-jolocom-core';
import {fetchIdentityFromSeeed, printVaultData, createIdentity} from "./util";
    
const registry = JolocomLib.registries.jolocom.create();
console.log('Starting the server side ... ');

async function main() {

  console.log("Generating ecoverse identity.");
  const vaultedEcoverseIdentity = fetchIdentityFromSeeed(process.env.ecoverse_seed, process.env.ecoverse_secret);
  const ecoverseWallet = await createIdentity(vaultedEcoverseIdentity, process.env.ecoverse_secret);
  // console.log(ecoverseWallet);

  switch (process.env.STAGE) {
    case '1':
      // An instance of an identityWallet is required at this point
      const credentialRequest = await ecoverseWallet.create.interactionTokens.request.share({
        callbackURL: 'https://example.com/authentication/',
        credentialRequirements: [{
          type: ['Credential', 'ProofOfEmailCredential'],
          constraints: []
        }],
      }, process.env.ecoverse_secret)

      console.log('copy+paste the credentials below to sign.')
      const jwtEncodedCredentialRequest = credentialRequest.encode()
      console.log(jwtEncodedCredentialRequest);
      break;
    case '3':
      try {
        const jwtEncodedCredentialResponse = require('./interaction_objects/2'); // generally, you would receive it from an API request.
        const jwtEncodedCredentialRequestFromDB = require('./interaction_objects/1'); // generally, you would retrieve it from the DB or cache.
        const credentialResponse = await JolocomLib.parse.interactionToken.fromJWT(jwtEncodedCredentialResponse);
        const credentialRequestFromDB = await JolocomLib.parse.interactionToken.fromJWT(jwtEncodedCredentialRequestFromDB);
        await ecoverseWallet.validateJWT(credentialResponse, credentialRequestFromDB); // this would throw an Error if it's invalid.

        console.log(credentialResponse);

        const validResponse = await credentialResponse.satisfiesRequest(credentialRequestFromDB);
        if (!validResponse) {
          throw new Error('Incorrect response received')
        }

        const providedCredentials = credentialResponse.getSuppliedCredentials()
        const signatureValidationResults = await JolocomLib.util.validateDigestables(providedCredentials)

        if (signatureValidationResults.every(result => result === true)) {
          // do something with the credentials.
          console.log('Credentials are validated.');
          console.log('Give user a long time user token.');
        }
      }
      catch(e) {
        throw e;
      }
      break;
    default:
      break;
  }
  

  
}

main().then(()=>{
  process.exit();
}).catch(function(e){
  throw e;
});


