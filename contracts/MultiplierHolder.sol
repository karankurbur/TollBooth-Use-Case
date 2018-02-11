pragma solidity ^0.4.13;

import "./interfaces/MultiplierHolderI.sol";
import "./Owned.sol";

//keeps track of the multiplier for each vehicle type.
contract MultiplierHolder is Owned, MultiplierHolderI {
    
    mapping (uint => uint) multiplier;

    function MultiplierHolder() public fromOwner {
    
    }

    function setMultiplier(uint vehicleType, uint mult) fromOwner public returns(bool success) {
        assert(vehicleType > 0);
        uint currentMultiplier = getMult(vehicleType);
        assert(mult != currentMultiplier);
        LogMultiplierSet(msg.sender,vehicleType,mult);
        multiplier[vehicleType] = mult;
        return true;
    }
    
    //Helper function to set vehicleType
    function getMult(uint vehicleType) private constant returns (uint mult) {
        return multiplier[vehicleType];
    }
        
    function getMultiplier(uint vehicleType) constant public returns(uint mult) {
        return getMult(vehicleType);
    }
}


