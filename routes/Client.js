const routes = require("express").Router()
const managerControl = require("../controllers/Eventmanager")
const Gym = require("../controllers/Gymmanager")
const client = require("../controllers/Client")
const Hotel = require("../controllers/Hotelmanager")
const {bookEvent} = require("../middleware/validator")
const roomRepo = require("../repos/Room-repo")
const SendEmail = require("../utils/sendEmail")

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
        .get("/page-contact",Hotel.contact)
        .post("/send-email",async(req,res) => {
                const {subject,email:to,message} = req.body;
                
                await SendEmail(subject,message,message,"thiagohotelandsuites@gmail.com",to)
                await SendEmail(subject,"your email to us has been received we will reachout to you shortly","your email to us has been received we will reachout to you shortly",to,"thiagohotelandsuites@gmail.com")
                return res.json({message: "Email sent successfully",status:true,})
        })
        // .post("/bookroom",protect ,checkHotelStatus,hotemanagerControl.bookRoom)


module.exports = routes