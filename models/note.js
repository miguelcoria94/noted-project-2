const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blockSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    data: {
      text: String,
      level: Number,
      style: String,
      items: [String],
    },
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  aiSummary: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rawEditorData: {
    type: String, 
  },
  usersWithAccess: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});

module.exports = mongoose.model("Note", noteSchema);
