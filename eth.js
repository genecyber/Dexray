const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/b1c27a6711ec4772aa042f0cf9ee2d22'))

let minABI = [
    // transfer
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "type": "function"
    },
 // balanceOf
 {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
    },
    // decimals
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "type": "function"
    }
];

module.exports = {
    decimals: (contractAddress, wholeUnitBalance)=>{
            var contract = new web3.eth.Contract(minABI, contractAddress)
            return contract.methods.decimals().call().then(decimals=>{
                var decimalBalance = wholeUnitBalance / (10**Number(decimals))
                return {wholeUnitBalance: wholeUnitBalance, decimalBalance: decimalBalance, decimals: Number(decimals)};
            })
    }, 
    fromWei: (wholeUnitBalance=>{
        wholeUnitBalance = Number(wholeUnitBalance)
        var decimals = 18
        var decimalBalance = wholeUnitBalance / (10**Number(decimals))
        return new Promise((resolve, reject) => {
            resolve({wholeUnitBalance: wholeUnitBalance, decimalBalance: decimalBalance, decimals: decimals})
        })
        // return {wholeUnitBalance: wholeUnitBalance, decimalBalance: decimalBalance, decimals: decimals};
    })
}