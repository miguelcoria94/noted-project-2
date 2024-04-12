const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../config/ensureLoggedIn");

const sharedCtrl = require("../controllers/share");

router.get("/", ensureLoggedIn, sharedCtrl.index);

module.exports = router;
