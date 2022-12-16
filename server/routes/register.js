const express = require("express");
const router = express.Router();
const registeredController = require("../controllers/registerController");

router.post("/", registeredController.handleNewUser);

module.exports = router;
