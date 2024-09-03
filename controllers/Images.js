const asynchandler = require("express-async-handler")
const cloudinaryRepo = require("../repos/cloudinary")
const Images = require("../models/Images") 




const uploadBy = async  (req,res,nex) => {
    const query = req.query.for
    let upload,bulkCreatePromise,createdImages;

    switch (query) {
        case 'branch':
            
             upload = await cloudinaryRepo.uploadMany(req.files)
               let imageObject = upload.map(url => ({
                 user_id: req.user.user_id,
                 for: "branch",
                 branch_id:req.user.branch_id ? req.user.branch_id : 0,
                 public_id:url.public_id,
                 status:req.user.role_id === 1 ? true :false,
                 url: url.url
               }));
               Images.bulkCreate(imageObject);
             
               // wait for all promises to be resolved
                await Promise.all([bulkCreatePromise]);
                return res.status(200).json({
                 status:true,
                 data:{
                     createdImages
                 }
                })
             
            break;
        case 'events':
           
        upload = await cloudinaryRepo.uploadMany(req.files)
               let obj = upload.map(url => ({
                 user_id: req.user.user_id,
                 for: "events",
                 branch_id:req.user.branch_id ? req.user.branch_id : 0,
                 public_id:url.public_id,
                 url: url.url,
                 status:req.user.role_id === 1 ? true :false
               }));
               bulkCreatePromise = Images.bulkCreate(obj);
             
               // wait for all promises to be resolved
                [createdImages] = await Promise.all([bulkCreatePromise]);
                return res.status(200).json({
                 status:true,
                 data:{
                     createdImages
                 }
                })
             
             
            break;
        case 'gym':
        
                    upload = await cloudinaryRepo.uploadMany(req.files)
            let image = upload.map(url => ({
                 user_id: req.user.user_id,
                 for: "gym",
                 branch_id:req.user.branch_id ? req.user.branch_id : 0,
                 public_id:url.public_id,
                 url: url.url,
                 status:req.user.role_id === 1 ? true :false
               }));
             bulkCreatePromise = Images.bulkCreate(image);
             
               // wait for all promises to be resolved
                [createdImages] = await Promise.all([bulkCreatePromise]);
                return res.status(200).json({
                 status:true,
                 data:{
                     createdImages
                 }
                })
             
            break;
        case 'gymclass':
            
                upload = await cloudinaryRepo.uploadMany(req.files)
                let images = upload.map(url => ({
                 user_id: req.user.user_id,
                 for: "gymclass",
                 branch_id:req.user.branch_id ? req.user.branch_id : 0,
                 public_id:url.public_id,
                 url: url.url,
                 status:req.user.role_id === 1 ? true :false
               }));
               bulkCreatePromise = Images.bulkCreate(images);
             
               // wait for all promises to be resolved
               [createdImages] = await Promise.all([bulkCreatePromise]);
                return res.status(200).json({
                 status:true,
                 data:{
                     createdImages
                 }
                })
             
            break;
        case 'eventhall':
             
            
                upload = await cloudinaryRepo.uploadMany(req.files)
                let img = upload.map(url => ({
                user_id: req.user.user_id,
                for: "eventhall",
                branch_id:req.user.branch_id ? req.user.branch_id : 0,
                public_id:url.public_id,
                url: url.url,
                status:req.user.role_id === 1 ? true :false
            }));
             bulkCreatePromise = Images.bulkCreate(img);
            
            // wait for all promises to be resolved
            [createdImages] = await Promise.all([bulkCreatePromise]);
                return res.status(200).json({
                status:true,
                data:{
                    createdImages
                }
                })
   
            break;
      
        case 'hotel':
            
                upload = await cloudinaryRepo.uploadMany(req.files)
                let imgs = upload.map(url => ({
                 user_id: req.user.user_id,
                 for: "hotel",
                 branch_id:req.user.branch_id ? req.user.branch_id : 0,
                 public_id:url.public_id,
                 url: url.url,
                 status:req.user.role_id === 1 ? true :false
               }));
               bulkCreatePromise = Images.bulkCreate(imgs);
             
               // wait for all promises to be resolved
               [createdImages] = await Promise.all([bulkCreatePromise]);
                return res.status(200).json({
                 status:true,
                 data:{
                     createdImages
                 }
                })
         
            
            break;
        case 'hotelroom':
           
                upload = await cloudinaryRepo.uploadMany(req.files)
                const imageObjects = upload.map(url => ({
                user_id: req.user.user_id,
                for: "hotelroom",
                branch_id:req.user.branch_id ? req.user.branch_id : 0,
                public_id:url.public_id,
                url: url.url,
                status:req.user.role_id === 1 ? true :false
            }));
            bulkCreatePromise = Images.bulkCreate(imageObjects);
            
            // wait for all promises to be resolved
            [createdImages] = await Promise.all([bulkCreatePromise]);
                return res.status(200).json({
                status:true,
                data:{
                    createdImages
                }
                })
            
            break;
    
        default:
            return res.status(400).json({
                status:false,
                messsage:"pass your image for"
                })
            break;
    }
}

const getBy = async (req, res, next) => {
    const { for: queryFor } = req.query;
    if(!queryFor){
       return res.status(400).json({ status: false, messsage: "please pass a query"});
    }
    try {
      const images = await Images.findAll({ where: { for: queryFor },order: [['_id', 'DESC']] });
      res.status(200).json({ status: true, data: { images } });
    } catch (error) {
      next(error);
    }
}















module.exports = {
    uploadBy,
    getBy
}