
const routes = require("express").Router()
const {protect} = require("../repos/token-repo")
const allowedUser = require("../middleware/Authorization")
const dashboard = require("../controllers/Dashboard")

routes.get("/",protect,allowedUser([1]),dashboard.GetDashboard)



module.exports = routes