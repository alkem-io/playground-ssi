pragma solidity ^0.6.0;

contract SignalAt2PartyConfirmation {
    enum StateClient { START, PROPOSAL_SEND, PROPOSAL_AGREED, PROPOSAL_DENIED, AWAITING_TRANSFER, AWAITING_DELIVERY, COMPLETE }
    enum StateDeliverer { START, PROPOSAL_SEND, PROPOSAL_AGREED, PROPOSAL_DENIED, AWAITING_TRANSFER, AWAITING_DELIVERY, COMPLETE }
    StateClient private currentStateClient;
    StateDeliverer private currentStateDeliverer;
    address payable client;
    address payable deliverer;
    string store;
    
    modifier onlyClient() {
        require(msg.sender == client, "Only client can call this method");
        _;
    }
    modifier onlyDeliverer() {
        require(msg.sender == deliverer, "Only deliverer can call this method");
        _;
    }
    constructor(address payable _client, address payable _deliverer) public {
        client = _client;
        deliverer = _deliverer;
    }
    
    function ProposalSend(string memory description) onlyClient public {
        currentStateClient = StateClient.PROPOSAL_SEND;
        store = description;
    }
    
    function DisplayProposal() onlyDeliverer public view returns (string memory){
        require(currentStateClient == StateClient.PROPOSAL_SEND, "Client did not send a propsal yet" );
        return store;
    }
    
    function ProposalReply(bool agreed) public {
        require(currentStateClient == StateClient.PROPOSAL_SEND, "Client did not send proposal yet");
        if (agreed) {
            currentStateDeliverer = StateDeliverer.PROPOSAL_AGREED;
        }
            else {
                currentStateDeliverer = StateDeliverer.PROPOSAL_DENIED;
            }
    }
    
    function SignalAmount() onlyClient public payable {
        require(currentStateDeliverer == StateDeliverer.PROPOSAL_AGREED, "Deliverer did not agree on proposal yet");
        currentStateClient = StateClient.AWAITING_DELIVERY;
    }
    function WorkDelivered() onlyDeliverer external {
        currentStateDeliverer = StateDeliverer.COMPLETE;
    }
    function SatisfiedClient() onlyClient external {
        currentStateClient = StateClient.COMPLETE;
    }
    function Transfer() payable public {
        require(currentStateClient == StateClient.COMPLETE && currentStateDeliverer == StateDeliverer.COMPLETE,
                "Disagreement on project completion");
        require(address(this).balance > 0, "There is no balance left in the smartcontract to be transfered");
        deliverer.transfer(address(this).balance);
    }
}
