var Migrations = artifacts.require('./Migrations.sol');

/** @dev NOTE: this stub for migration functionality is here because in a later iteration of game we
  * may add a smart contract to track play of the sound files for the purpose of attributing rights to  
  * the sound file rights holders: Python (Monty) Pictures. */
module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
