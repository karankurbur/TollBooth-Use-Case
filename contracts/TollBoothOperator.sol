pragma solidity ^0.4.13;

import "./Owned.sol";
import "./Regulated.sol";
import "./Regulator.sol";
import "./interfaces/TollBoothOperatorI.sol";
import "./Pausable.sol";
import "./MultiplierHolder.sol";
import "./DepositHolder.sol";
import "./TollBoothHolder.sol";
import "./RoutePriceHolder.sol";
import "./Pausable.sol";

contract TollBoothOperator is Owned, Pausable, DepositHolder, TollBoothHolder,MultiplierHolder, RoutePriceHolder,TollBoothOperatorI {
    struct Transaction {
        address entryBooth;
        address exitBooth;
        uint amountPaid;
    }
    mapping(address => Transaction[]) public allPaidTransactions;

    mapping (bytes32 => uint) public payments; //amount paid for hash
    mapping (bytes32 => address) public paymentAddress; //vehicle address who paid for hash
    mapping (bytes32 => address) public  entryBooths; //entry booth address for who paid for hash
    
    //This is different hash
    mapping (bytes32 => uint) public pendingTransactions; //pending payments for each entry/exit hash
    mapping (bytes32 => bytes32[]) public pendingTransactionInformation;
    mapping(bytes32 => address) public pendingTransactionExitBooths;
    
    uint public collectedFees;
    address regulator; // dont need this use regulated contract functions

    function TollBoothOperator(bool pausedState, uint initialDeposit, address _regulator) Pausable(pausedState) DepositHolder(initialDeposit) {
        regulator = _regulator;
    }

    function hashSecret(bytes32 secret) constant public returns(bytes32 hashed) {
        return keccak256(secret);
    }

    function getTypeOfVehicle(address vehicleAddress) returns (uint) {
        Regulator ourRegulator = Regulator(regulator);
        return ourRegulator.getVehicleType(vehicleAddress);
    }

    function returnSpecificTransaction(address vehicleAddress, uint transactionNumber) 
        returns (address entry, address exit, uint amountPaid) {
        Transaction[] temp = allPaidTransactions[vehicleAddress];
        return (temp[transactionNumber].entryBooth, temp[transactionNumber].exitBooth, temp[transactionNumber].amountPaid);
    }
    
    function returnNumberOfTransactions(address vehicleAddress) returns (uint) {
        return allPaidTransactions[vehicleAddress].length;
    }


    function getRegulator() public returns(address) {
        return regulator;
    }

    //Vehicle pays deposit to enter the road system as well as a hashed secret. 
    function enterRoad(address entryBooth, bytes32 exitSecretHashed) whenNotPaused public payable returns (bool success) {
        assert(isTollBooth(entryBooth)); 
        uint minimumPayment = getDeposit(); //Require payment to be equal to or greater than the deposit for this TollBoothOperator
        assert(msg.value >= minimumPayment);
        assert(payments[exitSecretHashed] == 0); //Cant have the same secret for more than one current payment
        entryBooths[exitSecretHashed] = entryBooth; 
        payments[exitSecretHashed] = msg.value; //keep track of payment to give back later
        paymentAddress[exitSecretHashed] = msg.sender; //keep track of address of vehicle
        
        LogRoadEntered(msg.sender, entryBooth, exitSecretHashed, msg.value);
        return true;
    }

    function getVehicleEntry(bytes32 exitSecretHashed) constant public returns(address vehicle, address entryBooth,
            uint depositedWeis) {
        address veh = paymentAddress[exitSecretHashed];
        address booth = entryBooths[exitSecretHashed];
        uint deposit = payments[exitSecretHashed];
        return (veh,booth,deposit);
    }

    function routeHashHelper (address entry, address exit) public returns (bytes32) {
        return keccak256(entry,exit);
    }

    function reportExitRoad(bytes32 exitSecretClear) public returns (uint status) {
        assert(isTollBooth(msg.sender)); //Can only be called by exit toll booth
        
        bytes32 hashedSecret = hashSecret(exitSecretClear);
        address entryAddress = entryBooths[hashedSecret];
        address exitAddress = msg.sender;

        assert(entryAddress != exitAddress);
        assert(payments[hashedSecret] != 0);

        uint price = getRoutePrice(entryAddress, exitAddress); //Gets toll route price for entry/exit pair

        //Pending payments
        if (price == 0) {
            LogPendingPayment(hashedSecret,entryAddress,exitAddress);
            bytes32 route = keccak256(entryAddress, exitAddress);
            
            pendingTransactions[route]++;
            pendingTransactionInformation[route].push(hashedSecret);
            pendingTransactionExitBooths[route] = exitAddress;
            return 2;
        }
        else if (price > 0) {
            executeExit(hashedSecret,price,exitAddress);
            return 1;
        }
    }
    
    function executeExit(bytes32 hashedSecret, uint price, address exitAddress) public{
            address vehicleAddress = paymentAddress[hashedSecret]; //Get vehicle payment address for this hash
            uint vehicleType = getTypeOfVehicle(vehicleAddress);   //Get vehicle type for this vehicle address
            uint mulitplier = getMultiplier(vehicleType);          //Get multiplier for this type of vehicletype
            uint priceToPay = price * mulitplier;                  //Calculate cost of toll
            uint returnedAmount = payments[hashedSecret] - priceToPay; //deposit minus payment
            collectedFees = collectedFees + priceToPay;
            address entryAddress = entryBooths[hashedSecret];
            Transaction memory myStruct = Transaction(entryAddress,exitAddress,priceToPay);
            allPaidTransactions[vehicleAddress].push(myStruct);

            if(returnedAmount > 0) {
                vehicleAddress.transfer(returnedAmount);
                LogRoadExited(exitAddress, hashedSecret, priceToPay, returnedAmount);
            }
            else {
                LogRoadExited(exitAddress, hashedSecret, priceToPay, 0);

            }
            payments[hashedSecret] = 0;
            paymentAddress[hashedSecret] = 0x0;
            entryBooths[hashedSecret] = 0x0;
    }
    
    function oracleSetFee(address entryBooth, address exitBooth, uint amount) fromOwner public {
        assert(getPendingPaymentCount(entryBooth,exitBooth) > 0);
        assert(isTollBooth(entryBooth));
        assert(isTollBooth(exitBooth));
        assert(amount > 0);
        setRoutePrice(entryBooth,exitBooth,amount);
        clearSomePendingPayments(entryBooth,exitBooth,1);
    }

    function getPendingPaymentCount(address entryBooth, address exitBooth) constant public returns (uint count) {
        bytes32 route = keccak256(entryBooth, exitBooth);
        return pendingTransactions[route];
    }

    function clearSomePendingPayments(address entryBooth, address exitBooth, uint count)  public returns (bool success) {
        uint pendingPayments = getPendingPaymentCount(entryBooth,exitBooth);
        assert (count <= pendingPayments);
        assert(isTollBooth(entryBooth));
        assert(isTollBooth(exitBooth));
        assert(count >= 0);
        bytes32 routeHash = keccak256(entryBooth,exitBooth);
        uint price = getRoutePrice(entryBooth, exitBooth); //Gets toll route price for entry/exit pair

        for (int i = 0; i  < int(count) ; i++)  {
            bytes32 vehicleEntryHash = pendingTransactionInformation[routeHash][0];
            remove(0, routeHash);
            executeExit(vehicleEntryHash,price,exitBooth);
            pendingTransactions[routeHash]--;
            pendingTransactionExitBooths[routeHash] = 0x0;
        }
        return true;
    }

    function remove(uint index, bytes32 routeHash) public {
        if (index >= pendingTransactionInformation[routeHash].length) return;
        for (uint i = index; i<pendingTransactionInformation[routeHash].length-1; i++){
            pendingTransactionInformation[routeHash][i] = pendingTransactionInformation[routeHash][i+1];
        }
        delete pendingTransactionInformation[routeHash][pendingTransactionInformation[routeHash].length-1];
        pendingTransactionInformation[routeHash].length--;
    }

    function getCollectedFeesAmount() constant public returns(uint amount) {
        return collectedFees;
    }

    function withdrawCollectedFees() public returns(bool success) {
        assert(collectedFees > 0);
        Regulator ourRegulator = Regulator(regulator);
        assert(msg.sender == ourRegulator.getTollBoothOwner(this));
        collectedFees = 0;
        msg.sender.transfer(collectedFees);
        return true;
    }
}
