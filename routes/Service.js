const routes = require("express").Router()
const Service = require("../controllers/Service")
const {serviceValidator} = require("../middleware/validator")
const {protect} = require("../repos/token-repo")
const allowedUser = require("../middleware/Authorization")
const cloudinaryRepo = require("../repos/cloudinary")

routes.post("/create",protect,allowedUser([1,5]),serviceValidator,Service.createService)
        .get("/",protect,allowedUser([1,5]),Service.getAllServices)
        .get("/approve",protect,allowedUser([1]),Service.approve)
        .get("/unapprove",protect,allowedUser([1]),Service.unapprove)
        .get("/update",protect,allowedUser([1]),Service.updateService)
        // .put("/update",createHotelConfigValidator,hotemanagerControl.updatehotelmpkg)
        // .get("/pkg",hotemanagerControl.getPkgs)


module.exports = routes;