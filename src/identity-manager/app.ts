import { ConnectionOptions, createConnection } from 'typeorm'
import { JolocomTypeormStorage } from '@jolocom/sdk-storage-typeorm'
import { JolocomSDK } from '@jolocom/sdk'
import typeormConfig from './ormconfig'

async function init() {
  const conf = typeormConfig as ConnectionOptions
  const typeormConnection = await createConnection(conf)
  const storage = new JolocomTypeormStorage(typeormConnection)
 
  console.log('about to create SDK instance')
  const sdk = new JolocomSDK({ storage })

  // Running sdk.createAgent() will create a new Identity
  // sdk.loadAgent will load an identity from storage
  const agent = await sdk.createAgent("your password", "jun")
  console.log('Agent identity', agent.identityWallet.identity)

  const didMethod = agent.didMethod;
  const didMethods = sdk.didMethods.methods;
  console.log(`Agent did methods: ${didMethods}`);
}

init()
