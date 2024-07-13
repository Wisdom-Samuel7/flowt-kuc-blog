const webToken = require("jsonwebtoken")
const { Errorhandler } = require("../Errorhandler/error")

require("dotenv").config()

const Verify = (req, res, next) => {
  const token = req.cookies.accessToken

  if (!token) {
    res.redirect("/api/user/login")
    // return next(Errorhandler(401, "No token"))
  } else {
    webToken.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) {
        //res.render("../Views/login", { message: "Please try againå" })
        res.redirect("/api/user/login")
        // return next(Errorhandler(403, "Not Authorized"))
      } else {
        req.user = user
        // res.redirect("../Views/test",{message:req.user._id})
        next()
      }
    })
  }
}
module.exports = { Verify }