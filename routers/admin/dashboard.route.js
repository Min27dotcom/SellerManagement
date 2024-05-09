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

// 
router.get("/create", controller.create);

//upload file tĩnh
router.post("/create", 
    upload.single('avatar'),
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