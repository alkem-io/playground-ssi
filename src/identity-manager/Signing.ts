import { ConnectionOptions, createConnection } from 'typeorm';
import typeormConfig from './agents-ormconfig';
import { JolocomTypeormStorage } from "@jolocom/sdk-storage-typeorm";
import { JolocomSDK } from "@jolocom/sdk";
var readlineSync = require('readline-sync');

async function init() {
  const conf = typeormConfig as ConnectionOptions;
  const typeormConnection = await createConnection(conf);
  const storage = new JolocomTypeormStorage(typeormConnection)
 
  console.log('about to create SDK instance')
  const sdk = new JolocomSDK({ storage })
 
  // Running sdk.init() with no arguments will:
  // - create an identity if it doesn't exist
  // - load the identity from storage

  const Bob = await sdk.createAgent('demoPassword', 'jun')
  console.log('Agent identity:', Bob.identityWallet.identity.did)

  var Input = readlineSync.question('Enter data to sign:');
  console.log(`Signing following data: ${Input}`)
  
  const data = Buffer.from(Input.toString());
  const Signed = await Bob.identityWallet.sign(data,'demoPassword')

  console.log('Signed input', Signed.toString())
  console.log('unsigned input', JSON.stringify(data))

}
 
init()