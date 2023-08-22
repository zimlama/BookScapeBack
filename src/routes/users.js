const express = require("express");
const {
  registerUser,
  loginUser,
  searchUserById,
  getUsers,
  toggleUserActiveStatus,
} = require("../controllers/users");
const router = express.Router();

/* GET users listing. */
router.get("/", getUsers);
router.get("/:id", searchUserById);
router.put("/:id", toggleUserActiveStatus);
router.post("/", registerUser);
router.post("/login", loginUser);

module.exports = router;
