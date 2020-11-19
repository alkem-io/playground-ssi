const BigNumber = require('bignumber.js');

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    console.log(web3);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    console.log(web3);
}

web3.eth.defaultAccount = web3.eth.accounts[0];

var demoContract = web3.eth.contract([
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "_Client",
                "type": "address"
            },
            {
                "internalType": "address payable",
                "name": "_deliverer",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "LogFundsReceived",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "SatisfiedCustomer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "SignalAmount",
        "outputs": [],
        "payable": true,
        "type": "function"
    },
    {
        "inputs": [],
        "name": "WorkDeliverd",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
]);

var demoUser = demoContract.at('0xA788a7982BE56cC25e787E92D4A05B706542fC14');

document.getElementById('sendButton').addEventListener('click', function () {
    demoUser.SignalAmount({
        from: web3.eth.accounts[0],
        value: document.getElementById('Signalamount').value,
    })
});

document.getElementById('confrec').addEventListener('click', function () {
    demoUser.SatisfiedCustomer({
        from: web3.eth.accounts[0]
    })
});

document.getElementById('confdel').addEventListener('click', function () {
    demoUser.WorkDeliverd({
        from: web3.eth.accounts[1]
    })
});

document.getElementById('trans').addEventListener('click', function () {
    demoUser.transfer()
});

var XAMOUNT = document.getElementById('AmountButton').addEventListener('click', function () {
    demoUser.getBalance()
});

document.getElementById("insert").innerHTML = XAMOUNT