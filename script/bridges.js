/**
 *  执行跨链桥
 *  npx hardhat run script/bridges.js
 */

const { ethers } = require("ethers");
const { vars } = require("hardhat/config");
const PRIVATE_KEY = vars.get("KEY");

// This is for Blast Sepolia Testnet, not Blast mainnet
const BlastBridgeAddress = "0xc644cc19d2A9388b71dd1dEde07cFFC73237Dca8";

// Providers for Sepolia and Blast networks
const sepoliaProvider = new ethers.providers.JsonRpcProvider(
  `https://rpc-sepolia.rockx.com`
);
const blastProvider = new ethers.providers.JsonRpcProvider(
  "https://sepolia.blast.io"
);

// Wallet setup
const wallet = new ethers.Wallet(PRIVATE_KEY);
const sepoliaWallet = wallet.connect(sepoliaProvider);
const blastWallet = wallet.connect(blastProvider);

// Transaction to send 0.1 Sepolia ETH
const tx = {
  to: BlastBridgeAddress,
  value: ethers.utils.parseEther("3"),
};

async function run() {
  const transaction = await sepoliaWallet.sendTransaction(tx);
  await transaction.wait();

  // Confirm the bridged balance on Blast
  const balance = await blastProvider.getBalance(wallet.address);
  console.log(`Balance on Blast: ${ethers.utils.formatEther(balance)} ETH`);
}
run();
