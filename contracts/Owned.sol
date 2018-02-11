    pragma solidity ^0.4.13;
    
    import "./interfaces/OwnedI.sol";
    
    contract Owned is OwnedI {
        address owner;
        
        function Owned() {
            owner = msg.sender;
        }
        
        modifier fromOwner() {
            assert(msg.sender == owner);
            _;
        }
        
        /**
         * Sets the new owner for this contract.
         *     It should roll back if the caller is not the current owner.
         *     It should roll back if the argument is the current owner.
         *     It should roll back if the argument is a 0 address.
         * @param newOwner The new owner of the contract
         * @return Whether the action was successful.
         * Emits LogOwnerSet.
         */
        function setOwner(address newOwner) fromOwner returns(bool success) {
            assert(msg.sender != address(0));
            assert(newOwner != address(0));
            assert(newOwner != owner);
            address previousOwner = owner;
            LogOwnerSet(previousOwner, newOwner);
            owner = newOwner;
            return true;
        }
        
        /**
         * @return The owner of this contract.
         */
        function getOwner() constant returns(address outputOwner) {
            return owner;
        }
    }

