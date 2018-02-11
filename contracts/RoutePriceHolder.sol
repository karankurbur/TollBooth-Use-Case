pragma solidity ^0.4.13;

import "./Owned.sol";
import "./interfaces/RoutePriceHolderI.sol";
import "./TollBoothHolder.sol";

//Keeps track of route prices between two different addresses if exists
contract RoutePriceHolder is Owned, TollBoothHolder, RoutePriceHolderI{

    mapping (bytes32 => uint) pricePerRoute;
    
    function RoutePriceHolder() public fromOwner {
        
    }
    
    function setRoutePrice(address entryBooth, address exitBooth, uint priceWeis) fromOwner public returns(bool success) {
        assert(msg.sender == owner);
        assert(isTollBooth(entryBooth));
        assert(isTollBooth(exitBooth));
        assert(entryBooth != exitBooth);
        assert(entryBooth != address(0));
        assert(exitBooth != address(0));
        bytes32 hashAddresses = keccak256(entryBooth, exitBooth);
        pricePerRoute[hashAddresses] = priceWeis;
        LogRoutePriceSet(msg.sender, entryBooth, exitBooth, priceWeis);
        return true;
    }

    function getRoutePrice(address entryBooth, address exitBooth) constant public
      returns(uint priceWeis) {
        bytes32 hashAddresses = keccak256(entryBooth, exitBooth);
        if(!isTollBooth(entryBooth) || !isTollBooth(exitBooth)) {
            return 0;
        }
        return pricePerRoute[hashAddresses];
    }
}

