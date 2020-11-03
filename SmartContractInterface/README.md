# Use

**To run the interfaces together with the smartcontract:**

When in the right project folder use:
```node
npm install
```

Ensure that ```ganache-cli``` is installed globally: ```npm install -g ganache-cli```

To install the necessary node modules. After installing the necessary modules use ganchi-cli to set up a local rpc enviroment:
```node
ganache-cli
```
After setting up the local rpc enviroment deploy the smartcontract on Remix IDE on the local Web3 enviroment.
Editted both .js files according to your contract adress:
```javascript
var demoUser: 'YOUR CONTRACT ADRESS'
```
Both, Client and Deliverer, interface are ready for use! 
Please keep in mind to change,
```javascript
var democontract: web3.eth.contract(['Your ABI here'])
```
When making significant adjustments to the Remix IDE smartcontract.


**Disclaimer: node_modules are not included in the files on github.**
