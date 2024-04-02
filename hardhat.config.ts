import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const { vars } = require("hardhat/config");
const PRIVATE_KEY = vars.get("KEY");
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
      accounts: [PRIVATE_KEY as string],
      gasPrice: 1000000000,
    },
  },
};

export default config;
