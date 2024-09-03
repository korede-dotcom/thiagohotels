const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


function createMultipleCloudinaryRepo (cloud_name, api_key, api_secret, folder_name) {
    const cloudinaryRepo = {};
  
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      folder: folder_name,
      allowedFormats: ['jpg', 'png', 'jpeg'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    });

    const parser = multer({ storage: storage }).array('images', 10);

    cloudinary.config({
        cloud_name: cloud_name,
        api_key: api_key,
        api_secret: api_secret,
      });


cloudinaryRepo.upload = (files) => {
    return new Promise((resolve, reject) => {
      const promises = [];
  
      files.forEach((file) => {
        promises.push(
          new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
              file.path,
              function (error, result) {
                if (error) {
                  console.log(error);
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
          })
        );
      });
  
      Promise.all(promises)
        .then((results) => {
          resolve(results);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };
  
  cloudinaryRepo.update = (public_ids, files) => {
    return new Promise((resolve, reject) => {
      const promises = [];
  
      files.forEach((file, index) => {
        promises.push(
          new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
              file.path,
              { public_id: public_ids[index] },
              function (error, result) {
                if (error) {
                  console.log(error);
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
          })
        );
      });
  
      Promise.all(promises)
        .then((results) => {
          resolve(results);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  cloudinaryRepo.uploadParser = parser.array('images', 10);
cloudinaryRepo.updateParser = parser.array('images', 10);

return cloudinaryRepo;

}

module.exports = createMultipleCloudinaryRepo;