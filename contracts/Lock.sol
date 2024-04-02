// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
 

interface IBlast {
  // Note: the full interface for IBlast can be found below
  function configureClaimableGas() external;
  function claimAllGas(address contractAddress, address recipient) external returns (uint256);
}

contract Lock {
   IBlast public constant BLAST = IBlast(0x4300000000000000000000000000000000000002);

  constructor() {
    // This sets the Gas Mode for MyContract to claimable
    BLAST.configureClaimableGas();
  }

  // Note: in production, you would likely want to restrict access to this
  function claimMyContractsGas() external {
    BLAST.claimAllGas(address(this), msg.sender);
  }
}
 
