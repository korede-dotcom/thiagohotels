
const ROLES = {
    admin:1,
    superagent:2,
    agentmanager:3,
    agent:4
}


const allowedUser = (role_id) =>{
    const allowedId = [...role_id];
    return (req,res,next) =>{
        if(!allowedId.includes(req.user.role_id)){
            return res.status(401).json({
                status: false,
                error: 'You are not authorized to perform this action'
            })
        }
        next()
    }
}


module.exports = allowedUser