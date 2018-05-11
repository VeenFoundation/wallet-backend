const VeenApi = require('./veenApi');
const express = require('express');
const app = express();
const decimals = Math.pow(10, 18);

var veen = new VeenApi();
console.log(process.env.PATH);

app.get('/', function (req, res) {
    res.send('Hello World!, ');
});

// get current gas
app.get('/v1/wallet/gas', function(req, res) {
  var walletAddress = req.query.address;

  try {
    veen.getCurrentGas(walletAddress).then(function(gas){
      res.setHeader('Content-Type', 'application/json');
      var gasResult;
      if(gas.length < 16) {
        gasResult = 0;
      } else {
        gasResult = veen.gasReadable(gas);
      }

      res.send(JSON.stringify({ gas: gasResult }));
    }, function(err){
      res.status(500).send(JSON.stringify({ error: err }));
    });
  } catch(e){
    veen = new VeenApi();
    res.status(500).send(JSON.stringify({ error: "Unknown error occurred.\nPlease try again." }));
  }
});

// charge gas
app.get('/v1/wallet/gas/charge', function(req, res){
  var walletAddress = req.query.address;

  try {
    veen.getCurrentGas(walletAddress).then(function(gas){
      if (gas < veen.web3.utils.toWei('50', 'ether')) {
        veen.chargeGas(walletAddress).then(function(result){
          console.log(result);
        }, function(err){
          console.error(err);
        });
        
        res.send("Successful Operation.");
      } {
        res.status(400).send(JSON.stringify({ error: "You can do this operation. when the gas is less than 50 ether" }));
      }
    }, function(err){
      res.status(500).send(JSON.stringify({ error: err }));
    });
  } catch(e){
    veen = new VeenApi();
    res.status(500).send(JSON.stringify({ error: "Unknown error occurred.\nPlease try again." }));
  }
});

// Not implemented yet.
app.get('/v1/wallet/transactions', function(req, res){

});

app.listen(80, function () {
  console.log('Example app listening on port 80!');
});
