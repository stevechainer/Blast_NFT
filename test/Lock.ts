import { expect } from "chai";
import hre from "hardhat";
import artifacts from "../ignition/deployments/chain-168587773/artifacts/LockModule#v_2.json";
import deployed_addresses from "../ignition/deployments/chain-168587773/deployed_addresses.json";
let lock: any;

let owner: { provider: any; address: string };
let addr1: { provider: any; address: string };

const MINT_PRICE = 0.001  ;

before(async function () {
  // 部署合约
  // lock = await hre.ethers.deployContract("Lock", [], {});
  [owner, addr1] = await ethers.getSigners();
  // 使用已部署的合约
  lock = await hre.ethers.getContractAt(
    artifacts.abi,
    deployed_addresses["LockModule#v_2"]
  );
});

// describe("Base_Test", function () {
//   it("Check name", async function () {
//     expect(await lock.name()).to.equal("MyERC721Token");
//   });
// });

// describe("Whitelist management", function () {
//   it("Should add and remove an address from the whitelist", async function () {
//     await lock.addToWhitelist([addr1.address]);
//     expect(await lock.isWhitelisted(addr1.address)).to.equal(true);

//     await lock.removeFromWhitelist([addr1.address]);
//     expect(await lock.isWhitelisted(addr1.address)).to.equal(false);
//   });
// });

describe("Mint functionality in Whitelist phase", async function () {
  it("Whitelist phase: should mint a new token for 0.5 ETH", async function () {
    // 假设addToWhitelist是添加地址到白名单的函数
    await lock.addToWhitelist([owner.address]);

    // 设置销售阶段到白名单
    await lock.setSalePhase(0); // 假设0代表白名单阶段

    await expect(
      lock.connect(owner).mint({ value: ethers.parseEther(MINT_PRICE) })
    )
      .to.emit(lock, "Transfer")
      .withArgs("0x0000000000000000000000000000000000000000", owner.address, 1);

    expect(await lock.ownerOf(1)).to.equal(owner.address);

    await expect(
      lock.connect(owner).mint({ value: ethers.parseEther(MINT_PRICE) })
    ).to.be.revertedWith("Already minted in this phase");
  });

  it("Whitelist phase: should fail if the address is not in whitelist", async function () {
    // 切换到一个不在白名单中的用户
    await lock.setSalePhase(0); // 确保仍在白名单阶段
    await expect(
      lock.connect(addr1).mint({ value: ethers.parseEther(MINT_PRICE) })
    ).to.be.revertedWith("Not in whitelist");
  });
});

// describe("Mint functionality in Public phase", async function () {
//   it("Public phase: should allow anyone to mint with correct price", async function () {
//     // 设置销售阶段到公售
//     await lock.setSalePhase(1); // 假设1代表公售阶段

//     await expect(
//       lock.connect(addr1).mint({ value: ethers.parseEther(MINT_PRICE) })
//     )
//       .to.emit(lock, "Transfer")
//       .withArgs("0x0000000000000000000000000000000000000000", addr1.address, 2); // 假设这是第二个铸造的令牌

//     expect(await lock.ownerOf(2)).to.equal(addr1.address);
//   });

//   it("Public phase: should fail if the mint price is incorrect", async function () {
//     await lock.setSalePhase(1); // 确保在公售阶段
//     await expect(
//       lock.connect(addr1).mint({ value: ethers.parseEther("0.1") })
//     ).to.be.revertedWith("Incorrect value sent");
//   });
// });

// describe("batchAirdrop functionality", function () {
//   it("batchAirdrop ", async function () {
//     // 准备批量空投的地址数组
//     const addresses = [owner.address, addr1.address];
//     const beforeBalances = await Promise.all(
//       addresses.map(async (address) => await lock.balanceOf(address))
//     );

//     // 执行批量空投
//     await lock.batchAirdrop(addresses);

//     // 检查每个地址的余额是否正确增加
//     for (let i = 0; i < addresses.length; i++) {
//       const afterBalance = await lock.balanceOf(addresses[i]);
//       expect(afterBalance).to.equal(beforeBalances[i] + BigInt(1)); // 假设每次空投增加1个代币
//     }
//   });
// });

// describe("Withdraw", function () {
//   it("should allow the owner to withdraw funds", async function () {
//     // First, mint a new token to ensure there are funds in the contract
//     await lock.connect(owner).mint({ value: ethers.parseEther(MINT_PRICE) });

//     const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

//     const tx = await lock.connect(owner).withdraw();
//     const receipt = await tx.wait();
//     const transactionFee = receipt.gasUsed * receipt.gasPrice; // 使用`gasUsed`和`gasPrice`来计算交易费

//     const finalOwnerBalance = await ethers.provider.getBalance(owner.address);

//     //  检查最终余额是否正确（初始余额 + 0.5 ETH - 提现调用的交易费）
//     expect(finalOwnerBalance.toString().substring(0, 3)).to.equal(
//       (initialOwnerBalance + ethers.parseEther(MINT_PRICE) - transactionFee)
//         .toString()
//         .substring(0, 3)
//     );

//     console.log(1, finalOwnerBalance.toString().substring(0, 3));
//     console.log(
//       2,
//       (initialOwnerBalance + ethers.parseEther(MINT_PRICE) - transactionFee)
//         .toString()
//         .substring(0, 3)
//     );
//   });

//   it("should fail if a non-owner tries to withdraw funds", async function () {
//     await expect(lock.connect(addr1).withdraw()).to.be.reverted;
//   });
// });

// describe("Base URI Management", function () {
//   it("setBaseURI ", async function () {
//     await lock.setBaseURI("baidu.com/");
//     let tokenURI = await lock.tokenURI(1);
//     expect(tokenURI).to.equal("baidu.com/1");
//   });

//   it("non-owner setBaseURI", async function name() {
//     await expect(lock.connect(addr1).setBaseURI("baidu.com/")).to.be.reverted;
//   });
// });
