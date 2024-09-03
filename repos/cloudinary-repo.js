const createCloudinaryRepo = require('../utils/cloudinary');
const createMultipleCloudinaryRepo = require("../utils/multiple-cloudinary")
require("dotenv").config()

const cloudinaryRepo = createCloudinaryRepo(
  process.env.cloud_name,
  process.env.api_key,
  process.env.api_secret,
  process.env.folder_name
);

const cloudinaryMultipleRepo = createMultipleCloudinaryRepo(
  process.env.cloud_name,
  process.env.api_key,
  process.env.api_secret,
  process.env.folder_name
);

// Use cloudinaryRepo methods in your Node.js application
cloudinaryRepo.list().then((result) => {
  console.log(result);
});

app.post('/upload', cloudinaryRepo.uploadParser, (req, res) => {
  cloudinaryRepo.upload(req.file).then((result) => {
    res.json(result);
  });
});

app.put('/update/:id', cloudinaryRepo.updateParser, (req, res) => {
  cloudinaryRepo.update(req.params.id, req.file).then((result) => {
    res.json(result);
  });
});

app.delete('/delete/:id', (req, res) => {
  cloudinaryRepo.delete(req.params.id).then((result) => {
    res.json(result);
  });
});


module.exports = cloudinaryRepo;