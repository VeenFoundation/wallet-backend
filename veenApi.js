const fs = require('fs');
const Web3 = require("web3");
const EthereumTx = require('ethereumjs-tx')

const mainNet = "http://veenpf-dns-reg1.southeastasia.cloudapp.azure.com:8545";
const veenContractAddress = "0xbd9af7216a0c766b82c1f50f4384bab1fadea162";
const gasPrivateKey = process.env.GAS_PRIVATE_KEY;

const decimals = Math.pow(10, 18);

function VeenApi() {
    this.web3 = null;
    this.bytecode = null;
    this.gasEstimate = null;
    this.abi = null;
    this.veen = null;
    this.contractAddress = null;
    this.contract = null;

    this.web3 = new Web3(new Web3.providers.HttpProvider(mainNet));
    this.contractAddress = veenContractAddress;

    const veenAbi = fs.readFileSync('./veenAbi.json', 'utf-8');
    this.abi = JSON.parse(veenAbi);
    this.veen = new this.web3.eth.Contract(this.abi, this.contractAddress);
}

// get balance of my veen
VeenApi.prototype.balanceOf = function(address){
    if (!this.veen) {
        throw "Veen API is not initialized.";
        return;
    }

    return this.veen.methods.balanceOf(address).call();
}

// get transaction list of speicific address.
VeenApi.prototype.fetchTxes = function(address){
    var veen = this.veen;
    var web3 = this.web3;
    
    return new Promise(function(resolve, reject){
        if (!veen) {
            console.error("Veen API is not initialized, before doing this, ");
            console.error("call initializeContract(conrtractAddress) or deployContract()");
            reject("Veen API is not initialized");
        }

        veen.events.Transfer({ fromBlock: 0, toBlock: 'latest' }, function(error, result){
            if (!error) {
                var list = [];

                for(var i = 0; i < result.length; i++) {
                    var tx = result[i];
                    var timestamp = web3.eth.getBlock(tx.blockNumber).timestamp;
                    var obj = {};

                    if(tx.args.from == address || tx.args.to == address) {
                        if(tx.args.from == address) obj.type = "s";
                        else obj.type = "r";

                        obj.from = tx.args.from;
                        obj.to = tx.args.to;
                        obj.amount = Number(tx.args.value);
                        obj.date = new Date(timestamp * 1000);

                        list.push(obj);
                    }
                }

                resolve(list);
            } else {
                reject(error);
            }
        });
    });
}

// get current gas
VeenApi.prototype.getCurrentGas = function(address) {
    if (!this.veen) {
        throw "Veen API is not initialized.";
        return;
    }

    return this.web3.eth.getBalance(address);
}

VeenApi.prototype.chargeGas = function(address){
    if (!this.veen || !this.web3) {
        throw "Veen API is not initialized.";
        return;
    }

    var web3 = this.web3;

    return new Promise(function(resolve, reject){
        web3.eth.getAccounts().then(function(accounts){
            web3.eth.defaultAccount = accounts[0];
            web3.eth.getTransactionCount(accounts[0]).then(function(txCount){
                const privateKey = Buffer.from(gasPrivateKey, 'hex')
                const nonce = web3.utils.toHex(txCount);
                
                var txParams = {
                    'nonce': nonce,
                    'to': address,
                    'value': web3.utils.toHex(web3.utils.toWei('100', 'ether')),
                    'gas': 2000000,
                    'gasPrice': 234567897654321,
                    'chainId': 201805
                }
                const tx = new EthereumTx(txParams)
                tx.sign(privateKey);

                web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex')).then(function(result){
                    resolve(result);
                }, function(err){
                    reject(err);
                });
            }, function(error){
                reject(error);
            });
        }, function(error){
            reject(error);
        });
    });
}

VeenApi.prototype.gasReadable = function(gas){
    var _gas = "";
    var result = "";

    for(var i = gas.length-1; i >= 0; i--) {
        _gas += gas[i];
    }
    
    for(var i = _gas.length-1; i >= 18; i--) {
        result += _gas[i];
    }
    result += "." + _gas[16] + _gas[17];

    return result;
}

module.exports = VeenApi;