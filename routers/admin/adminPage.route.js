const express = require('express');
const router = express.Router();
const multer  = require('multer');
const storageMulter = require('../../helpers/storageMulter')
const upload = multer({storage: storageMulter()});
const controller = require("../../controllers/admin/adminPage.controller");
const validate = require("../../validates/admin/dashboard.validate");

router.get("/", controller.index);
router.patch("/:id", upload.single('avatar'), 
    validate.createPost,
    controller.adminPatch)
module.exports = router;