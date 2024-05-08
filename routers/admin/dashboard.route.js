const express = require('express');
const router = express.Router();
const multer  = require('multer');
// const cloudinary = require('cloudinary').v2
// const streamifier = require('streamifier')
const storageMulter = require('../../helpers/storageMulter')
const upload = multer({storage: storageMulter()});
const controller = require("../../controllers/admin/dashboard.controller");
const validate = require("../../validates/admin/dashboard.validate");
router.get("/", controller.index);

// cloudinary.config({ 
//     cloud_name: 'dyf35hrll', 
//     api_key: '396798783326224', 
//     api_secret: '***************************' 
//   });
router.get("/create", controller.create);

//upload file tĩnh
router.post("/create", 
    upload.single('avatar'), 
    // function (req, res, next) {
    //     let streamUpload = (req) => {
    //         return new Promise((resolve, reject) => {
    //             let stream = cloudinary.uploader.upload_stream(
    //               (error, result) => {
    //                 if (result) {
    //                   resolve(result);
    //                 } else {
    //                   reject(error);
    //                 }
    //               }
    //             );
    
    //           streamifier.createReadStream(req.file.buffer).pipe(stream);
    //         });
    //     };
    
    //     async function upload(req) {
    //         let result = await streamUpload(req);
    //         console.log(result);
    //     }
    
    //     upload(req);
    // },
    validate.createPost,
    controller.createPost);

router.get("/update/:id", controller.update);  

router.patch("/update/:id", 
    upload.single('avatar'), 
    validate.createPost,
    controller.updatePatch);

router.patch("/changeBlocked/:blocked/:id", controller.changeBlocked);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteAcc);

module.exports = router;