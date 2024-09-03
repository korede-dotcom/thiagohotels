const Branchrepo = require("../repos/branch-repo")
const asynchandler = require("express-async-handler")

const get = asynchandler( async (req,res) => {
    const braches = await Branchrepo.getAllBranches()
    return res.status(200).json({
        status:200,
        message:"branches fetched",
        data:{
            braches
        }
    })
});

const getActive = asynchandler( async (req,res) => {
    const active = await Branchrepo.getAllActiveBranches()
    return res.status(200).json({
        status:200,
        message:"All active branch",
        data:{
            active
        }
    })
});

const create = asynchandler( async (req,res) => {
    console.log("🚀 ~ file: Branch.js:27 ~ create ~ req:", req.user)
    
    if(req.user.role_id === 1){
        const createbranch = await Branchrepo.createBranch({...req.body,status:true})
        return res.status(200).json({
            status:200,
            message:"Branch created ",
            data:{
                createbranch
            }
        })

    }else{
        const createbranch = await Branchrepo.createBranch({...req.body,status:false})
        return res.status(200).json({
            status:200,
            message:"Branch created ",
            data:{
                createbranch
            }
        })

    }
});

const update = asynchandler( async (req,res) => {
    if (req.user.role_id === 1) {
        const updatebranch = await Branchrepo.updateBranchById(req.query.id,{...req.body,status:true})
        return res.status(200).json({
            status:200,
            message:"updatebranch updated ",
            data:{
                updatebranch
            }
        })
    }
    const updatebranch = await Branchrepo.updateBranchById(req.query.id,{...req.body,status:false})
    return res.status(200).json({
        status:200,
        message:"updatebranch updated ",
        data:{
            updatebranch
        }
    })
});

const approve = asynchandler( async (req,res) => {
    const updatebranch = await Branchrepo.approveBranchById(req.query.id)
    return res.status(200).json({
        status:200,
        message:"updatebranch updated ",
        data:{
            updatebranch
        }
    })
});






module.exports = {
    create,
    update,
    get,
    getActive,
    approve

};


