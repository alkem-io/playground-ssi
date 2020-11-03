if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    console.log(web3);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    console.log(web3);
}

web3.eth.defaultAccount = web3.eth.accounts[0];

var demoUser = web3.eth.contract([
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "_client",
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
        "inputs": [],
        "name": "DisplayProposal",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "agreed",
                "type": "bool"
            }
        ],
        "name": "ProposalReply",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            }
        ],
        "name": "ProposalSend",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "SatisfiedClient",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "SignalAmount",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "Transfer",
        "outputs": [],
        "payable": true,
        "type": "function"
    },
    {
        "inputs": [],
        "name": "WorkDelivered",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]).at('0x1c6ee084E7459Ec3bE43aa21ccE720C615287b4B');

var STATE = false

document.getElementById('sendButton').addEventListener('click', function () {
    demoUser.SignalAmount({
        from: web3.eth.accounts[0],
        value: document.getElementById('Signalamount').value,
    })
});

document.getElementById('confrec').addEventListener('click', function () {
    demoUser.SatisfiedClient({
        from: web3.eth.accounts[0]
    })
});

document.getElementById('trans').addEventListener('click', function () {
    demoUser.Transfer()
});

document.getElementById('sendProp').addEventListener('click', function () {
    var form = document.getElementById("formuliertje").elements;
    var from2 = form[0];
    demoUser.ProposalSend(String(from2.value));
});
