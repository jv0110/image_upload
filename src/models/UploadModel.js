const db = require('../database/database');

class UploadModel{
  async get_images(){
    try{
      return await db
      .select(['id', 'name', 'size', 'url', 'filename'])
      .from('images');
    }catch(err){
      return console.log(err);
    }
  }
  async get_image_by_id(id){
    try{
      return await db
      .select('id', 'filename')
      .from('images')
      .where({ id });
    }catch(err){
      return console.log(err);
    }
  }
  async upload_image(data){
    try{
      return await db
      .insert(data)
      .into('images');
    }catch(err){
      return console.log(err);
    }
  }
  async remove_image(id){
    try{
      return await db
      .table('images')
      .where({ id })
      .del();
    }catch(err){
      return console.log(err);
    }
  }
}
module.exports = new UploadModel();