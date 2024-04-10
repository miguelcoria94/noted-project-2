const User = require("../models/user");

async function index(req, res) {
  let count = 0

  count++
  res.render("dashboard/index", {

    title: "Dashboard",
    user: req.user,
    count : count
  });
}

module.exports = {
  index,
};
