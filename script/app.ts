
import {ethers} from 'ethers';
import artifacts from '../ignition/deployments/chain-168587773/artifacts/LockModule#v_2.json';
import deployed_addresses from '../ignition/deployments/chain-168587773/deployed_addresses.json';
const { vars } = require("hardhat/config");
const PRIVATE_KEY = vars.get("KEY");
async function main() {
    // 合约地址
    const contractAddress = deployed_addresses['LockModule#v_2'];
  
    let provider = new ethers.JsonRpcProvider("https://sepolia.blast.io")
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    let contract = new ethers.Contract(contractAddress, artifacts.abi, signer)
    let name = await contract.name()
    console.log(name)

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log('报错了')
      console.error(error);
      process.exit(1);
    });