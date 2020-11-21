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
        "name": "CancelAgreement",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
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
        "payable": true,
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
]).at('0x17a73EF0807DF0a18Ef5967f0EC909820b83A98c');

var STATE = false

document.getElementById('confdel').addEventListener('click', function () {
    demoUser.WorkDelivered({
        from: web3.eth.accounts[1]
    })
});

document.getElementById('trans').addEventListener('click', function () {
    demoUser.Transfer()
});

document.getElementById('Accept').addEventListener('click', function () {
    STATE = true
});

document.getElementById('Deny').addEventListener('click', function () {
    STATE = false
});

document.getElementById('reply').addEventListener('click', function () {
    demoUser.ProposalReply(STATE)
});

document.getElementById('Fetch').addEventListener('click', async function () {
    info = demoUser.DisplayProposal.call({ from: web3.eth.accounts[1] })
    document.getElementById('Dinfo').innerHTML = info;   
});

document.getElementById('Cancel').addEventListener('click', function () {
    demoUser.CancelAgreement();
});
