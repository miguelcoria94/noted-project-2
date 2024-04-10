const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// I want the note to have a user id that references the user who created the note.

const noteSchema = new Schema(
  {
    title: String,
    body: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    aiSummary: String,

  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Note", noteSchema);