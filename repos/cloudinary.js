const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

class CloudinaryRepo {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret
    });

    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      folder: process.env.folder_name,
      allowedFormats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    });

    this._parser = multer({ storage: storage }).any('image');
  }

  upload(files) {
    return cloudinary.uploader.upload(files);
  }

  uploadMany = (files) => {

    return new Promise((resolve, reject) => {
      const promises = [];
  
      files?.forEach((file) => {
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
  

  update(publicId, file) {
    return cloudinary.uploader.upload(file.path, { public_id: publicId });
  }

  setParser(parser) {
    this._parser = parser;
  }

  getParser() {
    return this._parser;
  }
}


module.exports = new CloudinaryRepo();
