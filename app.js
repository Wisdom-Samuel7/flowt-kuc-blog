const express = require("express")
const app = express()
const bp = require("body-parser")
const cors = require("cors")
const path = require("path")
const cookies = require("cookie-parser")
const routes = require("./Routes/user_route/user_route")
require("dotenv").config()

 
app.use(express.static(path.join(__dirname,'Uploader')))
app.use(cookies())
app.use(bp.json())
app.use(bp.urlencoded({extended:true}))

// STACKS
app.use("/api/user",routes)

app.set("view engine","ejs")

// CROSS ORIGIN RESOURCE SHARING ACTION 
app.use(cors())
app.get("/",(req,res)=>{
    res.render("../Views/home") 
})

app.get('/fetchtest',(req,res)=>{
    res.render("../Views/fetchtest")
}) 
   
 
app.listen("3000",()=>{
    console.log("Server on port 3000")
}) 
  