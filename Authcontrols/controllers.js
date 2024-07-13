const { userDetails, postDetails } = require("../Models/usermodel")
const bcrypt = require("bcrypt")
const webToken = require("jsonwebtoken")
const { Errorhandler } = require("../Errorhandler/error")
const randomOtp = require("../OTP/otp")
const otpToken = require("../OTP/otp")
const mailerFigure = require("../OTP/sendOTP")
const {log} = console

const fs = require("fs")
const upload = require("../Uploader/upload")

 
require("dotenv").config()
 
module.exports.Blogs = async (req, res) => {
  
    // const userDetails = await User.findById(req.user.userId)
 
    const user = await userDetails.findById(req.user.userId)
    const users = await userDetails.find()
    const blogPost = await postDetails.aggregate().sample(10)

    var postItems = []  
    for (var i = 0; i < blogPost.length; i++) {
        const userp = await userDetails.findById({ _id: blogPost[i].postedBy[0] }).then((data, err) => {
            if (err) {
                console.log(err)
            }
            // console.log(data.image)  
            return data
        })

        postItems.push(userp)
    }

    // const items = [...postItems.split(',')]

     const othersPost = users.filter(function (post) {
        return post._id != req.user.userId
     })  
   

    res.render("../Views/blogs", {
        // USERS DETAILS
        message: user.email,
        pics: `${user.image}`,
        // USERS POSTS  
        posts: blogPost,
        // postedBy: userID , 
        // postArticles: blogPost[index].article,
        people: othersPost,
        self: user,
        userPost: postItems,
        userID : user._id,
    })
 
} 


module.exports.SignupPage = (req, res) => {

    res.render("../Views/signup", { signupMessage: "", pics: "" })

}

module.exports.Signup = async (req, res, next) => {

    try {

        const { name, email, password } = req.body
        const imageFile = req.file ? req.file.filename : null
        const checkExistence = await userDetails.findOne({ email })

        if (email === "" || password === "") {

            res.render("../Views/signup", { signupMessage: "Input field cannot be empty..." })

        } else {
            if (checkExistence) {

                res.render("../Views/signup", { signupMessage: "User already exist", pics: false })
                console.log("User already exist")

            } else {
                let message = "Login with you credentials"

                const user = await userDetails.create({ name: name, email: email, password: password, image: imageFile })

                res.render("../Views/login", { message: "" })

                console.log(user)
            }
        }

    } catch (error) {
        console.log(error)
        return next(Errorhandler(error.status, error.message))
    }
}

module.exports.SigninPage = (req, res) => {
    res.render("../Views/login", { message: "" })
}

module.exports.Signin = async (req, res) => {

    try {
        const { email, password } = req.body

        const user = await userDetails.findOne({ email })

        if (email === "" || password === "") {
            res.render("../Views/login", { message: "Input field cannot be empty..." })
        } else {

            if (user) {

                const passkeyCheck = await bcrypt.compare(password, user.password)
                if (passkeyCheck) {

                    const token = webToken.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: "1h" })

                    await res.cookie("accessToken", token, {
                        httpOnly: true,
                    })

                    res.redirect("/api/user/blogs")
                    console.log(user)

                } else {
                    res.status(401).render("../Views/login", { message: "Incorrect Password" })
                }

            } else {
                res.render("../Views/login", { message: "No such user" })
            }

        }

    } catch (error) {
        res.json(error)
        // return next(Errorhandler(error.status, error.message))
    }
}


module.exports.ResetEmail = (req, res) => {
    res.render("../Views/resetEmail", { passwordReport: "" })
}

module.exports.ResetEmailPost = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userDetails.findOne({ email })

        if (user) {

            const figure = await otpToken()
            console.log(figure)

            await res.cookie("otp", figure, {
                httpOnly: true,
                maxAge: 1000 * 60 * 10
            })

            mailerFigure(figure, user.email, user._id)

            res.redirect(`/api/user/resetpassword/password/${user._id}/update/${Math.floor(Math.random() * 10000)}`)

        } else {
            res.render("../Views/resetEmail", { passwordReport: "No such user" })
        }

    } catch (error) {
        res.json(error)
    }
}


