# Instructions: How to delpoy the smart contract
This file contains the instructions on how to run the smart contract. In order to run this contract youu will need to have the following languages/programs installed:

* Node.js
* Visual Studio


## Fetching files from Github
* Download the SmartContract.sol from [GitHub](https://github.com/cherrytwist/Server.Identity/tree/hhs-assignment/Smartcontract)
* Download the SmartccontractInterface from [GitHub](https://github.com/cherrytwist/Server.Identity/tree/hhs-assignment) 

## Install ganache-cli
Ganache-cli needs to be running to create a local Remote procedure call, or RPC, envorinment
'''Command Prompt
    
    cd *SmartContractInterface\map\location*

    npm i

    npm i -g ganache-cli

    ganache-cli

## Setting up the smart contract itself
* Open the SmartContract.sol file in a texteditor
* Copy the entire text in a document named *SmartContract.sol* in [Remix](https://remix.ethereum.org/)
* Go to the *Solidity Compiler* option on the left of the screen
* Compile the smart contract
* Go to the *Deploy & Run Transactions* option at the left of the screen
* Select *Web3 Provider* in the Environment selection
* Copy two wallet adresses into the smart contract
* Deploy the Smart Contract
* Under the *Delpoyed Contracts* heading, copy the contract adress of the smart contract.


## Setting up the smart contract interface
* Open all files in the SmartContractInterface folder in Visual Studio, apart from the two .html files
* Copy the contract adress copied from the smart contract in the *script-onlyClient.js* & *script-onlyDeliverer.js* in line 102 within the brackets
* Ctrl+shift+S to save the changes
* Open the .html files in your browser
* You can now use the smart contract


















