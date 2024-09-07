const routes = require("express").Router()
const managerControl = require("../controllers/Eventmanager")
const Gym = require("../controllers/Gymmanager")
const client = require("../controllers/Client")
const Hotel = require("../controllers/Hotelmanager")
const {bookEvent} = require("../middleware/validator")
const roomRepo = require("../repos/Room-repo")

routes.get("/event/pkg",managerControl.active)
        .get("/gym/pkg",Gym.getactivePkgs)
        .get("/",Hotel.clientHotelRoom)
        .get("/hotel/pkg",Hotel.clientHotelRoom)
        .get("/validate/date",client.validatedate)
        .post("/book/event",managerControl.bookForClient)
        .post("/check-availability",Hotel.GetAvailability)
        .get("/available-rooms",Hotel.clientRoomAvailable)
        .get("/rooms",Hotel.clientRoom)
        .get("/result",Hotel.paymentResult)
        // .post("/bookroom",protect ,checkHotelStatus,hotemanagerControl.bookRoom)


module.exports = routes