import { ConnectionOptions, createConnection } from 'typeorm'
import { JolocomTypeormStorage } from '@jolocom/sdk-storage-typeorm'
import { JolocomSDK } from '@jolocom/sdk'
import typeormConfig from './ormconfig'
import { Identity } from 'jolocom-lib/js/identity/identity';

const Email_DID: (string|any)[] = [];

async function init() {

  const conf = typeormConfig as ConnectionOptions
  const typeormConnection = await createConnection(conf)
  const storage = new JolocomTypeormStorage(typeormConnection)
  
  console.log('about to create SDK instance')
  const sdk = new JolocomSDK({ storage })
  // Running sdk.createAgent() will create a new Identity
  // sdk.loadAgent will load an identity from storage
  const agent = await sdk.createAgent("your password", "jolo")
  console.log('Agent identity', agent.identityWallet.did)
  Email_DID.push(answer, agent.identityWallet.did)

  const didMethod = agent.didMethod;
  const didMethods = sdk.didMethods.methods;
  //console.log(`Agent did methods: ${didMethods}`);
  console.log(Email_DID)
}

var query = require('cli-interact').question;
var answer = query('Enter email: ');
console.log('you answered: ', answer);

init()
