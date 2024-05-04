const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/listBlocked.controller");
router.get("/", controller.listBlocked);

module.exports = router;