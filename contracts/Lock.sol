// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

interface IBlast {
    function configureClaimableGas() external;

    function claimAllGas(
        address contractAddress,
        address recipient
    ) external returns (uint256);
}

contract Lock is ERC721, Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet private _whitelist;
    uint256 private _tokenIds;
    IBlast public blastContract;
    string private _baseTokenURI;
    uint256 public constant MINT_PRICE = 0.5 ether;

    constructor() ERC721("MyERC721Token", "MET") Ownable(msg.sender) {
        // 初始化Blast合约的地址
        blastContract = IBlast(0x4300000000000000000000000000000000000002);
        // 将Gas模式设置为可认领
        blastContract.configureClaimableGas();
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    // 添加地址到白名单
    function addToWhitelist(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            _whitelist.add(addresses[i]);
        }
    }

    // 从白名单移除地址
    function removeFromWhitelist(
        address[] calldata addresses
    ) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            _whitelist.remove(addresses[i]);
        }
    }

    // 检查地址是否在白名单中
    function isWhitelisted(address addr) public view returns (bool) {
        return _whitelist.contains(addr);
    }

    function getWhitelistAddresses() public view returns (address[] memory) {
        uint256 whitelistCount = _whitelist.length(); // 获取白名单中地址的数量
        address[] memory addresses = new address[](whitelistCount); // 初始化地址数组

        for (uint256 i = 0; i < whitelistCount; i++) {
            addresses[i] = _whitelist.at(i); // 使用EnumerableSet的at方法获取索引处的地址
        }

        return addresses; // 返回地址数组
    }

    // 批量空投
    function batchAirdrop(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            _tokenIds += 1;
            _mint(addresses[i], _tokenIds);
        }
    }

    // 允许用户以0.5 ETH的价格铸造NFT
    function mint() public payable {
        require(msg.value == MINT_PRICE, "Incorrect value sent");

        _tokenIds += 1;
        _mint(msg.sender, _tokenIds);
    }

    // 允许合约所有者提取合约中的ETH
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");
        payable(owner()).transfer(balance);
    }

    // 管理员认领Gas费用
    function claimGasFees(address recipient) external onlyOwner {
        // 认领所有累积的Gas费用到指定的接收者
        blastContract.claimAllGas(address(this), recipient);
    }
}
