import { JolocomLib } from "jolocom-lib";
import eth from "ethereumjs-utils";
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

async function createSignedEmailCredentialJSON(wallet, secret, email) {
  const emailAddressSignedCredential = await wallet.create.signedCredential({
    metadata: claimsMetadata.emailAddress,
    claim: { email },
    subject: wallet.did // Our own DID, referred to as a self-issued credential
  }, secret)
  console.log(emailAddressSignedCredential.toJSON());
  return emailAddressSignedCredential;
}

export {
    fetchIdentityFromSeeed,
    printVaultData,
    createIdentity,
    createSignedEmailCredentialJSON
}