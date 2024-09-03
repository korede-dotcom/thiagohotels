const EventConfigRepository = require("../repos/eventmanager-repo")
const asynchandler = require("express-async-handler")
const booking = require("../repos/event-booking-repo")
const EventBookingRepository = new booking ()

const getPkgs = asynchandler( async (req,res) => {
    const pkgs = await EventConfigRepository.getAllEventConfigs()
    return res.status(200).json({
       status:true,
        message:"pkgs fetched",
        data:{
            pkgs
        }
    })
});

const approve = asynchandler( async (req,res) => {

    const pkgs = await EventConfigRepository.approve(req.query.id)
    return res.status(200).json({
       status:true,
        message:"pkgs fetched",
        data:{
            pkgs
        }
    })
});


const getActivePkgs = asynchandler( async (req,res) => {
    
    if (req.user) {
        const pkgs = await EventConfigRepository.getAllEventConfigsActiveBybranch(req.user.branch)
        return res.status(200).json({
           status:true,
            message:"pkgs fetched",
            data:{
                pkgs
            }
        })
        
    } else {
        console.log("🚀 ~ file: eventmanager.js:42 ~ getActivePkgs ~ req.query.branchid:", parseInt(req.query.branchid))
        const pkgs = await EventConfigRepository.getAllEventConfigsActive(parseInt(req.query.branchid))
        return res.status(200).json({
           status:true,
            message:"pkgs fetched",
            data:{
                pkgs
            }
        })
        
    }
});

const active = asynchandler(async (req,res) => {
    const pkgs = await EventConfigRepository.getAllEventConfigsActive()
        return res.status(200).json({
           status:true,
            message:"pkgs fetched",
            data:{
                pkgs
            }
        })
})


const getPendingPkgs = asynchandler( async (req,res) => {
    if (req.user) { 
        const pkgs = await EventConfigRepository.getAllEventConfigsPendingByBranch(req.user.branch)
        return res.status(200).json({
           status:true,
            message:"pkgs fetched",
            data:{
                pkgs
            }
        })
        
    } else {
        const pkgs = await EventConfigRepository.getAllEventConfigsPending()
        return res.status(200).json({
           status:true,
            message:"pkgs fetched",
            data:{
                pkgs
            }
        })
        
    }
});

const createeventpkg = asynchandler( async (req,res) => {
    const createeventpackage = await EventConfigRepository.createEventConfig({...req.body,status:false})
    return res.status(200).json({
       status:true,
        message:"event package ",
        data:{
            createeventpackage
        }
    })
});

const updateeventpkg = asynchandler( async (req,res) => {
    // console.log("🚀 ~ file: Eventmanager.js:104 ~ updateeventpkg ~ req:", req.body)
//     const newObj = {};
    // const findEventpkg = await EventConfigRepository.getEventConfigById(parseInt(req.query.id))
//     console.log("🚀 ~ updateeventpkg ~ findEventpkg:", findEventpkg)
    
//     function getAndSet (key,value) {
//         if(value.lenght) {
//             newObj.key = value
//         }
//     }
//    const newDtat = getAndSet(Object.keys(req.body),Object.values(req.body))
//    console.log("🚀 ~ updateeventpkg ~ newDtat:", newDtat)

    
    if (req.user.role_id === 1) {
        const createeventpackage = await EventConfigRepository.updateEventConfig(req.query.id,{...req.body,status:true})
        return res.status(200).json({
           status:true,
            message:"event package updated ",
            data:{
                createeventpackage
            }
        })
        
    }
    const createeventpackage = await EventConfigRepository.updateEventConfig(req.query.id,{...req.body,branch_id:parseInt(req.user.branch),status:req.body.status})
    return res.status(200).json({
       status:true,
        message:"event package updated ",
        data:{
            createeventpackage
        }
    })
});

const bookForClient = asynchandler( async (req,res) => {
    console.log("🚀 ~ file: Eventmanager.js:117 ~ bookForClient ~ req.body:", req.body)
    try {
        const createeventpackage = await EventBookingRepository.create({...req.body,booked_by:req?.user?._id ? req?.user?._id : null })
        return res.status(200).json({
           status:true,
            message:"event package updated ",
            data:{
                createeventpackage
            }
        })
        
    } catch (error) {
        console.log("🚀 ~ file: Eventmanager.js:126 ~ bookForClient ~ error:", error)
        return res.status(400).json({
           status:false,
            message:"event package updated ",
            data:{
                error
            }
        })
        
    }
});

const Allbookings = asynchandler( async (req,res) => {
    let createeventpackage;
    console.log("🚀 ~ file: Eventmanager.js:141 ~ Allbookings ~ req.user.role_id:", req.user.role_id)
    switch (req.user.role_id) {

        case 9:
             createeventpackage = await EventBookingRepository.getByBranchId(parseInt(req.user.branch))
            return res.status(200).json({
                status:true,
                message:"event package updated ",
                data:{
                    allevents:createeventpackage
                }
            })
            break;
    
        default:
             createeventpackage = await EventBookingRepository.getAll()
            return res.status(200).json({
                status:true,
                message:"event package updated ",
                data:{
                    allevents:createeventpackage
                }
            })
            break;
    }
});


const DashboardData = asynchandler(async (req,res) => {
    let count;
    switch (req.user.role_id) {
        case 1:
            
            break;
        case 1:
            
            break;
        case 1:
            
            break;
        case 1:
            
            break;
        case 1:
            
            break;
    
        default:
            break;
    }
})






module.exports = {
    getPkgs,
    createeventpkg,
    updateeventpkg,
    getActivePkgs,
    getPendingPkgs,
    approve,
    active,
    bookForClient,
    Allbookings

};


