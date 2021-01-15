const Backend = '0x9e178f0AD91b3A05bD9042e680A8fb3Fd7CB3657'
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

var BackendContract;
var accounts;
var STATE = false
var CurrentState;

document.getElementById('confrec').addEventListener('click', async function () {
    await BackendContract.methods.WorkConfirmed().send({
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
    });
    location.reload();
    return false;
});

document.getElementById('sendProp').addEventListener('click', async function () {
    var form = document.getElementById("formuliertje").elements;
    var from2 = form[0];
    var Data = String(from2.value);
    await BackendContract.methods.SolutionsProposed(Data).send({
        from: accounts[0]
    }).catch(error => {
        ErrorHandling(error)
    });
    location.reload();
    return false;
});

document.getElementById('Cancel').addEventListener('click', async function () {
    await BackendContract.methods.ContractAbandoned().send({
        from: accounts[0]
    }).catch(error => {
        ErrorHandling(error)
    });
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

    if (CurrentState == 7 || CurrentState == 'undefined') {
        for(i = 1; i < 8; i++){
            document.querySelector(`#a${i}`).style.display = 'none';
        document.querySelector(`#a8`).style.display = 'block';
        }    
            
    } else if (CurrentState == 6) {
        for(i = 1; i < 8; i++){
            document.querySelector(`#a${i}`).style.display = 'block';
            }
    } else if (CurrentState == 5) {
        for(i = 1; i < 7; i++){
            document.querySelector(`#a${i}`).style.display = 'block';
            }
    } else if (CurrentState == 4) {
        for(i = 1; i < 6; i++){
            document.querySelector(`#a${i}`).style.display = 'block';
            }
    } else if (CurrentState == 3) {
        for(i = 1; i < 5; i++){
            document.querySelector(`#a${i}`).style.display = 'block';
            }
    } else if (CurrentState == 2) {
        for(i = 1; i < 4; i++){
        document.querySelector(`#a${i}`).style.display = 'block';
        }
    } else if (CurrentState == 1) {
        for(i = 1; i < 2; i++){
            document.querySelector(`#a${i}`).style.display = 'block';
            }
    } else if (CurrentState == 0) {
        for(i = 1; i < 2; i++){
            document.querySelector(`#a${i}`).style.display = 'block';
            }
    }
}

window.addEventListener('load', asyncloaded);
