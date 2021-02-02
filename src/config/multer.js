const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const crypto = require('crypto');
const path = require('path');

// Here we have two types of storage: Local for development and S3 for production
const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
    },
    filename: (req, file, callback) => {
      // generating an unique filename for the image uploaded
      // in case the same image is uplodade more than once
      crypto.randomBytes(16, (err, hash) => {
        if(err) callback(err);
        
        file.key = `${hash.toString('hex')}-${file.originalname}`;
        callback(null, file.key);
      });
    }
  }),
  s3: multerS3({
    // s3 is a required variable inside multerS3
    s3: new aws.S3(),
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE, // this line makes the browser opens the file instead of dowloading it
    acl: 'public-read',
    key: (req, file, callback) => {
      crypto.randomBytes(16, (err, hash) => {
        if(err) callback(err);
        
        const fileName = `${hash.toString('hex')}-${file.originalname}`;
        callback(null, fileName);
      });
    }
  })
}
module.exports = {
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif'
    ];

    if(allowedMimes.includes(file.mimetype)){
      callback(null, true);
    }else{
      callback(new Error('Invalid file type.'));
    }
  }
}