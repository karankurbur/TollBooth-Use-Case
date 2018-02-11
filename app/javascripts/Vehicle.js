// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var regulator;
var tollboothoperatorContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"entryBooths","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"payments","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tollBooth","type":"address"}],"name":"removeTollBooth","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"hashedSecret","type":"bytes32"},{"name":"price","type":"uint256"},{"name":"exitAddress","type":"address"}],"name":"executeExit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newState","type":"bool"}],"name":"setPaused","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"entryBooth","type":"address"},{"name":"exitBooth","type":"address"},{"name":"count","type":"uint256"}],"name":"clearSomePendingPayments","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"index","type":"uint256"},{"name":"routeHash","type":"bytes32"}],"name":"remove","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tollBooth","type":"address"}],"name":"addTollBooth","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"pendingTransactionExitBooths","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"vehicleType","type":"uint256"},{"name":"mult","type":"uint256"}],"name":"setMultiplier","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"exitSecretClear","type":"bytes32"}],"name":"reportExitRoad","outputs":[{"name":"status","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"name":"pendingTransactionInformation","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"entryBooth","type":"address"},{"name":"exitBooth","type":"address"}],"name":"getRoutePrice","outputs":[{"name":"priceWeis","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tollBooth","type":"address"}],"name":"isTollBooth","outputs":[{"name":"isIndeed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"secret","type":"bytes32"}],"name":"hashSecret","outputs":[{"name":"hashed","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"paymentAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"allPaidTransactions","outputs":[{"name":"entryBooth","type":"address"},{"name":"exitBooth","type":"address"},{"name":"amountPaid","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"exitSecretHashed","type":"bytes32"}],"name":"getVehicleEntry","outputs":[{"name":"vehicle","type":"address"},{"name":"entryBooth","type":"address"},{"name":"depositedWeis","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"pendingTransactions","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"outputOwner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"collectedFees","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"entryBooth","type":"address"},{"name":"exitSecretHashed","type":"bytes32"}],"name":"enterRoad","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getCollectedFeesAmount","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"vehicleAddress","type":"address"}],"name":"getTypeOfVehicle","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"entryBooth","type":"address"},{"name":"exitBooth","type":"address"},{"name":"amount","type":"uint256"}],"name":"oracleSetFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"vehicleType","type":"uint256"}],"name":"getMultiplier","outputs":[{"name":"mult","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isPaused","outputs":[{"name":"isIndeed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getDeposit","outputs":[{"name":"weis","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"entryBooth","type":"address"},{"name":"exitBooth","type":"address"}],"name":"getPendingPaymentCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"vehicleAddress","type":"address"}],"name":"returnNumberOfTransactions","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawCollectedFees","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"entryBooth","type":"address"},{"name":"exitBooth","type":"address"},{"name":"priceWeis","type":"uint256"}],"name":"setRoutePrice","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"entry","type":"address"},{"name":"exit","type":"address"}],"name":"routeHashHelper","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"depositWeis","type":"uint256"}],"name":"setDeposit","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getRegulator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"vehicleAddress","type":"address"},{"name":"transactionNumber","type":"uint256"}],"name":"returnSpecificTransaction","outputs":[{"name":"entry","type":"address"},{"name":"exit","type":"address"},{"name":"amountPaid","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"pausedState","type":"bool"},{"name":"initialDeposit","type":"uint256"},{"name":"_regulator","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"vehicle","type":"address"},{"indexed":false,"name":"entryBooth","type":"address"},{"indexed":false,"name":"exitSecretHashed","type":"bytes32"},{"indexed":false,"name":"depositedWeis","type":"uint256"}],"name":"LogRoadEntered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"exitBooth","type":"address"},{"indexed":false,"name":"exitSecretHashed","type":"bytes32"},{"indexed":false,"name":"finalFee","type":"uint256"},{"indexed":false,"name":"refundWeis","type":"uint256"}],"name":"LogRoadExited","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"exitSecretHashed","type":"bytes32"},{"indexed":false,"name":"entryBooth","type":"address"},{"indexed":false,"name":"exitBooth","type":"address"}],"name":"LogPendingPayment","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"LogFeesCollected","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"entryBooth","type":"address"},{"indexed":false,"name":"exitBooth","type":"address"},{"indexed":false,"name":"priceWeis","type":"uint256"}],"name":"LogRoutePriceSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"tollBooth","type":"address"}],"name":"LogTollBoothAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"tollBooth","type":"address"}],"name":"LogTollBoothRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"vehicleType","type":"uint256"},{"indexed":false,"name":"multiplier","type":"uint256"}],"name":"LogMultiplierSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"depositWeis","type":"uint256"}],"name":"LogDepositSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"newPausedState","type":"bool"}],"name":"LogPausedSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"previousOwner","type":"address"},{"indexed":false,"name":"newOwner","type":"address"}],"name":"LogOwnerSet","type":"event"}]);
var tollBoothContract;
var tempAddress;
window.App = {
  start: function() {
    var self = this;
    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      console.log("Default account is : " + account);
      console.log("All accounts are " + accounts);
  });

web3.eth.defaultAccount = account;
console.log(tollboothoperatorContract);
tollBoothContract = tollboothoperatorContract.at('0x62f760358bae284cf82ce8f8688b09eb1e960430');
tempAddress = '0x62f760358bae284cf82ce8f8688b09eb1e960430';
}, 

setOperatorContract : function() {
   var contractAddress = document.getElementById("operatorAddress").value;
   tempAddress = contractAddress;
   tollBoothContract = tollboothoperatorContract.at(tempAddress);
   web3.eth.getBalance(account, function(err, result) {
    if(!err) {
      var balance = result;
      console.log(result);
      console.log(result.c[0]);
      var tttemp = result.c[0] / 1000;
      console.log(tttemp);
      document.getElementById("balance").innerHTML = tttemp;
    }
   });
},

refreshBalance : function() {
   web3.eth.getBalance(account, function(err, result) {
    if(!err) {
      var balance = result;
      console.log(result);
      console.log(result.c[0]);
      var tttemp = result.c[0] / 1000;
      console.log(tttemp);
      document.getElementById("balance").innerHTML = tttemp;
    }});
},

  enterBooth : function() {
    var hashSecret = document.getElementById("hashed").value;
    var entryAddress = document.getElementById("entryBooth").value;
    var amountToPay = parseInt(document.getElementById("amountToPay").value) * 1000;
    var inWei = web3.toWei(amountToPay, 'kwei');

    var value123 = web3.toWei('5', 'ether');
    tollBoothContract.enterRoad(entryAddress,hashSecret,{value : value123, gas : 3000000},function(err, out) {
      if(!err) {
        console.log(out);
        var receipt = web3.eth.getTransactionReceipt(out, function(err, result) {
        if(!err) {
           console.log(result);
        }
      });
      }
    });   
  },

  loadTransactions : function () {
    var numberOfTransactions;
    tollBoothContract.returnNumberOfTransactions(account, function(err, out) {
      if(!err) {
        numberOfTransactions = out;
        console.log(out);

      }});


    var table = document.getElementById("transcations");
    for(var i = 0; i < numberOfTransactions; i++) {
      var entry;
      var exit;
      var amt;
      tollBoothContract.returnSpecificTransaction(account, i, function(err, out) {
        if(!err) {
          entry = out[0];
          exit = out[1];
          amt = out[2];
        }
      });
      var row = table.insertRow(i);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = entry;
      cell2.innerHTML = exit;
      cell2.innerHTML = amt;
    }
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 RegulatorContract, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }
  App.start();
});