const User = require("../models/User")
const Wallet = require("../models/Wallet")
const WalletLogs = require("../models/WalletLogs")
const bcrypt = require("bcryptjs")
const Superagent = require("../models/SuperAgent")
const AgentManager = require("../models/AgentManager")
const Agent = require("../models/Agent")
const Rental = require("../models/Rental")
const csvtojson = require("csvtojson")
const {manageragentInstance,getAllAgent,checkuser} = require("../services/manager")

const createAgent =  async (req,res,next) => {
    const role_id = 4
    // const terminal_id = uuidv4()
    try {
          
        const agentManger_id = req.user.agentManger_id;
        const data = req.body
        
        const user = await User.findOne({where:{email:req.body.email}})
        if(user){
            return res.status(500).json({
                status:false,
                message:'email already exist',
            })
        }

        const agent = await manageragentInstance(data,agentManger_id)
       
        
       return res.status(200).json({
        status:true,
        message:"agent created",
        data:agent
       })
        
    } catch (error) {
        return res.status(500).json({
            status:false,
            message:error.message,
            error:error.message
        })
    }
}

const getAllAgents = async (req,res,next)=>{
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const agentManger_id = req.user.agentManger_id
    console.log("🚀 ~ file: manager.js:31 ~ getAllAgents ~ agentManger_id", agentManger_id)
    // console.log(superAgent_id)

        try {
            const { getallagents, count, pages, } = await getAllAgent(agentManger_id,page, pageSize);
            
            return res.status(200).json({
                getallagents,
                count,
                pages
            })
        } catch (error) {
            return res.status(500).json({
                status:false,
                message:error.message
            })
        }
    }


const managerCreateAgentCSV = async (req,res)=> {
   
    const requiredFields = [
        // 'acquirerId',
        'fullname',
        'email',
        'business_name',
        'address',
        'region',
        'state',
        'localgovt',
        'phonenumber',
        // 'agentManagerId',
        // 'status'
      ];
    try {
        if(!req.file){
            return res.status(400).json({status:false,message:"please upload a csv"})
        }
        // const {userId,acquirerId} = await findManagerId(req.user.id)
        // const superagent = await Superagent.findByPk(req.user.agentManger_id)
       
        // Parse the uploaded CSV file
        // const results = [];
        const convertcsv = await csvtojson().fromFile(req.file.path);
        Promise.all(convertcsv.map(async function(value) {
            const fields = Object.keys(value);
            for (const field of requiredFields) {
              if (!fields.includes(field)) {
                throw Error(`Missing field: ${field}`);
              }
            }
            const agentmanager = await AgentManager.findByPk(req.user.agentManger_id)
        const superAgentDetails = await Superagent.findOne({where:{acquirer_id:agentmanager.acquirer_id}})

    const user = await User.create({
        name:value.fullname,
        email:value.email,
        role_id:4,
        password:await bcrypt.hash("0000",10)
    })
    const agent = await Agent.create({
        _id:user._id,
        fullname:value.fullname,
        email:value.email,
        business_name:value.business_name,
        phonenumber:value.phonenumber,
        address:value.address,
        state:value.state,
        region:value.region,
        agent_type:"FORMANAGER",
        localgovt:value.localgovt,
        acquirer_id:superAgentDetails.acquirer_id,
        agentmanager_id:req.user.agentManger_id,
    })

   const wallet = await Wallet.create({user_id:user._id,superAgent_id:superAgentDetails._id})
   const walletlogs = await WalletLogs.create({user_id:user._id,superAgent_id:superAgentDetails._id})
 

    // await agentpoint.save()
    await agent.save()
    await wallet.save() 
    await walletlogs.save()
    await user.save()
    
    console.log("🚀 ~ file: User.js:166 ~ agentInstance ~ user,agent,newWallet,agentpoint", user,agent,wallet)
    return {agent:{user,agent,wallet}}
             
            
        })).then(()=>{
            return res.status(201).json({
                status:true,
                message:'Direct Agents created successfully!'
            });
        }).catch(err => {
            return res.status(500).json({
                status:false,
                message:err.message,
                err
            });
        })
       
      } catch (err) {
        // Handle any errors that occur during the upload and creation process
        return res.status(500).json({
            status:false,
            message:err.message,
            error:err
        });
      }
}


module.exports = {
    createAgent,
    getAllAgents,
    managerCreateAgentCSV
}