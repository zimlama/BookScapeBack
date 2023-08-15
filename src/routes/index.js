var express = require('express');

const books = require('./books')
const users = require('./users')

var router = express.Router();

router.use('/books', books);
router.use('/users', users);

module.exports = router;
