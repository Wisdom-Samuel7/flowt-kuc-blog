const otpToken = () =>{
    const doublet = Math.round( Math.random() * 10000)
    return doublet
}
module.exports = otpToken