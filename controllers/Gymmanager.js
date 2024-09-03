const GymConfigRepository = require("../repos/gym-manager-repo")
const asynchandler = require("express-async-handler");
const { checkGymStatus } = require("../utils/Checkservicestatus");


const getPkgs = asynchandler( async (req,res) => {
    if (req.user.branch) {
        const pkgs = await GymConfigRepository.findAllActiveByBranch(req.user.branch)
        return res.status(200).json({
            message:"pkgs fetched",
            data:{
                pkgs
            }
        })
        
    } else {
        const pkgs = await GymConfigRepository.findAll()
        return res.status(200).json({
            message:"pkgs fetched",
            data:{
                pkgs
            }
        })
        
    }
});

const getPendingPkgs = asynchandler( async (req,res) => {
    if (req.user) {
        console.log("🚀 ~ file: Gymmanager.js:27 ~ getPendingPkgs ~ req:", req)
        const pkgs = await GymConfigRepository.findAllPendingByBranch(req.user.branch)
        return res.status(200).json({
            message:"pkgs fetched",
            data:{
                pkgs
            }
        })
        
    } else {
        const pkgs = await GymConfigRepository.findAllPending()
        return res.status(200).json({
            message:"pkgs fetched",
            data:{
                pkgs
            }
        })
    }
});

const getactivePkgs = asynchandler( async (req,res) => {
    const pkgs = await GymConfigRepository.findAllActive()
    return res.status(200).json({
        message:"pkgs fetched",
        data:{
            pkgs
        }
    })
});

const creategympkg = asynchandler(  async (req,res) => {
 
    const createeventpackage = await GymConfigRepository.create({...req.body,status:false})
    return res.status(200).json({
        status:200,
        message:"gym package ",
        data:{
            createeventpackage
        }
    })
});

const approve = asynchandler( async (req,res) => {
    const createeventpackage = await GymConfigRepository.approve(req.query.id)
    return res.status(200).json({
        status:200,
        message:"gym package approved",
        data:{
            createeventpackage
        }
    })
});

const updategympkg = asynchandler( async (req,res) => {
    const createeventpackage = await GymConfigRepository.updateById(req.query.id,{...req.body,status:false})
    return res.status(200).json({
        status:200,
        message:"event gym package updated ",
        data:{
            createeventpackage
        }
    })
});






module.exports = {
    getPkgs,
    creategympkg,
    updategympkg,
    getactivePkgs,
    getPendingPkgs,
    approve

};


