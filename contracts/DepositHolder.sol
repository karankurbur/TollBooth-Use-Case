pragma solidity ^0.4.13;

import "./interfaces/DepositHolderI.sol";
import "./Owned.sol";

contract DepositHolder is Owned, DepositHolderI{
    uint depositInWei;
    
    function  DepositHolder (uint minDeposit) public {
        assert(minDeposit > 0);
        depositInWei = minDeposit;
    }
    
    function setDeposit(uint depositWeis) fromOwner public returns(bool success) {
        assert(depositWeis > 0);
        assert(depositWeis != depositInWei);
        LogDepositSet(msg.sender,depositWeis);
        depositInWei = depositWeis;
        return true;
    }

    function getDeposit() constant public returns(uint weis) {
        return depositInWei;
    }
}