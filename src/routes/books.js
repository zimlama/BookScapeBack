const express = require('express');
const router = express.Router();
const allBooks = require('../controllers/allBooks');
const allTags = require('../controllers/allTags');
const filterBooks = require('../controllers/filterBooks')
const findById = require('../controllers/findById');
const allLanguage = require('../controllers/allLanguage');
//const getAllRatingBook = require('../controllers/ratingBook');


/* GET books listing. */
 
router.get("/", allBooks)
router.get("/language", allLanguage)
router.get("/book/:id", findById)
router.get("/filter", filterBooks)
router.get("/tags", allTags)
//router.get("/ratings",getAllRatingBook)

module.exports = router;