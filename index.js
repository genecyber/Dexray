const request = require('request')
const explorers = require('./explorers')
var express = require('express')
const bodyParser = require('body-parser')
var fs = require('fs-plus')
const app = express()
var jsonParser = bodyParser.json()
app.use(jsonParser)
var CMC_API_KEY = "eb8eb762-4a29-432d-9cb1-05237b4a5a2e"
var RATES_FILE = './rates.json'
var rates = require(RATES_FILE)


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

app.get('/chains', (req, res)=>{
    var chains = explorers.map(chain=>{ return chain.name})
    res.json(chains)
})

app.get('/:chain/:address/balance', (req, res)=>{
    var chain = req.params.chain
    var address = req.params.address
    var asset_name = req.query.asset
    getBalance(asset_name, address, chain, (balance)=>{
        res.json({balance: balance})
    })
})

app.get('/quote', (req, res)=>{
    var update = req.query.update === "true" || false
    var symbol = req.query.symbol
    if (symbol) {
        var filtered = rates.data.filter(coin=>{return coin.symbol.toLowerCase() === symbol.toLowerCase()})
        if (filtered.length) {
            filtered = filtered[0]
            res.json(filtered)
        } else {
            res.json({err: "Not Found"})
        }        
    } else {
        res.json(rates)
    }
    if (update) {
        getCMCRates()
    }
})

app.listen(3000)

function getBalance(asset_name, address, chain, cb){
    var explorer = explorers.get(chain)
    return explorer.request(address, asset_name, cb)    
}

function getCMCRates() {
    var endpoint = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5000&convert=USD"
    var headers = {headers: {'X-CMC_PRO_API_KEY': CMC_API_KEY}}
    request.get(endpoint, headers, (error, response, body)=>{
        rates = JSON.parse(body)
        fs.writeFileSync(RATES_FILE, JSON.stringify(rates, null, 4))
    })
}




