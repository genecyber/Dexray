const request = require('request')
var explorers = require('./explorers.json')
var eth = require('./eth')
var btc = require('./btc')
var ethTokens = require('./ethTokens')
explorers.get = function(name, asset_name){
    var explorer = this.filter(explorer=>{return explorer.name === name && explorer.asset_name === asset_name})[0]
    if (!explorer && name && asset_name) {
        var foundToken = ethTokens.filter(token=>{ return token.symbol === asset_name.toUpperCase()})[0]
        if (foundToken) {
            explorer = this.filter(explorer=>{return explorer.name === name && explorer.asset_name === undefined})[0]
        }
    }
    if (!explorer) {
        return "ERROR";
    }
    explorer.build = function(values){
        var url =  explorer.base + explorer.balance_endpoint
        return replace(0, url, (replaced_url)=>{
            return replaced_url
        })
        function replace(index, url, cb) {
            var param = explorer.params[index]
            var replaced_url = url.replace("{"+param+"}", values[param])
            if (index +1 === explorer.params.length) {
                return cb(replaced_url)
            } else {
                return replace(index +1, replaced_url, cb)
            }
        }
        
    }
    explorer.request = function(address, asset_name, contract, cb){
        var explorer = this
        if (!contract) {
            var foundToken = ethTokens.filter(token=>{ return token.symbol === asset_name.toUpperCase()})[0]
            if (foundToken) {
                contract = foundToken.address
            }
        }
        var endpoint = explorer.build({"address": address, contract: contract})
        try {
            request.get(endpoint, (error, response, body)=>{
                if (error) {
                    console.log("Error detected", error)
                    // throw error
                    return cb(Number(-1))
                }
                // console.log("--BODY", body, 'response', response, 'error', error)
                var results = JSON.parse(body)
                if (explorer.asset_filter) {
                    var key = Object.keys(explorer.asset_filter)[0]
                    var value = explorer.asset_filter[key]
                    var filter = explorer[value]
                    var filtered
                    if (explorer.collection) { 
                        filtered = results[explorer.collection].filter(item=>{return item[key].toLowerCase() === (asset_name || filter) })
                    } else {
                        filtered = results.filter(item=>{
                            return item[key].toLowerCase() === (asset_name || filter) 
                        })
                    }
                    if (filtered.length > 0) {
                        if (explorer.balance_location) {
                            return cb(Number(filtered[0][explorer.balance_location]))
                        } else {
                            return cb(Number(filtered[0]))
                        }
                    } else {
                        return cb(Number(0))
                    }
                } else {
                    var parsedResults = results
                    if (explorer.item) {
                        parsedResults = parsedResults[explorer.item]
                    }
                    var rawBalance = Number(parsedResults[explorer.balance_location])
                    if (explorer.post) {
                        var func = explorer.name.toString() + "[\""+explorer.post+"\"]"
                        if (contract) {
                            func = func + "(\""+contract+"\", \""+rawBalance+"\")"
                        } else {
                            func = func + "(\""+rawBalance+"\")"
                        }
                        eval(func).then(decimals=>{
                            return cb(decimals.decimalBalance)
                        })
                        
                    } else {
                        return cb(rawBalance)
                    }
                    // return cb()
                }
            })
        } catch(err) {
            console.log("ERRORED!!!!!", err)
            return cb(Number(0))
        }
    }
    return explorer
}
module.exports = explorers