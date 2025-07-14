// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealAssetNFT is ERC721, Ownable {
    struct Asset {
        string name;
        string description;
        string serialNumber;
        string metadataURI;
    }

    struct Offer {
        address seller;
        uint256 price;
        bool active;
    }

    uint256 public nextTokenId;
    mapping(uint256 => Asset) public assets;
    mapping(uint256 => Offer) public offers;

    constructor() ERC721("RealAssetNFT", "RANFT") {}

    // 자산 등록 및 NFT 발행
    function registerAsset(
        string memory name,
        string memory description,
        string memory serialNumber,
        string memory metadataURI
    ) public {
        uint256 tokenId = nextTokenId++;
        assets[tokenId] = Asset(name, description, serialNumber, metadataURI);
        _mint(msg.sender, tokenId);
    }

    // 오퍼 생성
    function createOffer(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        offers[tokenId] = Offer(msg.sender, price, true);
    }

    // 오퍼 구매
    function buy(uint256 tokenId) public payable {
        Offer memory offer = offers[tokenId];
        require(offer.active, "No active offer");
        require(msg.value == offer.price, "Incorrect price");
        _transfer(offer.seller, msg.sender, tokenId);
        payable(offer.seller).transfer(msg.value);
        offers[tokenId].active = false;
    }
} 