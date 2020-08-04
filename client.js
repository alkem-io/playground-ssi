require('dotenv').config();
import { JolocomLib } from "jolocom-lib";
import eth, { MAX_INTEGER } from "ethereumjs-utils";
import { fuelKeyWithEther } from "jolocom-lib/js/utils/helper";
import {fetchIdentityFromSeeed, printVaultData, createIdentity, createSignedEmailCredentialJSON} from "./util";

const registry = JolocomLib.registries.jolocom.create();

console.log('Starting the clietn side ... ');

async function main() {
  // createUserIdentity(); //4
  console.log("Generating user identity.");
  const vaultedUserIdentity = fetchIdentityFromSeeed(process.env.user_seed, process.env.user_secret);
  const userWallet = await createIdentity(vaultedUserIdentity, process.env.user_secret);
  // console.log(userWallet);

  switch (process.env.STAGE) {
    case '2':
      const jwtEncodedCredentialRequest = require('./interaction_objects/1');
      const credentialRequest = JolocomLib.parse.interactionToken.fromJWT(jwtEncodedCredentialRequest);
      if( userWallet.validateJWT(credentialRequest) ) {
        console.log('valid credential request');
      } else throw Error('Invalid credentialRequst');
      
      const signedEmailCredentialJSON = await createSignedEmailCredentialJSON(userWallet, process.env.user_secret, process.env.user_email);

      const credentialResponse = await userWallet.create.interactionTokens.response.share({
        callbackURL: credentialRequest.payload.interactionToken.callbackURL,
        suppliedCredentials: [signedEmailCredentialJSON] // Provide signed credentials of requested type
      },
        process.env.user_secret, // The password to decrypt the seed for key generation as part of signing the JWT
        credentialRequest // The received request, used to set the 'nonce' and 'audience' field on the created response
      )

      const jwtEncodedCredentialResponse = credentialResponse.encode();
      console.log('COPY+PASTE BELOW to 2.js');
      console.log(jwtEncodedCredentialResponse);
      
      break;
    default:
      break;
  }

}



main().then(()=>{
  process.exit(0);
});


