const {upload} = require("../utils/multer")

const uploader = (req, res, next) => {
    if(req.file){
        console.log("first file")

        const pathToFile = req.file.pathname
        upload.single("file")

        next()
    }
    else{
        return "errrrrrrrr"
    }
    
}

module.exports = uploader