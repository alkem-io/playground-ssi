const Backend='0x06160ab8270d3DC38905E746C1679ab57E781E4C'
const BackendABI=[
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
]

var BackendContract;
var accounts;
var STATE = false

document.getElementById('confrec').addEventListener('click', async function () {
    await BackendContract.methods.WorkConfirmed().call({
        from: web3.eth.accounts[0]
    }).catch(error => {ErrorHandling(error)});
});

document.getElementById('trans').addEventListener('click', async function () {
    await BackendContract.methods.ContractTransferred().call({from: accounts[0]}).catch(error => {ErrorHandling(error)});
});

document.getElementById('sendProp').addEventListener('click', async function () {
    var form = document.getElementById("formuliertje").elements;
    var from2 = form[0];
    var Data = String(from2.value) 
    await BackendContract.methods.SolutionsProposed(Data).send({from: accounts[0]}).catch(error => {ErrorHandling(error)});
});

document.getElementById('Cancel').addEventListener('click', async function () {
    await BackendContract.methods.ContractAbandoned().call({from: accounts[0]}).catch(error => {ErrorHandling(error)});
});

function logEvents(str,...arguments){
    var logstr=arguments.toString();
    document.getElementById("log").innerHTML +=str+" "+logstr+"\n";
}

function ErrorHandling(error){
    if (error)
        var msg = error.toString();
        msg = msg.slice(0,msg.indexOf('{'))
        msg = msg.replace('Error: execution reverted:', 'Error: ');
        alert(msg);
}

async function asyncloaded() {
    web3 = new Web3(Web3.givenProvider); // provider from metamask         
    var result= await web3.eth.requestAccounts().catch(x=>logEvents(x.message));
    logEvents(`web3 is present: ${web3.version}`); // note: use ` (back quote)
    const network = await web3.eth.net.getId().catch( (reason) => logEvents(`Cannnot find network ${reason}`) );            
    if (typeof network === 'undefined' || network != 4) 
        { logEvents("Please select Rinkeby test network");return;}
    logEvents("Ethereum network: Rinkeby")
    accounts=await web3.eth.getAccounts(); 
    BackendContract = new web3.eth.Contract(BackendABI, Backend);               
}     

window.addEventListener('load', asyncloaded); 