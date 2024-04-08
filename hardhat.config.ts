import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const { vars } = require("hardhat/config");
const PRIVATE_KEY = vars.get("KEY");
const PRIVATE_KEY1 = vars.get("KEY1");
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
      accounts: ['a8ae19daf73af8327dae964d1dd543e3badae45e1b5a68b78733ba9d919d1102',PRIVATE_KEY as string, PRIVATE_KEY1 as string],
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
