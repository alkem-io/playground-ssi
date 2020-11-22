import { ConnectionOptions, createConnection } from 'typeorm'
import { JolocomTypeormStorage } from '@jolocom/sdk-storage-typeorm'
import { JolocomSDK } from '@jolocom/sdk'
import typeormConfig from './ormconfig'
import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import { AuthorizationRequest } from '@jolocom/sdk/js/interactionManager/types'

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

  //const agent2 = await sdk.createAgentFromMnemonic("test something else works this can what some else2", false, 'pass','jolo');
  //console.log(`Agent2: ${agent2.identityWallet.identity}`);

  const authReq: AuthorizationRequest = {
    callbackURL: 'https://example.com/auth',
    description: 'are you bob?',
  }
  const authReqToken = await agent.authorizationRequestToken(authReq);
  console.log(`===================================================`);
  console.log(`authReqToken: `, authReqToken);
  const encodedToken = authReqToken.encode();
  console.log(`encoded: ${encodedToken}`);
}

init()
