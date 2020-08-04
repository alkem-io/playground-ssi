require('dotenv').config();
import { JolocomLib } from "jolocom-lib";
import eth, { MAX_INTEGER } from "ethereumjs-utils";
import { fuelKeyWithEther } from "jolocom-lib/js/utils/helper";
import { claimsMetadata } from 'cred-types-jolocom-core';

const registry = JolocomLib.registries.jolocom.create();

function fetchIdentityFromSeeed(seed, secret){
  seed = Buffer.from(seed, 'hex');
  const vaultedKeyProvider = JolocomLib.KeyProvider.fromSeed(seed, secret);
  return vaultedKeyProvider;
} 

function printVaultData(vaultedKeyProvider, secret){
  const encryptedSeed = vaultedKeyProvider.encryptedSeed;
  console.log('ENCRYPTED SEED ---> ', encryptedSeed);

  const publicEthKey = vaultedKeyProvider.getPublicKey({
    encryptionPass: secret,
    derivationPath: JolocomLib.KeyTypes.ethereumKey // "m/44'/60'/0'/0/0"
  })
  console.log('ETHEREUM KEY BUFFER ----> ', publicEthKey);
  console.log('ETHEREUM KEY ----> ', publicEthKey.toString('hex'));

  const ethAddress = eth.addHexPrefix(eth.pubToAddress(publicEthKey, true).toString('hex'));
  console.log('ETHEREUM ADDRESS --> ', ethAddress);
}

async function createIdentity(vaultedKeyProvider, secret){
  return await registry.create(vaultedKeyProvider, secret);
}

async function main(){
  try {
    /*
      Tab1: Ecoverse
      Tab2: User
    
      1. Tab1:Ecoverse: create PK & fetch vaulted ID for Ecoverse using Node.
      2. Tab1:Ecoverse: Create an identity for Ecoverse.
      3. Tab2:User: create a PK & fetch vaulted ID for user using Node.
      4. Tab2:User: create an Identity for User.
      5. Tab2:User: Create a self-signed email credential for the user.
      6. Tab1:Ecoverse: Create an email verification credential request.
      7. Tab2:User: Sign credential.
      8. Tab1:Ecoverse: Verify the signed credentials against the blockchain.
    */

    // console.log({JolocomLib});
    // console.log({parse: JolocomLib.parse})
    // console.log({signedCredential: JolocomLib.parse.signedCredential})
    // exit();

    // createEcoverseIdentity(); //3
    console.log("Generating ecoverse identity.");
    const vaultedEcoverseIdentity = fetchIdentityFromSeeed(process.env.ecoverse_seed, process.env.ecoverse_secret);
    const ecoverseWallet = await createIdentity(vaultedEcoverseIdentity, process.env.ecoverse_secret);


    // createUserIdentity(); //4
    console.log("Generating user identity.");
    const vaultedUserIdentity = fetchIdentityFromSeeed(process.env.user_seed, process.env.user_secret);
    const userWallet = await createIdentity(vaultedUserIdentity, process.env.user_secret);
    console.log(userWallet);

    // createEmailCredential(); //5
    console.log("Generating an email claim.")
    const emailAddressSignedCredential = await userWallet.create.signedCredential({
      metadata: claimsMetadata.emailAddress,
      claim: { email: process.env.user_email },
      subject: userWallet.did // Our own DID, referred to as a self-issued credential
    }, process.env.user_secret)
    // console.log({emailAddressSignedCredential});
    console.log(JSON.stringify(emailAddressSignedCredential));

    // 5.a commit on chain
    // userWallet.identity.emailCredential = emailAddressSignedCredential;
    // await registry.commit({
    //   userWallet,
    //   vaultedUserIdentity,
    //   keyMetadata:{
    //     encryptionPass: process.env.user_secret,
    //     derivationPath: JolocomLib.KeyTypes.ethereumKey 
    //   }
    // })

    console.log(userWallet.identity);
    console.log('Committed on chain.');
    
    // createEmailVerificationRequest(); //6
    // createEmailVerificationSignature(); //7


    // verifyEmailVerificationSignature(); //8

    console.log({signedCredential: JolocomLib.parse.signedCredential});
    
    const receivedCredential = JolocomLib.parse.signedCredential(emailAddressSignedCredential.toJSON());
    const valid = await JolocomLib.util.validateDigestable(receivedCredential);

    if(valid) {
      console.log('this is a valid signature');
    } else {
      console.log('this is _NOT_ a valid signature');
    }

  } catch (error) {
    console.log(error);
  } finally {
    console.log('.... exiting ');
    process.exit();
  }
}

main();


