pragma solidity ^0.4.13;

import "./interfaces/RegulatedI.sol";
import "./Regulator.sol";

contract Regulated is RegulatedI{

    address regulatorAddress;

    function Regulated(address givenOwner) public {
        assert(givenOwner != address(0));
        regulatorAddress = givenOwner;
    }
    
    function setRegulator(address newRegulator) public returns(bool success) {
        assert(msg.sender == regulatorAddress);
        assert(msg.sender != address(0));
        assert(newRegulator != regulatorAddress);
        LogRegulatorSet(regulatorAddress,newRegulator);
        regulatorAddress = newRegulator;
        return true;
    }
        
    //figure out how to return interface
    function getRegulator() constant public returns(RegulatorI regulator) {
        return Regulator(regulatorAddress); //is this correct?
    }
    
    function getRegulatorAddress() constant public returns (address reg) {
        return regulatorAddress;
    }
}
