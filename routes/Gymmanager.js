const routes = require("express").Router()
const gymmanagerControl = require("../controllers/Gymmanager")
const {protect} = require("../repos/token-repo")
const allowedUser = require("../middleware/Authorization")
const Service = require("../utils/Checkservicestatus")
const checkGymStatus = require("../utils/Checkservicestatus").checkGymStatus

const {createGymConfigValidator,updateGymConfigValidator} = require("../middleware/validator")

routes.post("/create",protect ,allowedUser([1,3,5]),checkGymStatus,createGymConfigValidator,gymmanagerControl.creategympkg)
        .put("/update",protect ,allowedUser([1,3,5]),checkGymStatus,updateGymConfigValidator,gymmanagerControl.updategympkg)
        .get("/pkg",protect ,allowedUser([1,3,5]),checkGymStatus,gymmanagerControl.getPkgs)
        .get("/pending/pkg",protect ,allowedUser([1,3,5]),checkGymStatus,gymmanagerControl.getPendingPkgs)
        .get("/approve/pkg",protect ,allowedUser([1]),checkGymStatus,gymmanagerControl.approve)

module.exports = routes