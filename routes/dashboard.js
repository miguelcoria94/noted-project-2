const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../config/ensureLoggedIn");

const dashboardCtrl = require("../controllers/dashboard");

router.get("/", ensureLoggedIn, dashboardCtrl.index);

module.exports = router;