pragma solidity ^0.4.13;

import "./interfaces/PausableI.sol";
import "./Owned.sol";

contract Pausable is Owned, PausableI{
    
    bool paused;

    function Pausable(bool pausedState) public {
        paused = pausedState;
    }
    
    modifier whenNotPaused () {
        assert(paused == false);
        _;    
    }
    
    modifier whenPaused() {
        assert(paused == true);
        _;    
    }

    function setPaused(bool newState) fromOwner public returns(bool success) {
        assert(newState != paused);
        LogPausedSet(msg.sender,newState);
        paused = newState;
        return true;
    }
        
    function isPaused() public constant returns(bool isIndeed){
        return paused;    
    }
}