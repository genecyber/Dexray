var express = require('express')
const bodyParser = require('body-parser')
const app = express()
var jsonParser = bodyParser.json()
app.use(jsonParser)

var Hybrix = require('./hybrix-lib.nodejs.js')
var hybrix = new Hybrix.Interface({http:require('http')}); // Provide a http connector
// var HYBRIX_URL = "http://104.197.98.21:1111/"
var HYBRIX_URL = "http://35.238.98.193/"
// var HYBRIX_URL = "http://localhost:4000/"

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.options("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
})

app.get('/', (req, res)=>{
    res.json({"hello": "world"})
})

app.get('/:coin/:address/balance', (req, res)=>{
    var asset = req.query.asset
    var coin = req.params.coin
    var address = req.params.address
    if (asset && !(asset === coin)) {
        coin = coin + '.' + asset
    }
    console.log(asset, coin, address)
    hybrix.sequential(
        [
          'init', // Initialize hybrix
          { host: HYBRIX_URL },
          'addHost', // Add and initialize the host
          { query: '/asset/' + coin + '/balance/' + address },
          'rout' // Query for asset balance
        ],
        balance => {
          console.log(balance, balance);
          res.json({balance: Number(balance), address: address, chain: coin, asset_name: asset})
        }
      );
})

app.get('/chains', (req, res)=>{
    hybrix.sequential(
        [
          'init', // Initialize hybrix
          { host: HYBRIX_URL },
          'addHost', // Add and initialize the host
          { query: '/asset/' },
          'rout' // Query for asset balance
        ],
        balance => {
          console.log(balance, balance);
          res.json(balance)
        }
      );
})

app.listen(3000)