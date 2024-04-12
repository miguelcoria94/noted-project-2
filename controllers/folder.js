const Folder = require("../models/folder");
const Note = require("../models/note");

async function index(req, res) {
  const folders = await Folder.find({ user: req.user._id });
  res.render("folders/index", {
    title: "Folders",
    user: req.user,
    folders,
    deleted: false,
    newFolder: false,
    editFolder: false,
  });
}

async function createForm(req, res) {
  const notes = await Note.find({ user: req.user._id });
  res.render("folders/create", {
    title: "Create Folder",
    user: req.user,
    notes,
  });
}

async function create(req, res) {
  const folder = new Folder(req.body);
  folder.user = req.user._id;
  folder.notes = req.body.notes;
  await folder.save();

  const folders = await Folder.find({ user: req.user._id });
  res.render("folders/index", {
    title: "Folders",
    user: req.user,
    folders,
    deleted: false,
    newFolder: true,
    editFolder: false,
  });
}

// edit form

async function editForm(req, res) {
  const folder = await Folder.findById(req.params.id);
  const notes = await Note.find({ user: req.user._id });
  res.render("folders/edit", {
    title: "Edit Folder",
    user: req.user,
    folder,
    notes,
  });
}

// edit

async function edit(req, res) {
  const folder = await Folder.findById(req.params.id);
  folder.name = req.body.name;
  folder.notes = req.body.notes;
  await folder.save();

  const folders = await Folder.find({ user: req.user._id });
  res.render("folders/index", {
    title: "Folders",
    user: req.user,
    folders,
    deleted: false,
    newFolder: false,
    editFolder: true,
  });
}


async function show(req, res) {
  const folder = await Folder.findById(req.params.id);
  // find all notes that belong folder, foder had a notes array with all notes id
  const notes = await Note.find({ _id: { $in: folder.notes } });
  res.render("folders/show", {
    title: folder.name,
    user: req.user,
    folder,
    userNotes: notes,
  });
}

async function deleteFolder(req, res) {
  await Folder.findByIdAndDelete(req.params.id);

  const folders = await Folder.find({ user: req.user._id });
  res.render("folders/index", {
    title: "Folders",
    user: req.user,
    folders,
    deleted: true,
    newFolder: false,
    editFolder: false,
  });
}

module.exports = {
  index,
  createForm,
  create,
  show,
  delete: deleteFolder,
  editForm,
  edit,
};
