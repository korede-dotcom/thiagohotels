const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

function createCloudinaryRepo(cloud_name, api_key, api_secret, folder_name) {
  const cloudinaryRepo = {};

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: folder_name,
    allowedFormats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  });

  const parser = multer({ storage: storage });

  cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
  });

  cloudinaryRepo.list = () => {
    return new Promise((resolve, reject) => {
      cloudinary.api.resources(
        { type: 'upload', prefix: folder_name },
        function (error, result) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  };

  cloudinaryRepo.upload = (file) => {
    return new Promise((resolve, reject) => {
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
    });
  };

  cloudinaryRepo.update = (public_id, file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path,
        { public_id: public_id },
        function (error, result) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  };

  cloudinaryRepo.delete = (public_id) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        public_id,
        function (error, result) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  };

  cloudinaryRepo.uploadParser = parser.single('image');
  cloudinaryRepo.updateParser = parser.single('image');

  return cloudinaryRepo;
}

module.exports = createCloudinaryRepo;
