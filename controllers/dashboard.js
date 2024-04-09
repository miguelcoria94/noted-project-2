const User = require("../models/user");

async function index(req, res) {
  const users = await User.find({});
  res.render("dashboard/index", {
    title: "Dashboard",
    users,
    user: req.user,
  });
}

module.exports = {
  index,
};
