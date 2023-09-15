const express = require("express");

const books = require("./books");
const users = require("./users");
const favorite = require("./favorite");
const review = require("./review");
const shoppingcart = require("./r.shoppingcart");
const mail = require("./mail");
const pays = require("./pays");

const router = express.Router();

router.use("/books", books);
router.use("/users", users);
router.use("/favorites", favorite);
router.use("/reviews", review);
router.use("/shoppingcart", shoppingcart);
router.use("/mail", mail);
router.use("/pays",pays)

module.exports = router;