module.exports.ResetPassword = (req, res) => {
    res.render("../Views/resetPasskey", { passwordReport: "" })

}


module.exports.Update = async (req, res) => {

    const user = await userDetails.findById(req.params.id)
    const cookieCheck = await req.cookies.otp
    const proof = cookieCheck === req.body.password

    try {

        if (user && proof) {
            res.redirect(`/api/user/password/${Math.floor(Math.random() * 1000000000000)}/${req.params.id}`)

        } else {
            res.json("ERROR OCCURED")
        }

    } catch (error) {
        res.json(error)
    }
}


module.exports.Changepassword = (req, res) => {
    res.render("../Views/changekey", { passwordReport: "" })

}

module.exports.ChangepasswordPost = async (req, res) => {
    try {

        const hash = await bcrypt.hash(req.body.password, 10)
        req.body.password = hash

        await userDetails.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
            {
                new: true
            })
        console.log(req.body)

        res.redirect("/api/user/ratify")

    } catch (error) {
        console.log(error)
    }
}


module.exports.Ratify = async (req, res) => {
    res.render("../Views/confirmation")
}

module.exports.postGet = (req, res) => {
    res.render("../Views/post")
}

module.exports.postPost = async (req, res) => {
    try {
        // await userDetails.findByIdAndUpdate(req.user.userId, {
        //     $push: { post: req.body.article }
        // })
 
 
        const user = await userDetails.findById(req.user.userId)
        const imageFile = req.file ? req.file.filename : null
        const post = await postDetails.create({ article: req.body.article, postedBy: user, image: imageFile })
       
       
       
       /// AGGREGATION IMPLEMENTATION 
        // const user = await userDetails.find({_id:req.user.userId}).populate('post')
        // const user = await userDetails.aggregate([
        //     {
        //         $lookup:{
        //             from:"userpost",
        //             localField:"post",
        //             foreignField:"_id",
        //             as:"user_blogs_post"
        //         }
        //     }
        // ])


        //const post = await postDetails.find({}).populate("postedBy")


        console.log(post)
        await userDetails.updateOne(
            { _id: req.user.userId },
            {
                $push: {
                    post: post
                }
            },
            { new: true }
        )

       // console.log(userPost)

        res.redirect("/api/user/blogs")

        //    const postIdea = await postDetails.findOne().populate('postedBy').exec()
        //    console.log(postIdea)


    } catch (error) {
        console.log(error)
    }
}


module.exports.Followers = async (req,res)=>{
    try {
       const dataResponse = req.body.body
       log(dataResponse)
       const getPost = await postDetails.findById(dataResponse)
       
       const userIdFromPost = getPost.postedBy[0]
       console.log(userIdFromPost)


     const user =  await userDetails.findByIdAndUpdate(userIdFromPost, {
        $inc: { subscribers: 1 },
        $push: { subscribedUsers: req.user.userId },
      },)

      log(user)

     res.redirect("/api/user/blogs")

    } catch (error) {
        console.log(error)
    }
}
 
 
module.exports.DeleteUser = async (req, res) => {
    try {
        await userDetails.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been Deleted")
    } catch (error) {
        res.json(error)
    }
}

module.exports.Subscribe = async (req, res) => {
    try {

        await userDetails.findByIdAndUpdate(req.params.id, {
            $inc: { subcribers: 1 },
            $push: { subscribedUsers: req.params.id },
        },)

        // await User.findById(req.params.id, {
        //     $push: { subcribedUsers: req.params.id },
        // },)

        res.status(200).json("Subcription successfull")

    } catch (error) {
        res.json(error)
    }
}

module.exports.GetUser = async (req, res) => {
    try {
        // const user = await userDetails.findByIdAndUpdate('6664404ec4b71a9c6be9df5d',{
        //     $inc: { subcribers: 1 },
        // })
        const post = await postDetails.find({})
        res.json(post)

    } catch (error) {
        res.json(error)
    }
}