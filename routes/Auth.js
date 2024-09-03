const routes = require("express").Router()
const AuthControl = require("../controllers/Auth")
const {validateUser,validatecreateUser} = require("../middleware/validator")

routes.post("/login",AuthControl.Login)
      .post("/reset-password",AuthControl.ResetPassword)
      .post("/change-password",AuthControl.changePass)
    //   .post("/create/ceo",validateUser,usersControl.createCEO)
    //   .post("/create",validatecreateUser,usersControl.createUsers)


module.exports = routes