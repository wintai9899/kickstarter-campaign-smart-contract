pragma solidity ^0.4.17; 

contract CampaignFactory{

    address[] public deployedCampaigns; 

    function createCampaign(uint minimum) public{
        address newCampaign = new Campaign(minimum, msg.sender);
        // store address of new campaign
        deployedCampaigns.push(newCampaign);

    }

    function getDeployedCampaigns() public view returns(address[]){
        return deployedCampaigns;
    }
}

contract Campaign{

    // handle requests
    struct Request{
        string description;
        uint value;
        address recipient;
        bool isComplete;
        mapping(address => bool) approvals; 
        uint approvalCount;
    }

    address public manager;
    uint public minimumContribution;
    uint public contributorsCount;
    mapping(address => bool) public approvers;
    // declare dynamic array of Requests
    Request[] public requestsArray;

    //function modifier for manager only 
    modifier restrictedToManager(){
        require(msg.sender == manager);
        _;
    }

    // constructor function
    function Campaign(uint minimum, address creator) public{
        // stores the address of contract creator
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable{
        // contribute money must be greater than minimum contribution 
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        contributorsCount++;
    }

    function createRequest(string description, uint value, address recipient ) public restrictedToManager{
  
        Request memory newRequest = Request({
            description : description,
            value : value,
            recipient : recipient,
            isComplete : false,
            approvalCount: 0
            
        });

        //Alternative syntax : Similar to python create instance of class
        //Request newRequest = Request(description, value, recipient, false);

        // push new request to array 
        requestsArray.push(newRequest);

    }

    function approveRequest(uint index) public{
        Request storage CurrentRequest = requestsArray[index];
        // check if the person has contributed 
        require(approvers[msg.sender]);
        // check if the person has already voted, if true -> reject
        require(!CurrentRequest.approvals[msg.sender]);

        // increment approval counts
        CurrentRequest.approvalCount++; 
    }

    function finaliseRequest(uint index) public restrictedToManager{
        Request storage curRequest = requestsArray[index];
        
        // votes need to be more than half of the people
        require(curRequest.approvalCount > (contributorsCount / 2));
        // check current request is not completed yet
        require(!curRequest.isComplete);

        // send money 
        curRequest.recipient.transfer(curRequest.value);

        // mark request as completed
        curRequest.isComplete = true;
    }
}