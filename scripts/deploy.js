const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);

  // Corrected way to get the account balance using the provider
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));
  
  // Deploy the contract
  const AnalystVault = await ethers.getContractFactory("AnalystVault");
  const analystVault = await AnalystVault.deploy();
  
  await analystVault.waitForDeployment();
  const address = await analystVault.getAddress();
  
  console.log("AnalystVault deployed to:", address);
  
  // The deployer is automatically the owner.
  // The backend service must use the deployer's private key.
  console.log("The deployer account is now the owner and can submit analysis results.");
  
  // The setOracle step is no longer needed.
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });