const multer = require("multer");
const path = require('path');
const fs = require('fs');



const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
};

const uploadLogo = multer({
    fileFilter,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./uploads/logo");
        },
        filename: (req, file, cb) => {  
          // change the file name to the original name + the current timestamp
          cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
        }
      }),
      limits: {
        fileSize: 1024 * 1024 * 5
      }
})



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/files')
    },
    filename: function (req, file, cb) {
        // cb(null, file.originalname)
        // change the file name to the user id + the file name
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})

module.exports = {
    upload,
    uploadLogo
}