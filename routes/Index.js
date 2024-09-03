const routes = require("express").Router()
const userRoute = require("./User")
const adminRoute = require("./Admin")
const eventRoute = require("./Event")
const eventmanagerRoute = require("./Eventmanager")
const gymmanagerRoute = require("./Gymmanager")
const hotelmanagerRoute = require("./Hotelmanager")
const authRoute = require("./Auth")
const secretatyRoute = require("./Secretary")
const clientRoute = require("./Client")
const branchRoute = require("./Branch")
const imageRoute = require("./Image")
const ServiceRoute = require("./Service")
const DashboardRoute = require("./Dashboard")
const TodoRoute = require("./Todo")
const PaystackRoute = require("./Paystack")



routes.use("/user",userRoute)
routes.use("/portal",adminRoute)
routes.use("/event",eventRoute)
routes.use("/eventmanager",eventmanagerRoute)
routes.use("/gymmanager",gymmanagerRoute)
routes.use("/hotelmanager",hotelmanagerRoute)
routes.use("/secretary",secretatyRoute)
routes.use("/auth",authRoute)
routes.use("/",clientRoute)
routes.use("/branch",branchRoute)
routes.use("/images",imageRoute)
routes.use("/service",ServiceRoute)
routes.use("/dashboard",DashboardRoute)
routes.use("/todos",TodoRoute)
routes.use("/payments",PaystackRoute)



module.exports = routes