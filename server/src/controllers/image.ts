import fs from 'fs'
import path from 'path';

export default {
  uploadImage: async (req, res) => {
    try{
      return res.status(200).json({success:true, downloadUrl:`http://localhost:5000/images/${req.file.filename}`});
    }catch(error){
      return res.status(500).json({success:false, error:error});
    }
  },
  getImageByFilename:async (req,res)=>{
    try{
      const filename = req.params.filename;
      return res.status(200).sendFile(path.resolve(__dirname, `../../images/${filename}`))
    }catch(error){
      return res.status(500).json({success:true, error:error});
    }
  }
}