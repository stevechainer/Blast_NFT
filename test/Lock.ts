import { expect } from "chai";
import hre from "hardhat";
import artifacts from "../ignition/deployments/chain-168587773/artifacts/LockModule#v_2.json";
import deployed_addresses from "../ignition/deployments/chain-168587773/deployed_addresses.json";
let lock: any;
let signers: any;
let owner: { provider: any; address: string };
let addr1: { provider: any; address: string };
before(async function () {
  // 部署合约
  // lock = await hre.ethers.deployContract("Lock", [], {});
  [owner, addr1] = await ethers.getSigners(3);
  // 使用已部署的合约
  lock = await hre.ethers.getContractAt(
    artifacts.abi,
    deployed_addresses["LockModule#v_2"]
  );
  signers = await ethers.getSigners();
});

describe("Base_Test", function () {
  it("Check name", async function () {
    expect(await lock.name()).to.equal("MyERC721Token");
  });
});

describe("Whitelist management", function () {
  it("Should add and remove an address from the whitelist", async function () {
    await lock.addToWhitelist([addr1.address]);
    expect(await lock.isWhitelisted(addr1.address)).to.equal(true);

    await lock.removeFromWhitelist([addr1.address]);
    expect(await lock.isWhitelisted(addr1.address)).to.equal(false);
  });
});

describe("Mint functionality", function () {
  it("batchAirdrop ", async function () {
    // 准备批量空投的地址数组
    const addresses = [owner.address,addr1.address];
    const beforeBalances = await Promise.all(
      addresses.map(async (address) => await lock.balanceOf(address))
    );

    // 执行批量空投
    await lock.batchAirdrop(addresses);

    // 检查每个地址的余额是否正确增加
    for (let i = 0; i < addresses.length; i++) {
      const afterBalance = await lock.balanceOf(addresses[i]);
      expect(afterBalance).to.equal(beforeBalances[i] + BigInt(1)); // 假设每次空投增加1个代币
    }
  });

  it("should mint a new token for 0.5 ETH", async function () {
    let address=signers[0].address
    await expect(lock.connect(address).mint({ value: ethers.utils.parseEther("0.5") }))
      .to.emit(lock, 'Transfer')
      .withArgs(ethers.constants.AddressZero, address);

    expect(await lock.ownerOf(1)).to.equal(address);
  });

  it("should fail if the mint price is incorrect", async function () {
    let address=signers[0].address
    await expect(lock.connect(address).mint({ value: ethers.utils.parseEther("0.1") }))
      .to.be.revertedWith("Incorrect value sent");
  });
});

// describe("Withdraw", function () {
//   it("should allow the owner to withdraw funds", async function () {
//     // First, mint a new token to ensure there are funds in the contract
//     await lock.connect(addr1).mint({ value: ethers.utils.parseEther("0.5") });

//     // Check the initial balance of the owner
//     const initialOwnerBalance = await owner.getBalance();

//     // Withdraw funds
//     const tx = await lock.connect(owner).withdraw();
//     const receipt = await tx.wait();
//     const transactionFee = receipt.effectiveGasPrice.mul(receipt.cumulativeGasUsed);

//     // Check the final balance of the owner
//     const finalOwnerBalance = await owner.getBalance();

//     expect(finalOwnerBalance).to.equal(initialOwnerBalance.add(ethers.utils.parseEther("0.5")).sub(transactionFee));
//   });

//   it("should fail if a non-owner tries to withdraw funds", async function () {
//     await expect(lock.connect(addr1).withdraw())
//       .to.be.revertedWith("Ownable: caller is not the owner");
//   });
// });

describe("Base URI Management", function () {
  it("setBaseURI ", async function () {
    await lock.setBaseURI("baidu.com/");
    let tokenURI = await lock.tokenURI(1);
    expect(tokenURI).to.equal("baidu.com/1");
  });
});
