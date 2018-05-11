const VeenApi = require('../veenApi');
const Web3 = require('Web3');
const chai = require('chai');
const assert = chai.assert;

var decimals = Math.pow(10, 18);
var veen, web3;

describe('Veen', function(){
    this.timeout(100000);

    beforeEach(() => {
        veen = new VeenApi();
        web3 = veen.web3;
    });

    it("should create new account", function(){
        var account = web3.eth.accounts.create();
        assert.typeOf(account.address, 'string');
        assert.typeOf(account.privateKey, 'string');
        assert.isNotNull(account.address);
        assert.isNotNull(account.privateKey);
    });

    // 가스 요청을 하면 이더리움 100개를 충전해줌
    it("should charge gas!", async () => {
        var address = "0x9A7f55a96A7a2CE66211870Bb3D6AC07697b0290";
        var chargeAmount = web3.utils.toWei('100', 'ether');

        var beforeGas = await veen.getCurrentGas("0x9A7f55a96A7a2CE66211870Bb3D6AC07697b0290");
        var result = await veen.chargeGas("0x9A7f55a96A7a2CE66211870Bb3D6AC07697b0290");
        var afterGas = await veen.getCurrentGas("0x9A7f55a96A7a2CE66211870Bb3D6AC07697b0290");

        assert.notEqual(beforeGas, afterGas);
        assert.equal(Number(afterGas - beforeGas), Number(chargeAmount));
    });
});