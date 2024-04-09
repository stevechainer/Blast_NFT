import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ERC721NFTModule = buildModule("ERC721NFTModule", (m) => {


  const ERC721NFT = m.contract("ERC721NFT", [], {
    id:'v_2'
  });

  return { ERC721NFT };
});

export default ERC721NFTModule;
