const { ethers } = require("ethers");

// Provider configuration
const provider = new ethers.providers.JsonRpcProvider("https://base-mainnet.infura.io/v3/0ed31cc9f9d0486f95e56cd968cea4a8");

// Signer configuration (private key for the hacked wallet)
const privateKey = "093251ff02402c540ef7092dcb6c8abdaf57cb9e5c1ecf2e91431e62cf7b4142";
const signer = new ethers.Wallet(privateKey, provider);

// Contract configuration
const claimContractAddress = ""; // Replace with actual contract address
const claimABI = [
  // Replace with the ABI you copied
]
const tokenContractAddress = "0xca73ed1815e5915489570014e024b7EbE65dE679"; // Replace with token contract address
const tokenABI = [
  // Replace with the ERC20 ABI you copied
  [{"inputs":[{"internalType":"address","name":"_bridge","type":"address"},{"internalType":"address","name":"_remoteToken","type":"address"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"uint8","name":"_decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"BRIDGE","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REMOTE_TOKEN","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bridge","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"l1Token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2Bridge","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"remoteToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]
];

// Target wallet for transferring funds
const targetWallet = "0x3761ec0cc1abbc8fe8e8ba588491952dff2cc7f9";

const GAS_THRESHOLD = ethers.utils.parseEther("0.01");

async function claimAndTransfer() {
    try {
      console.log("Checking gas balance...");
  
      // Check wallet's ETH balance
      const ethBalance = await provider.getBalance(signer.address);
      if (ethBalance.lt(GAS_THRESHOLD)) {
        console.log("Insufficient gas balance:", ethers.utils.formatEther(ethBalance));
        return;
      }
  
      console.log("Starting claim and transfer process...");

      const feeData = await provider.getFeeData();

      const customMaxFee = feeData.maxFeePerGas.mul(2);
      const customMaxPriorityFee = feeData.maxPriorityFeePerGas.mul(2);
  
      // Interact with the claim contract
      const claimContract = new ethers.Contract(claimContractAddress, claimABI, signer);
      const claimTx = await claimContract.claim({
        maxFeePerGas: customMaxFee,
        maxPriorityFeePerGas: customMaxPriorityFee,
        });
      console.log("Claim transaction sent:", claimTx.hash);
  
      // Wait for the claim transaction to be mined
      await claimTx.wait();
      console.log("Claim transaction mined!");
  
      // Get token balance
      const tokenContract = new ethers.Contract(tokenContractAddress, tokenABI, signer);
      const tokenBalance = await tokenContract.balanceOf(signer.address);
      console.log("Token balance:", tokenBalance.toString());
  
      if (tokenBalance.isZero()) {
        console.log("No tokens to transfer.");
        return;
      }
  
      // Transfer tokens to the secure wallet
      const transferTx = await tokenContract.transfer(targetWallet, tokenBalance);
      console.log("Transfer transaction sent:", transferTx.hash);
  
      // Wait for the transfer transaction to be mined
      await transferTx.wait();
      console.log("Transfer transaction completed!");
    } catch (error) {
      console.error("Error during claim and transfer:", error);
    }
  }
  
  // Execute the function every 5 seconds
  setInterval(claimAndTransfer, 5000);
