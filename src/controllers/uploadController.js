'use strict';
const UploadModel = require('../models/UploadModel');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');

class UploadController{
  async get_images(req, res){
    try{
      const images = await UploadModel.get_images();
      if(!images.length)
        return res.status(404).json({
          msg: 'No posts found'
        });
      return res.status(200).json({
        images
      });
    }catch(err){
      return console.log(err);
    }
  }
  async upload(req, res){
    const data = {
      name: req.file.originalname,
      size: req.file.size,
      filename: req.file.key,
      // if req.file.location does not exists, it means we are uploading on disk. So we pass the path for the image
      // in the static dir
      url: req.file.location ? req.file.location : `http://localhost:${process.env.SERVER_PORT}/files/${req.file.key}`,
      createdAt: new Date()
    }

    try{
      const upload_image = await UploadModel.upload_image(data);
      if(!upload_image.length) return res.status(500).json({
        msg: 'Error uploading the image'
      });
      return res.status(200).json(upload_image);
    }catch(err){
      return console.log(err);
    }
  }
  async remove_image(req, res){
    const { id } = req.body;
    try{
      const image = await UploadModel.get_image_by_id(id);
      if(!image.length) return res.status(404).json({
        msg: 'Image not found'
      });
      if(process.env.STORAGE_TYPE === 's3'){
        const s3 = new aws.S3();
        s3.deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: image[0].filename
        }, (err, success) => {
          if(err)
            return res.status(500).json({
              msg: 'Error deleting image from the server'
            });
        });
      }else{
        try{
          // delete image from the folder
          fs.unlinkSync(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', image[0].filename));
        }catch(err){
          return res.status(500).json({
            msg: 'Error deleting image from local server'
          });
        }
      }
      const del = await UploadModel.remove_image(id);
      if(del.length) return res.status(500).json({
        msg: 'Error removing the image'
      });
      return res.status(200).json({
        msg: 'Image removed'
      });
    }catch(err){
      return console.log(err);
    }
  }
}

module.exports = new UploadController();