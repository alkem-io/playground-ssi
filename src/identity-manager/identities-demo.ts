import { ConnectionOptions, createConnection } from 'typeorm';
import typeormConfig from './agents-ormconfig';
import { IdentityManager } from './IdentityManager';

import fs from "fs";

const credentialsFile = './credentials.json';
const agent1DidFile = './agent1DidFile';
const agent1TokenFile = './agent1TokenFile';

const agent2DidFile = './agent2DidFile';
const agent2TokenFile = './agent2TokenFile';

async function init(stage: string) {

  const conf = typeormConfig as ConnectionOptions;
  const typeormConnection = await createConnection(conf);

  const identityMgr = new IdentityManager(credentialsFile, typeormConnection);
  identityMgr.logger.info(`Executing phase ${stage}...`);
  if (stage === '1') {
    identityMgr.logger.info("Generating agent1 identity...");
    const agent1 = await identityMgr.createAgent();
    fs.writeFileSync(agent1DidFile, agent1.identityWallet.did);
    identityMgr.logger.info(`...generated agent1: ${agent1.identityWallet.did}`);

    identityMgr.logger.info('Generating agent1 authentication request token...');
    const authReqToken = await agent1.authRequestToken({
      callbackURL: 'https://example.com/auth',
      description: 'are you agent2?',
    })
    identityMgr.logger.info(`....generated: ${authReqToken}`);

    const jwtEncodedAuthReqToken = authReqToken.encode();
    fs.writeFileSync(agent1TokenFile, jwtEncodedAuthReqToken);
    identityMgr.logger.info(`....stored: ${agent1TokenFile}`);

  } else if (stage === '2') {
    identityMgr.logger.info("Generating agent1 identity...");
    const agent2 = await identityMgr.createAgent();
    fs.writeFileSync(agent2DidFile, agent2.identityWallet.did);
    identityMgr.logger.info(`...generated agent2: ${agent2.identityWallet.did}`);

    // Load in the auth req token from agent1
    const agent1AuthReqToken = fs.readFileSync(agent1TokenFile).toString()
    identityMgr.logger.info(`Loaded token from agent1: ${agent1AuthReqToken}`);

    // 
    const agent2Interaction = await agent2.processJWT(agent1AuthReqToken);
    const agent2AuthResponse = await agent2Interaction.createAuthenticationResponse();
    identityMgr.logger.info(`...generated agent2 auth response: ${agent2AuthResponse}`);
    const agent2AuthResponseEncoded = agent2AuthResponse.encode();
    await agent2.processJWT(agent2AuthResponseEncoded)
    fs.writeFileSync(agent2TokenFile, agent2AuthResponseEncoded);

  } else if (stage === '3') {
    // agent1 to load and accept
    const agent1Did = fs.readFileSync(agent1DidFile).toString();
    const agent1 = await identityMgr.loadAgent(agent1Did);

    // Load in the response agent1
    const agent2AuthResponse = fs.readFileSync(agent2TokenFile).toString();
    const agent1Interaction = await agent1.processJWT(agent2AuthResponse);
    identityMgr.logger.info(`...auth response: ${agent1Interaction}`);
  } else {
    identityMgr.logger.info(`Unable to recoginise option: ${stage}`);
  }

}

var query = require('cli-interact').question;
var stage = query('Enter stage: ');

init(stage);