import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const { vars } = require("hardhat/config");
const PRIVATE_KEY = vars.get("KEY"); //main
const PRIVATE_KEY1 = vars.get("KEY1"); //t1
const Blast_sepolia_test_key = vars.get("Blast_sepolia_test_key");
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    "blast-mainnet": {
      url: "https://rpc.blast.io",
      accounts: [PRIVATE_KEY as string],
      gasPrice: 1000000000,
    },
    "blast-sepolia": {
      url: "https://sepolia.blast.io",
      accounts: [
        Blast_sepolia_test_key as string,
        PRIVATE_KEY as string,
        PRIVATE_KEY1 as string,
      ],
      gasPrice: 1000000000,
    },
    hardhat: {
      // forking: {
      //   url: "https://sepolia.blast.io",
      //   blockNumber: 12
      // }
    },
  },
};

export default config;
