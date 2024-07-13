const { Router } = require("express")
const route = Router()
const { Verify } = require("../../Authorize/verify")

// CONTROLLERS  
const {

  Signup, Signin,
  Update, DeleteUser,
  Subscribe, GetUser,
  SigninPage,
  SignupPage, Blogs,
  ResetPassword,
  ResetEmail,
  ResetEmailPost,
  Changepassword,
  ChangepasswordPost,
  Ratify,
  postGet,
  postPost,
  Followers,

} = require("../../Authcontrols/controllers")

// MULTER PROJECTS
const upload = require("../../Uploader/upload")
const { uploadPostImg } = require("../../Uploader/postupload")


// BLOG PARAMETERS /// ONGOING
route.get("/blogs", Verify, Blogs)


/// ONGOING 
route.get("/post",Verify, postGet)
route.post("/post",Verify, uploadPostImg.single('image'), postPost)

 

/// DONE 
route.post("/signup", upload.single('image'), Signup)
route.get("/signup", SignupPage)



/// DONE
route.post("/login", Signin)
route.get("/login", SigninPage)



/// DONE 
route.get("/resetpassword/email", ResetEmail)
route.post("/resetpassword/email", ResetEmailPost)



/// DONE
route.get("/resetpassword/password/:id/update/:rnd", ResetPassword)
//route.post("/resetpassword/password",ResetPasswordPost)
route.post("/resetpassword/password/:id/update/:rnd", Update)
route.get("/password/:rnd/:id", Changepassword)
route.post("/password/:rnd/:id", ChangepasswordPost)


route.post("/follower",Verify,Followers)



/// COMING SOON 
route.get("/ratify", Ratify)

route.delete("/:id", DeleteUser)

route.get("/sub/:id", Subscribe)
route.get("/:id", GetUser)


module.exports = route 