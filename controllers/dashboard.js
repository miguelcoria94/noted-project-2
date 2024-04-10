const User = require("../models/user");
const Note = require("../models/note");

async function index(req, res) {
  const userNotes = await Note.find({ user: req.user._id });
  res.render("dashboard/index", {
    title: "Dashboard",
    user: req.user,
    userNotes,
  });
}

module.exports = {
  index,
};
