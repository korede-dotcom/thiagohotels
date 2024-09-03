const EventConfigRepository = require("../repos/eventmanager-repo")
const asynchandler = require("express-async-handler")
const booking = require("../repos/event-booking-repo")
const EventBookingRepository = new booking ()

const validatedate = asynchandler( async (req,res) => {
    const dates = await EventBookingRepository.checkDate(req.query.date,req.query.branch_id)
    if (dates) {
        return res.status(200).json({
           status:false,
            message:"date is not available",
            data:{
                dates
            }
        })
        
    }else{
        return res.status(200).json({
            status:true,
             message:"date is available",
            
         })
    }
});


module.exports = {
    validatedate
}