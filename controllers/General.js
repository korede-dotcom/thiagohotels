const General = require("../repos/general-repo")
const asynchandler = require("express-async-handler")

const createGeneral = asynchandler( async (req, res) => { 
    if (req?.user?.role_id === 1) {
        const general = await General.createGeneral({...req.body,status:true});
        res.json({
            status:true,
            data:{
                general
            }
        });
        
    }
    const general = await General.createGeneral({...req.body,status:false});
    res.json({
        status:true,
        data:{
            general
        }
    });
})
  
const getAll = asynchandler( async (req, res) => {
    const generals = await General.getAllGenerals();
    res.json({
        status:true,
        data:{
            generals
        }
    });
})
  
const getById = asynchandler(async (req, res) => {
    const general = await General.getGeneralById(req.params.id);
    if (general) {
        res.json({
            status:true,
            data:{
                general
            }
        });
    } else {
      res.status(404).send('General not found');
    }
})
  
const update = asynchandler( async (req, res) => {
    if(req?.user?.role_id === 1){
        const general = await General.updateGeneralById(req.query.id,{general_message:req.body.general_message,status:true});
        if (general) {
          return  res.json({
            status:true,
            data:{
                general
            }
        });
        } else {
            return res.status(404).send('General not found');
        }
        
    }
    const general = await General.updateGeneralById(req.query.id,{general_message:req.body.general_message,status:false});
    if (general) {
        res.json({
            status:true,
            data:{
                general
            }
        });
    } else {
      res.status(404).send('General not found');
    }
})
const approve = asynchandler( async (req, res) => {
    const general = await General.approveGeneralById(req.query.id, {status:true});
    if (general) {
        res.json({
            status:true,
            data:{
                general
            }
        });
    } else {
      res.status(404).send('General not found');
    }
})
  
const deleteGeneral = asynchandler( async (req, res) => {
    const result = await General.deleteGeneralById(req.query.id);
    if (result) {
        res.json({
            status:true,
         
        });
    } else {
      res.status(404).send('General not found');
    }
})

  module.exports = {
    createGeneral,
    getById,
    update,
    deleteGeneral,
    getAll,
    approve
  };