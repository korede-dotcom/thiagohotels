const routes = require("express").Router()
const validate = require("../middleware/validator")
const general = require("../controllers/General")

// routes.post("/create/staff",createHotelConfigValidator,hotemanagerControl.createhotelpkg)
//         .put("/update",createHotelConfigValidator,hotemanagerControl.updatehotelmpkg)
//         .get("/pkg",hotemanagerControl.getPkgs)

// routes.post("/general-message",validateGenMessage,general.createGeneral)
routes.put("/general-message",validate.validateGenMessage,general.update)
    .post("/general-message",validate.validateGenMessage, general.createGeneral)
    .get("/general-message/approve", general.approve)
    .get("/general-message",general.getAll)
    .delete("/general-message",general.deleteGeneral)
        // .delete("/general-message",generalControl.deleteGeneral)

module.exports = routes