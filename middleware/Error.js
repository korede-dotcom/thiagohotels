const {constant} = require("../constant")
require("dotenv").config()

const errorHandler  = (err,req,res,next) => {
    console.log("🚀 ~ file: Error.js:5 ~ errorHandler ~ err:", err)
    const statusCode = res.statusCode ? res.statusCode : 500;
    
    if(err?.errors){
        err?.errors?.map(e => {
            e.type == 'unique violation' ? 
            res.json({
                status:false,
                title:"Not Found",
                message:`${e.path} ${e.value} already exist`,
            }) : 
            res.json({
                status:false,
                title:"Not Found",
                message:e.message,
            })
        })
        
    } else {
        switch (statusCode) {
            case constant.NOT_FOUND:
                res.json({
                    status:false,
                    title:"Not Found",
                    message:err?.message,
                    sta:err.stack
                })
                break;
            case constant.VALIDATION_ERROR:
                res.json({
                    status:false,
                    title:"Validation Failed",
                    message:err?.message,
               
                })
                break;
            case constant.UNAUTHORIZED:
                res.json({
                    status:false,
                    title:"Unauthorized",
                    message:err.message,
                    
                })
                break;
            case constant.FORBIDDEN:
                res.json({
                    status:false,
                    title:"Forbidden",
                    message:err.message,
                  
                })
                break;
            case constant.SERVER_ERROR:
                res.json({
                    status:false,
                    title:"Server Error",
                    message:err.message,
               
                })
                break;
        
            default:
                res.json({
                    status:false,
                    title:"Server Error",
                    message:err.message,
               
                })
                break;
        }

    }



}


module.exports = {
    // fullError,
    // checkError,
    errorHandler
}