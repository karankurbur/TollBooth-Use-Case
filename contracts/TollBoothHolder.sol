pragma solidity ^0.4.13;

import "./interfaces/TollBoothHolderI.sol";
import "./Owned.sol";

//Keeps tracks of toolbooth addresses.
contract TollBoothHolder is Owned, TollBoothHolderI {
    
    
    mapping (address => bool) tollBoths;
    
    function TollBoothHolder() public fromOwner {
        
    }
    
    function addTollBooth(address tollBooth) fromOwner public returns(bool success) {
        assert(msg.sender != tollBooth);
        assert(isTollBooth(tollBooth) == false);
        assert(tollBooth != address(0));
        setTollBooth(tollBooth,true);
        LogTollBoothAdded(msg.sender,tollBooth);
        return true;
    }   
    
    function setTollBooth(address booth, bool operator) private {
        tollBoths[booth] = operator;
    }
    
    function isTollBooth(address tollBooth) constant public returns(bool isIndeed) {
        return tollBoths[tollBooth];
    }

    function removeTollBooth(address tollBooth) fromOwner public returns(bool success) {
        assert(msg.sender == owner);
        assert(isTollBooth(tollBooth) == true);
        assert(tollBooth != address(0));
        setTollBooth(tollBooth,false);
        LogTollBoothRemoved(msg.sender,tollBooth);
        return true;
    }
}

