const routes = require("express").Router()
const ImagesHandler = require("../controllers/Images")
const {createHotelConfigValidator} = require("../middleware/validator")
const {protect} = require("../repos/token-repo")
const allowedUser = require("../middleware/Authorization")
const cloudinaryRepo = require("../repos/cloudinary")

routes.post("/upload",protect,allowedUser([1,2,3,4,5]),cloudinaryRepo._parser,ImagesHandler.uploadBy)
routes.get("/",protect,allowedUser([1,2,3,4,5]),ImagesHandler.getBy)

        // .put("/update",createHotelConfigValidator,hotemanagerControl.updatehotelmpkg)
        // .get("/pkg",hotemanagerControl.getPkgs)


module.exports = routes;