// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./Blast.sol";

contract ERC721NFT is ERC721, Ownable, AccessControl {
    using EnumerableSet for EnumerableSet.AddressSet;
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    EnumerableSet.AddressSet private _whitelist;
    uint256 private _tokenIds;
    IBlast public blastContract;
    string private _baseTokenURI;
    mapping(address => bool) public hasMintedInWhitelist; // 追踪是否已经在白名单阶段铸造
    uint256 public constant MINT_PRICE = 0.00002 ether; //mint 价格

    enum SalePhase {
        Whitelist,
        Public
    } // 销售阶段枚举
    SalePhase public salePhase; // 当前销售阶段状态变量

    constructor() ERC721("ChatyN ZHOU", "ZHOU") Ownable(msg.sender) {
        salePhase = SalePhase.Whitelist; // 默认开始于白名单阶段

        // 初始化Blast合约的地址
        blastContract = IBlast(0x4300000000000000000000000000000000000002);
        // 将Gas模式设置为可认领
        blastContract.configureClaimableGas();

        setupRole(DEFAULT_ADMIN_ROLE, msg.sender); // 给部署者管理员角色
        setupRole(OPERATOR_ROLE, msg.sender); // 同时给部署者运营角色
    }

    function setupRole(bytes32 role, address account) public onlyOwner {
        _grantRole(role, account);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public {
        require(
            hasRole(OPERATOR_ROLE, msg.sender) || owner() == msg.sender,
            "Must have operator role or be owner"
        );
        _baseTokenURI = baseURI;
    }

    // 设置销售阶段
    function setSalePhase(SalePhase phase) external {
        require(
            hasRole(OPERATOR_ROLE, msg.sender) || owner() == msg.sender,
            "Must have operator role or be owner"
        );
        salePhase = phase;
    }

    // 添加地址到白名单
    function addToWhitelist(address[] calldata addresses) external {
        require(
            hasRole(OPERATOR_ROLE, msg.sender) || owner() == msg.sender,
            "Must have operator role or be owner"
        );
        for (uint256 i = 0; i < addresses.length; i++) {
            _whitelist.add(addresses[i]);
        }
    }

    // 从白名单移除地址
    function removeFromWhitelist(address[] calldata addresses) external {
        require(
            hasRole(OPERATOR_ROLE, msg.sender) || owner() == msg.sender,
            "Must have operator role or be owner"
        );
        for (uint256 i = 0; i < addresses.length; i++) {
            _whitelist.remove(addresses[i]);
        }
    }

    // 检查地址是否在白名单中
    function isWhitelisted(address addr) public view returns (bool) {
        return _whitelist.contains(addr);
    }

    // 查询所有白名单
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

    // 修改mint函数以适应分阶段铸造
    function mint() public payable {
        require(msg.value == MINT_PRICE, "Incorrect value sent");
        if (salePhase == SalePhase.Whitelist) {
            require(isWhitelisted(msg.sender), "Not in whitelist");
            require(
                !hasMintedInWhitelist[msg.sender],
                "Already minted in this phase"
            );
            hasMintedInWhitelist[msg.sender] = true;
        }
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
