const mongoose = require("mongoose")
const { Schema, model } = mongoose
const bcrypt = require("bcrypt")
//const postDetails = require("./postmodel")

require("dotenv").config()

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('DB CONN')
}).catch((err) => { console.log("Error :", err) })


const userSchema = Schema({
    name:{
      type:String
    },
    email: {
        type: String,

    },
    password: {
        type: String,

    },
    image: {
        type:String,
        data:Buffer
    },
    subscribers: {
        type: Number,
        default: 0
    },
    subscribedUsers: {
        type: [String]
    },
    post: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref:"userpost"
        }]
    },

}, { timestamps: true })


userSchema.pre("save", async function (next) {
    //const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

 
const postSchema = Schema({
    article: String,
    postedBy:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userblog",
        },
    ], 
    image: {
        type:String,
        data:Buffer
    },

},
{ timestamps: true }
 )
   
    
const postDetails = model("userpost", postSchema)
const userDetails = model("userblog", userSchema)

module.exports = {userDetails,postDetails}
 