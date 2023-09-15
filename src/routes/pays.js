const express = require("express");
const router = express.Router();

const setPay = require("../controllers/setPay")
const getAllPays = require("../controllers/getAllPays")
const getPaysByUser = require("../controllers/getPaysByUser")

router.post("/set",setPay)
router.get("/:id",getPaysByUser)
router.get("/",getAllPays)



module.exports=router