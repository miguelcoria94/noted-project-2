const User = require("../models/user");
const Note = require("../models/note");

async function index(req, res) {
//   find all the noted shared with the current user, note had usersWithAccess array 
  const sharedNotes = await Note.find({ usersWithAccess: req.user._id });
  res.render("shared/index", {
    title: "Shared Notes",
    user: req.user,
    userNotes: sharedNotes,
  });
}

module.exports = {
  index,
};
