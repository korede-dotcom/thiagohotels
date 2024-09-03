const cloudinaryRepo = require("../repos/cloudinary")

const uploader = async (req) => {
    // req.files
    const upload = await cloudinaryRepo.uploadMany(req.files)
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
  
}