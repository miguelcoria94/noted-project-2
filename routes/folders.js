const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../config/ensureLoggedIn");

const folderCtrl = require("../controllers/folder");

router.get("/", ensureLoggedIn, folderCtrl.index);
router.get("/new", ensureLoggedIn, folderCtrl.createForm);
router.post("/", ensureLoggedIn, folderCtrl.create);
router.get("/:id", ensureLoggedIn, folderCtrl.show);
router.delete("/:id", ensureLoggedIn, folderCtrl.delete);
router.get("/:id/edit", ensureLoggedIn, folderCtrl.editForm);
router.put("/:id", ensureLoggedIn, folderCtrl.edit);



module.exports = router;
