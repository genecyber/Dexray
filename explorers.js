const request = require('request')
var explorers = require('./explorers.json')
explorers.get = function(name){
    var explorer = this.filter(explorer=>{return explorer.name === name })[0]
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
    explorer.request = function(address, asset_name, cb){
        var explorer = this
        var endpoint = explorer.build({"address": address})
        request.get(endpoint, (error, response, body)=>{
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
                return cb(Number(results[explorer.item][explorer.balance_location]))
            }
        })
    }
    return explorer
}

module.exports = explorers