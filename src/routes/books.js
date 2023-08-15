const express = require('express');
//const getAllBooks = express.Router();
const router = express.Router();
const allBooks = require('../controllers/allBooks');
const allTags = require('../controllers/allTags');

const findById = require('../controllers/findById');
const allLanguage = require('../controllers/allLanguage');



/* GET books listing. */
 
router.get("/", allBooks)
router.get("/language", allLanguage)
router.get("/books/:id", findById)
router.get("/tags", allTags)
//router.get("/:id", findById)
module.exports = router;