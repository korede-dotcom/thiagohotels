const routes = require("express").Router()
const usersControl = require("../controllers/User")
const {validateUser,validatecreateUser} = require("../middleware/validator")

routes.get("/bookings",usersControl.getUsers)
      .post("/create/ceo",validateUser,usersControl.createCEO)
      .post("/create",validatecreateUser,usersControl.createUsers)
      


module.exports = routes