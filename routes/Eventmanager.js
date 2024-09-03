const routes = require("express").Router()
const managerControl = require("../controllers/Eventmanager")
const {createEventConfigRules,updateEventConfigRules,bookEvent} = require("../middleware/validator")
const {protect} = require("../repos/token-repo")
const allowedUser = require("../middleware/Authorization")
const {checkEventStatus} = require("../utils/Checkservicestatus")

routes.post("/create",protect,allowedUser([1,2,5,9]),checkEventStatus,createEventConfigRules,managerControl.createeventpkg)
        .put("/update",protect,allowedUser([1,2]),checkEventStatus,updateEventConfigRules,managerControl.updateeventpkg)
        .post("/book",protect,allowedUser([1,2,5,9]),checkEventStatus,bookEvent,managerControl.bookForClient)
        .get("/book",protect,allowedUser([1,2,5,9]),checkEventStatus,managerControl.Allbookings)
        .get("/pkg",protect,allowedUser([2,1,5,9]),checkEventStatus,managerControl.getPkgs)
        .get("/pending/pkg",protect,allowedUser([2,1,5]),checkEventStatus,managerControl.getPendingPkgs)
        .get("/active/pkg",checkEventStatus,managerControl.getActivePkgs)
        .get("/approve/pkg",protect,allowedUser([1]),checkEventStatus,managerControl.approve)
        .get("/dashboard",protect,allowedUser([2,1,5,9]),)

module.exports = routes