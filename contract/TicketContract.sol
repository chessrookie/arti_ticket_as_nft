//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TicketContract is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 price = 0.1 ether;

    constructor() ERC721("Ticket", "TIC") {
        _mint(msg.sender, 11); // Fixed supply
    }

    function mintTicket(address buyer) public payable returns (uint256)
    {
        require(msg.value >= price, "Not enought funds to mint ticket");

        _tokenIds.increment();

        string memory tokenURI = "https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg";

        uint256 newItemId = _tokenIds.current();
        _mint(buyer, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
