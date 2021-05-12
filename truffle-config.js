//require('babel-register');
//require('babel-polyfill');
require("dotenv").config({path: "./.env"}); 
const HDWalletProvider = require("@truffle/hdwallet-provider");
const AccountIndex = 0; 

/// @dev Alter the code below to expose other networks as desired
module.exports = {
  networks: {
    /*ganache_local: {
      provider: function() {
        /// @dev - add MNEMONIC to .env file to use HDWalletProvider
        return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:7545", AccountIndex);
      },
      network_id: 5777
    },*/
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './abis/',
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
}
