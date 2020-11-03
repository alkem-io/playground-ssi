const typeorm = require('typeorm')
const { JolocomTypeormStorage } = require('@jolocom/sdk-storage-typeorm')
const { JolocomSDK } = require('jolocom-sdk')
const typeormConfig = require('./ormconfig')
 
async function init() {
  const typeormConnection = await typeorm.createConnection(typeormConfig)
  const storage = new JolocomTypeormStorage(typeormConnection)
 
  console.log('about to create SDK instance')
  const sdk = new JolocomSDK({ storage })
 
  // Running sdk.init() with no arguments will:
  // - create an identity if it doesn't exist
  // - load the identity from storage
  const identityWallet = await sdk.init()
  console.log('Agent identity', identityWallet.identity)
}
 
init()