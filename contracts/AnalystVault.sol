// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AnalystVault is Ownable {
    uint256 public constant FEE = 0.001 ether;
    uint256 private nextRequestId = 1;
    
    mapping(uint256 => string) public analysisResults;
    mapping(uint256 => bool) public requestFulfilled;
    mapping(uint256 => address) public requestToUser;
    
    event AnalysisRequested(uint256 indexed requestId, address indexed user, string tokenSymbol);
    event AnalysisSubmitted(uint256 indexed requestId, string ipfsHash);
    
    // Note: The oracle and onlyOracle modifier have been removed for simplicity.
    // The onlyOwner modifier from Ownable.sol is used instead.
    
    constructor() Ownable(msg.sender) {}
    
    function requestAnalysis(string calldata _tokenSymbol) external payable {
        require(msg.value == FEE, "Incorrect fee amount");
        require(bytes(_tokenSymbol).length > 0, "Token symbol cannot be empty");
        
        uint256 requestId = nextRequestId;
        nextRequestId++;
        
        requestToUser[requestId] = msg.sender;
        requestFulfilled[requestId] = false;
        
        emit AnalysisRequested(requestId, msg.sender, _tokenSymbol);
    }
    
    // Changed from onlyOracle to onlyOwner. Only the contract deployer can submit analysis.
    function submitAnalysis(uint256 _requestId, string calldata _ipfsHash) external onlyOwner {
        require(_requestId < nextRequestId, "Invalid request ID");
        require(!requestFulfilled[_requestId], "Request already fulfilled");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        analysisResults[_requestId] = _ipfsHash;
        requestFulfilled[_requestId] = true;
        
        emit AnalysisSubmitted(_requestId, _ipfsHash);
    }
    
    function getAnalysis(uint256 _requestId) external view returns (string memory) {
        require(requestFulfilled[_requestId], "Analysis not yet available");
        return analysisResults[_requestId];
    }
    
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}