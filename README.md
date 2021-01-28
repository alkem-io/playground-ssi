# Summary:
- [x] Create a smart contract using 7 states.
- [x] Create/load agents to use in verifiable credential interactions.
- [x] Create a one page React application with a friendly user interface which redirects users accordingly.
- [x] Read well defined AND up-to-date documentation regarding this project.

# Introduction
This file has been created in order to give insights regarding the interaction between self sovereign identities, the smart contract and a friendly user interface

# Definition of roles
### **Identities Custodian**
The identities custodian is a role that controls the contract and self sovereign identities, further named as Custodian. The custodian will be a trusted third party who will host the smart contract, most likely Odyssey. The Custodian will be able to access and moderate both the Client's side, as well as the Deliverers' side.

### **The Client**
The client is the party that offers the smart contract, further named as Client. The Client wants a problem solved and are looking for people solving that problem. The Client can put in a description of the problem, what kind of solution they are expecting and the amount of money/tokens they are willing to pay.

### **The Deliverers**
The deliverers are the people that will accept the challenge offered by the client, further named as Deliverers.These people are looking for jobs and tasks on the CherryTwist platform.

# The use case
In this use case the custodian, or trusted third party, will have set up the smart contract on their platform, a client will set up a listing for a certain price in order to solve a certain problem, which can be described within the smart contract.

The Deliverers can accept the smart contract and post their solution in the smart contract. After the Client accepts the solution to the smart contract, the Deliverers will receive their payment via a signal amount that will initiate a transfer via for example another smart contract.

![roles](https://user-images.githubusercontent.com/58250102/97601650-12614f00-1a13-11eb-9060-1010acbd2382.png)

The diagram below depicts the same interaction flow, the "connect to smart contract" part shows how the SSI should communicate with the smart contract in every interaction between the Deliverer, Client and Custodian. The steps below show the simplified version of what the other smart contract functions do.

![Diagram](https://user-images.githubusercontent.com/71760326/98146813-20f4ae00-1ecc-11eb-9e40-ebf2cbb08a21.png)



# The Functions of the smart contract:
- [x] Client initiates contract & uploads proposal.
- [x] Deliverer connects to smart contract & agrees on the project.
- [x] Deliverer uploads work & confirms delivery.
- [x] Client confirms the delivered work.
- [x] Either client or deliverer transfers the smart contract.
- [x] Both client and deliverer can abandon the smart contract, but only if both agree.

In order to access other functions, the 7 different states of the smart contract are used to unlock specific functions depending on the current state. This to prevent dishonesty and make things clearer for the users. These 7 state transitions are visualized in the image below.

![smartcontractstates](https://user-images.githubusercontent.com/71760326/106139535-d94d8d80-616d-11eb-8b14-10ae8ed5a11d.PNG)

These states have also been visualized in XStates, XStates can be included in the code directly. The code for XStates can be found in the documents above named "XState".

## Functions based on the solidity states
- [x] SolutionsProposed: Client can set and send a proposal to the smart contract.
- [x] ProposalDisplayed: Deliverers can fetch and display the Client's proposal.
- [x] ProposalReplied: Deliverers can accept or deny the proposal.
- [x] ProjectAgreed: Deliverers can confirm delivery of work.
- [x] Workconfirmed: Client can confirm satisfaction of delivery
- [x] ContractTransferred: Deliverers and clients can transfer the funds one the Client and the Deliverers have both confirmed delivery and satisfaction.
- [x] ContrtactAbandoned: Contract is abandoned if both parties agree to do so.



# User interface
The smart contract is accessible for both the Client and the Deliverers separately.

### **Necessary functions of the user interface for the Client's side:**
- [ ] Client can access this portal using their self sovereign identity (or their web2 account).
- [x] Client can add a description of the problem to its proposal.
- [x] Client can send the proposal to the smart contract.


- [x] Client can send a signal amount to the smart contract.


- [x] Client can cancel the contract if the Deliverers agree as well.
- [x] Client can confirm the delivered work.
- [x] Client can transfer the smart contract.

### **Necessary functions of the user interface for the Deliverer's side:**
- [ ] Deliverers can access this portal using their self sovereign identity (or their web2 account).
- [x] Deliverers can fetch the Client's proposal.
- [x] Deliverers can accept or deny this proposal.
- [x] Deliverers can send this reply (accept/deny) to the contract.
- [x] Deliverers can cancel the contract if the Client agrees as well.
- [x] Deliverers can confirm delivery of the project.
- [x] Deliverers can transfer the smart contract.


# Self Sovereign Identities
The custodian has access to an identity manager which loads or creates agents depending on the user's password. These agents can initiate a verifiable interaction. The image below depicts a simplified credential interaction visualisation.

These credentials can/will be used to authorise state transitions within the smart contract. Other than authorising state transitions, the associated agent needs to be used to sign the actual state transition on the Ethereum Blockchain. This is where problems occur: the keys associated with the agents are different than the keys used in MetaMask. What would be preferred is that both keys from the agents and MetaMask use the same root. This cannot be done yet. Therefore, at this time it is not necessary to integrate the SSI's with the smart contract, because the signal is a crucial piece in the integration.

The hhs-assignment credential folder contains several demos regarding the creation of agents and verifiable credential interactions. One of the demos is visualized as seen below.

![interaction](https://user-images.githubusercontent.com/71760326/106142181-75c55f00-6171-11eb-8418-6903b03b9139.PNG)

# Future steps to be taken
- [ ] Be able to sign an Ethereum transaction with an SSI
- [ ] Incorporate XStates within the code
- [ ] Be able to exchange verifiable JW-tokens through the smart contract.
- [ ] Incorporate loading and creation of agents, signing of Ethereum transactions and verifiable credential interactions in the user interface.
