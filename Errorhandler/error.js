module.exports.Errorhandler = (statusCode,message)=>{
    const error = new Error()
    error.status = statusCode
    error.message = message
    console.log(error)
   // return next(error)
}