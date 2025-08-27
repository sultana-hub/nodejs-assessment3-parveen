const multer=require('multer')
const path=require('path')
const fs=require('fs')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/users')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      }
  })
  
  const UserImageUpload = multer({ storage: storage })

  module.exports=UserImageUpload