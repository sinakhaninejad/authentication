const express = require("express");
const {
  register,
  login,
  refreshthetoken,
  logOut,
} = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.post("/refreshthetoken", refreshthetoken);
router.post("/login", login);
router.delete("/logout", logOut);

module.exports = router;
