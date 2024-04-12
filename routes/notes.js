const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../config/ensureLoggedIn");

const notesCtrl = require("../controllers/notes");

router.post("/", ensureLoggedIn, notesCtrl.create);
router.get("/new", ensureLoggedIn, notesCtrl.new);
router.get("/:id", ensureLoggedIn, notesCtrl.show);
router.get("/:id/edit", ensureLoggedIn, notesCtrl.editForm);
router.put("/:id/update", ensureLoggedIn, notesCtrl.update);
router.delete("/:id", ensureLoggedIn, notesCtrl.delete);

module.exports = router;
