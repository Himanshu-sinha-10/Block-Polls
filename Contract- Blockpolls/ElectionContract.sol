// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


contract BlockPolls {
    

    struct Candidate {
        string name;
        uint vote_count;
    }
    
    struct Voter {
        bool authorized;
        bool voted;
        uint vote_to; // index of candidate which this voter wants to vote
    }

    address payable public owner; // the owner of this contract
    string public pollName;
    
    mapping(address => Voter) public voters; //this is a map with key=address and value=voter(our struct)
    Candidate[] public candidates; // an array to store the candidates of the election
    uint public total_votes_polled;
    
    // state variables declaration ends here
    
    
    // constructor function
   constructor(string memory _pollName)  { 
        // set two things here-> election name and owner of the contract
        
        owner = payable(msg.sender); // msg is a global object and msg.sender is the address of the owner of this contract (accounts[0])
        pollName = _pollName;
    }
    
    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }
    
    // add new candidates
    function addCandidate(string memory _candidate) ownerOnly public { // modifier is added to ensure only owner of this contract adds a new candidate
      Candidate memory new_candidate = Candidate(_candidate,0);
      candidates.push(new_candidate);
     // candidates.push(Candidate(_candidate,0));
        
    }
    
    
    //function to return total number of candidates
    function number_of_candidates() public view returns(uint) { // constant is deprecated so we use view(this specifies this function will only read data)
     return candidates.length;    
    }
    
    //function to authorize voters
    function authorize(address _new_person) ownerOnly public {
        voters[_new_person].authorized = true; //voters is a map
    }
    
    //function to vote
    function upvote(uint _index_of_candidate) public {
        require(voters[msg.sender].authorized == true);
        require(voters[msg.sender].voted == false);
        
        candidates[_index_of_candidate].vote_count++;
        
        voters[msg.sender].voted = true;
        voters[msg.sender].vote_to = _index_of_candidate;
        total_votes_polled++;
        
        
    }
    
    
    
    //function to finish the election
    function end_polling() ownerOnly public {
        
        selfdestruct(owner);
    }
    
    
  
    
    
    

    



}