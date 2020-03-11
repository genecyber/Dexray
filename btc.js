module.exports.fromSat = (wholeUnitBalance=>{
    wholeUnitBalance = Number(wholeUnitBalance)
    wholeUnitBalance = Number(wholeUnitBalance)
    var decimals = 8
    var decimalBalance = wholeUnitBalance / (10**decimals)
    return new Promise((resolve, reject) => {
        resolve({wholeUnitBalance: wholeUnitBalance, decimalBalance: decimalBalance, decimals: decimals})
    })
})