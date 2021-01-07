pragma solidity ^0.6.0;

contract SignalAt2PartyConfirmation {
    enum StateContract { OPEN_FOR_SOLUTIONS, SOLUTIONS_PROPOSED, PROJECT_AGREED, PROJECT_DELIVERED, WORK_CONFIRMED, TRANSFER_OF_CONTRACT, ABANDONED }
    enum ClientAbandoned { YES }
    enum DelivererAbandoned { YES }
    StateContract private currentStateContract;
    ClientAbandoned private clientAbandoned;
    DelivererAbandoned private delivererAbandoned;
    address payable client;
    address payable deliverer;
    address payable owner;
    string store;
    uint256 state;
    
    modifier onlyClient() {
        require(msg.sender == client, "Only the client can call this method");
        _;
    }
    modifier onlyDeliverer() {
        require(msg.sender == deliverer, "Only the deliverer can call this method");
        _;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner of the smart contract can call this method");
        _;
    }
    
    constructor(address payable _client, address payable _deliverer, address payable _owner) public {
        client = _client;
        deliverer = _deliverer;
        owner = _owner;
    }
    
    function AddressesDefined() onlyOwner public {
        currentStateContract = StateContract.OPEN_FOR_SOLUTIONS;
        state = 1;
    }
    
    function CurrentStateReturned() public view returns (uint256) {
        return state;
    }
    
    function SolutionsProposed(string memory description) onlyClient public {
        require(currentStateContract == StateContract.OPEN_FOR_SOLUTIONS, "Not open for solutions yet");
        currentStateContract = StateContract.SOLUTIONS_PROPOSED;
        store = description;
        state = 2;
    }
    
    function ProposalDisplayed() onlyDeliverer public view returns (string memory) {
        require(currentStateContract == StateContract.SOLUTIONS_PROPOSED, "Solutions are not proposed yet");
        return store;
    }
    
    function ProposalReplied(bool agreed) onlyDeliverer public {
        require(currentStateContract == StateContract.SOLUTIONS_PROPOSED, "Solutions are not proposed yet");
        if (agreed) {
            currentStateContract = StateContract.PROJECT_AGREED;
            state = 3;
        }
    }
    
    function ProjectDelivered() onlyDeliverer external {
        require(currentStateContract == StateContract.PROJECT_AGREED, "Project has not yet been agreed upon");
        currentStateContract = StateContract.PROJECT_DELIVERED;
        state = 4;
    }
    
    function WorkConfirmed() onlyClient external {
        require(currentStateContract == StateContract.PROJECT_DELIVERED, "Project has not yet been delivered");
        currentStateContract = StateContract.WORK_CONFIRMED;
        state = 5;
    }
    
    function ContractTransferred() payable public {
        require(currentStateContract == StateContract.WORK_CONFIRMED, "Work has not yet been confirmed");
        require(address(this).balance > 0, "There is no balance left in the smartcontract to be transfered");
        deliverer.transfer(address(this).balance);
        currentStateContract = StateContract.TRANSFER_OF_CONTRACT;
        state = 6;
    }
    
    function ContractAbandoned() public {
        if (msg.sender == client) {
            clientAbandoned = ClientAbandoned.YES;
        }
        if (msg.sender == deliverer) {
            delivererAbandoned = DelivererAbandoned.YES;
        }
        if (clientAbandoned == ClientAbandoned.YES && delivererAbandoned == DelivererAbandoned.YES) {
            currentStateContract = StateContract.ABANDONED;
            state = 7;
            selfdestruct(owner);
        }
    }
}