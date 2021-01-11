const Backend = '0x55095f20a27ab0E74cb571bc9806844a8e970F7C'
const BackendABI = [
    {
        "inputs": [],
        "name": "AddressesDefined",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
	},
    {
        "inputs": [],
        "name": "ContractAbandoned",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
	},
    {
        "inputs": [],
        "name": "ContractTransferred",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
	},
    {
        "inputs": [],
        "name": "ProjectDelivered",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "name": "ProposalReplied",
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
        "name": "SolutionsProposed",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
	},
    {
        "inputs": [],
        "name": "WorkConfirmed",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
	},
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
			},
            {
                "internalType": "address payable",
                "name": "_owner",
                "type": "address"
			}
		],
        "stateMutability": "nonpayable",
        "type": "constructor"
	},
    {
        "inputs": [],
        "name": "CurrentStateReturned",
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
        "name": "ProposalDisplayed",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
			}
		],
        "stateMutability": "view",
        "type": "function"
	}
]

var accounts;
var STATE = false
var BackendContract;
var CurrentState;

document.getElementById('confdel').addEventListener('click', async function () {
    await BackendContract.methods.ProjectDelivered().send({
        from: accounts[0]
    }).catch(error => {
        ErrorHandling(error)
    });
    location.reload();
    return false;
});

document.getElementById('trans').addEventListener('click', async function () {
    await BackendContract.methods.ContractTransferred().send({
        from: accounts[0]
    }).catch(error => {
        ErrorHandling(error)
    })
    location.reload();
    return false;
});

document.getElementById('Accept').addEventListener('click', function () {
    STATE = true
});

document.getElementById('Deny').addEventListener('click', function () {
    STATE = false
});

document.getElementById('reply').addEventListener('click', async function () {
    await BackendContract.methods.ProposalReplied(STATE).send({
        from: accounts[0]
    }).catch(error => {
        ErrorHandling(error)
    });
    location.reload();
    return false;
});

document.getElementById('Fetch').addEventListener('click', async function () {
    var info = await BackendContract.methods.ProposalDisplayed().call({
        from: accounts[0]
    }).catch(error => {
        ErrorHandling(error)
    });
    document.getElementById('Dinfo').innerHTML = info;
});

document.getElementById('Cancel').addEventListener('click', async function () {
    await BackendContract.methods.ContractAbandoned().call({
        from: accounts[0]
    }).catch(error => {
        ErrorHandling(error)
    });
    location.reload();
    return false;
});

function logEvents(str, ...arguments) {
    var logstr = arguments.toString();
    document.getElementById("log").innerHTML += str + " " + logstr + "\n";
}

function ErrorHandling(error) {
    if (error)
        var msg = error.toString();
    msg = msg.slice(0, msg.indexOf('{'))
    msg = msg.replace('Error: execution reverted:', 'Error: ');
    alert(msg);
}

async function asyncloaded() {
    web3 = new Web3(Web3.givenProvider); // provider from metamask    
    var result = await web3.eth.requestAccounts().catch(x => logEvents(x.message));
    logEvents(`web3 is present: ${web3.version}`); // note: use ` (back quote)
    const network = await web3.eth.net.getId().catch((reason) => logEvents(`Cannnot find network ${reason}`));
    if (typeof network === 'undefined' || network != 4) {
        logEvents("Please select Rinkeby test network");
        return;
    }
    logEvents("Ethereum network: Rinkeby")
    accounts = await web3.eth.getAccounts();
    logEvents(`Current connected account: ${accounts[0]}`);
    BackendContract = new web3.eth.Contract(BackendABI, Backend);
    CurrentState = await BackendContract.methods.CurrentStateReturned().call({
        from: accounts[0]
    }).catch(error => {
        ErrorHandling(error)
    });
    logEvents(`Currentstate: ${CurrentState}`);

    if (CurrentState == 7) {
        document.querySelectorAll("a1", "a2", "a3", "a4", "a5", "a6", "a7").style.display = block;
    } else if (CurrentState == 6) {
        document.querySelectorAll("a1", "a2", "a3", "a4", "a5", "a6").style.display = block;
    } else if (CurrentState == 5) {
        document.querySelectorAll("a1", "a2", "a3", "a4", "a5").style.display = block;
    } else if (CurrentState == 4) {
        document.querySelectorAll("a1", "a2", "a3", "a4").style.display = block;
    } else if (CurrentState == 3) {
        document.querySelectorAll("a1", "a2", "a3").style.display = block;
    } else if (CurrentState == 2) {
        document.querySelectorAll("a1", "a2").style.display = block;
    } else if (CurrentState == 1) {
        document.querySelectorAll("a1").style.display = block;
    } else if (CurrentState == 0) {
        document.querySelectorAll("a1").style.display = block;
    }
}

window.addEventListener('load', asyncloaded);
