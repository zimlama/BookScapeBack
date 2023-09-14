const express = require("express");
const router = express.Router();
const userCreated = require("../controllers/mail");

router.put("/signup", userCreated);
module.exports = router;
