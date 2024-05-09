const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/login.controller");
router.get("/", controller.index);
router.get("/register", controller.register);
router.post("/register", controller.registerPost);

module.exports = router;