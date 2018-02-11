pragma solidity ^0.4.13;

import "./interfaces/RegulatorI.sol";
import "./Owned.sol";
import "./TollBoothOperator.sol";

//Keeps track of vehicle types for each driver.
//keeps track of address of tollbooth owners.
contract Regulator is Owned, RegulatorI {
    
    //Keep track of vehicle type per vehicle address
    mapping (address => uint) public vehicleTypes;
    //keeps track if an address is a tollboothoperator
    mapping (address => bool) public tollBoothOperators;
    //keeps track of the owner of each tollboothoperator
    mapping (address => address) public tollBoothOwner;

    function Regulator() public {
    
    }
    
    function setVehicleType(address vehicle, uint vehicleType) fromOwner public returns(bool success) {
        assert(getVehicleType(vehicle) != vehicleType);
        assert(vehicle != address(0));
        vehicleTypes[vehicle] = vehicleType;
        LogVehicleTypeSet(msg.sender,vehicle, vehicleType);
        return true;
    }

    function getVehicleType(address vehicle) constant public returns(uint vehicleType) {
        return vehicleTypes[vehicle];
    }

    function createNewOperator(address newOwner, uint deposit) fromOwner public returns(TollBoothOperatorI newOperator) {
        assert(msg.sender != newOwner);
        address currentAddress = this;
        TollBoothOperator createTollBooth = new TollBoothOperator(true, deposit, this);
        createTollBooth.setOwner(newOwner);
        LogTollBoothOperatorCreated(msg.sender, createTollBooth, newOwner, deposit);
        tollBoothOperators[createTollBooth] = true;
        tollBoothOwner[createTollBooth] = newOwner;
        return createTollBooth;
    }
    
    function removeOperator(address operator) fromOwner public returns(bool success) {
        assert(isOperator(operator));
        assert(operator != address(0));
        
        tollBoothOperators[operator] = false;
        LogTollBoothOperatorRemoved(msg.sender, operator);  
        return true;
    }

    function getTollBoothOwner(address tollBoothAddress) public returns (address ownerOfTollBooth) {
        return tollBoothOwner[tollBoothAddress];
    }

    function isOperator(address operatorAddress) constant public returns(bool indeed) {
        if(tollBoothOperators[operatorAddress]) {
            return true;
        }
    }
}
