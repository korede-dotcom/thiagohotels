const routes = require("express").Router()
const AuthControl = require("../controllers/Auth")
const checkAuthCookie = require("../middleware/checkAuthCookie")
const {validateUser,validatecreateUser} = require("../middleware/validator")

routes.post("/login",AuthControl.Login)
      .post("/reset-password",AuthControl.ResetPassword)
      .post("/change-password",AuthControl.changePass)
      .post("/change-self-password",checkAuthCookie,AuthControl.changeUserPass)
      .post("/change-first-password",AuthControl.changeUserFirsTimePass)
      
    //   .post("/create/ceo",validateUser,usersControl.createCEO)
    //   .post("/create",validatecreateUser,usersControl.createUsers)


module.exports = routes