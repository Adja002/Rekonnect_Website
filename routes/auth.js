const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const UserController = require("../controllers/userController");

router.get("/login", UserController.login);
router.post("/login", UserController.login);

router.get("/signup", UserController.signupPage);
router.post("/signup", upload.none(), UserController.signup);

router.get("/logout", UserController.logout);

module.exports = router;