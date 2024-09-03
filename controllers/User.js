const UserRepository = require("../repos/user-repo")
const asynchandler = require("express-async-handler")

const getUsers = asynchandler( async (req,res) => {
    const users = await UserRepository.getAll()
    return res.status(200).json({
        status:200,
        message:"user fetched",
        data:{
            users
        }
    })
});

const createCEO = asynchandler( async (req,res) => {
    const ceo = await UserRepository.create({...req.body,password:'fileopen',role_id:1,enabled:true,verified:true,status:"true"})
    return res.status(200).json({
        status:200,
        message:"CEO create",
        data:{
            ...ceo
        }
    })
});

const createUsers = asynchandler( async (req,res) => {
    console.log("🚀 ~ file: User.js:27 ~ createUsers ~ req:", req)
  
    const ceo = await UserRepository.create({...req.body,password:'SMfileopen',branch_id:req.user.branch_id ? req.user.branch_id : (req.body.branch_id) ? req.body.branch_id : 0 })
    
    return res.status(200).json({
        status:200,
        message:"user created",
        data:{
            ...ceo
        }
    })
});

const updateUsers = asynchandler( async (req,res) => {
    console.log("🚀 ~ file: User.js:27 ~ createUsers ~ req:", req.query.id)
  
    const ceo = await UserRepository.update({...req.body,branch_id:req.user.branch_id ? req.user.branch_id : (req.body.branch_id) ? req.body.branch_id : 0 ,id:req.query.id})
    
    return res.status(200).json({
        status:200,
        message:"user created",
        data:{
            ...ceo
        }
    })
});

const pendingUsers = asynchandler( async (req,res) => {
    const ceo = await UserRepository.getAllPending()
    
    return res.status(200).json({
        status:200,
        message:"user created",
        data:{
            ...ceo
        }
    })
});

const approve = asynchandler( async (req,res) => {
    if(!req.query.id){
        return res.status(400).json({
            status:false,
            message:"please pass id",
        
        })
    }
    const ceo = await UserRepository.approve({id:req.query.id,status:req.body.status})
    
    return res.status(200).json({
        status:200,
        message:"user approved",
        data:{
            ...ceo
        }
    })
});
const decline = asynchandler( async (req,res) => {
    if(!req.query.id){
        return res.status(400).json({
            status:false,
            message:"please pass id",
        
        })
    }
    const ceo = await UserRepository.approve(req.query.id)
    
    return res.status(200).json({
        status:200,
        message:"user approved",
        data:{
            ...ceo
        }
    })
});






module.exports = {
    getUsers,
    createCEO,
    createUsers,
    pendingUsers,
    approve,
    updateUsers,
    decline

};


