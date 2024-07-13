const mailer = require("nodemailer")

const mailerFigure = (code, email, id) => {

    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: "wisdomsamuel349@gmail.com",
            pass: "hgtd wscf bywx gcrj"
        }
    })


    //const link = "localhost:3000/api/user/resetpassword/password"
    const mailOpts = {
        from: "wisdomsamuel349@gmail.com",
        to: email,
        subject: "OTP",
        html: `<div style="width:100%;height:20em;font-weight:bolder;background:rgba(0,0,0,.9);color:#fff;padding:2em 0;">  
                   <div style="text-align:center;color:cornflowerblue;"> ${email} </div>
                   <div style="text-align:center;"><h1 style="text-align:center;color:"white">${code}</h1></div>
                   <div style="text-align:center;"> Type this code in the redirected route... </div>
                   <div style="text-align:center;color:cornflowerblue;"> Expires in 5 minutes </div>
               </div>
              `
    }


    transporter.sendMail(mailOpts, (err, data) => {
        if (err) {
            console.log("ERROR :" + err)
        } else {
            console.log(data.response)
            res.redirect("/api/user/blog")
        }
    })

}

module.exports = mailerFigure