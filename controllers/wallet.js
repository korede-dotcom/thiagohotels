const {getAgentWallets} = require("../services/Wallet")



const getWallets = async (req,res,next) => {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const superAgent_id = req.user.superAgent_id
    const id = req.query.id
    console.log(superAgent_id)
    
    try {
        const { allAgentWallet,pages,count} = await getAgentWallets(superAgent_id,id,page,pageSize)
        
        return res.status(200).json({
            allAgentWallet,
            count,
            pages
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status:false,
            message:error
        })
    }
}


module.exports = {
    getWallets
}