const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require("../../controllers/admin/login.controller");
router.get("/", controller.index);
router.post("/", controller.login);
router.post("/register", controller.registerPost);

module.exports = router;