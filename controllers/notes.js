const { set } = require("mongoose");
const Note = require("../models/note");
const User = require("../models/user");

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.GEMINI_API_KEY;

async function run(prompt, title) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const parts = [
    {
      text: "We aim to enhance our application's note-taking feature by incorporating AI-driven summarizations and expansions that provide additional context and insights to our users' entries. The desired tone should be informal yet respectful, ensuring the content remains accessible to a wide audience. Specifically, the model should prioritize clarity and conciseness, stripping away any unnecessary jargon or complex vocabulary that might obscure the intended message.For style, we prefer a friendly and engaging approach that encourages users to continue interacting with our platform. Summaries should not only condense information but also highlight key points in a manner that's easy to digest. When adding information, the model should source from credible, up-to-date contexts to enrich the user's original note without overwhelming them with excessive detail.In terms of response formatting, we request that the model's output be in clean, well-structured HTML, enabling seamless integration into our web interface. This HTML should include basic formatting—such as headings, paragraphs, and lists—to aid readability and visual appeal.Our objective with these enhancements is to create a more valuable and interactive note-taking experience that aids memory retention and understanding, making our app an indispensable tool for our users' daily lives and learning processes. Your response must be in an HTML string without (```html) just the HTML. remember you are only summarizing the user input. You can add some note suggestions if you want in HTML.  only include valid HTML. exclude the head and body. Do not add anything about what we are doing with the output.",
    },
    { text: `input: ${title} - ${prompt}` },
    { text: "output: " },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  return response.text();
}

function newNoteForm(req, res) {
  res.render("notes/new", { title: "New Note" });
}

async function show(req, res) {
  const note = await Note.findById(req.params.id);
  res.render("notes/_id", {
    title: "Note",
    note,
    newNote: false,
    editNote: false,
    shared: false,
    failed: false,
  });
}

async function update(req, res) {
  let summary = await run(req.body.rawEditorData, req.body.title);
  const note = await Note.findById(req.params.id);
  note.aiSummary = summary;
  note.title = req.body.title;
  note.body = req.body.body;
  note.rawEditorData = req.body.rawEditorData;

  await note.save();
  setTimeout(async () => {
    res.render("notes/_id", {
      title: "Note",
      note,
      editNote: true,
      newNote: false,
      shared: false,
      failed: false,
    });
  }, 50);
}

async function create(req, res) {
  let summary = await run(req.body.rawEditorData);
  const note = new Note({
    title: req.body.title,
    body: req.body.body,
    user: req.user._id,
    rawEditorData: req.body.rawEditorData,
    aiSummary: summary,
  });

  await note.save();

  setTimeout(async () => {
    res.render("notes/_id", {
      title: "Note",
      note,
      newNote: true,
      editNote: false,
      shared: false,
      failed: false,
    });
  }, 50);
}

async function edit(req, res) {
  const note = await Note.findById(req.params.id);
  res.render("notes/edit", { title: "Edit Note", note });
}

async function editForm(req, res) {
  const note = await Note.findById(req.params.id);
  res.render("notes/edit", { title: "Edit Note", note });
}
async function deleteNoteForm(req, res) {
  console.log(req.params.id);
  const note = await Note.findByIdAndDelete(req.params.id);
  setTimeout(async () => {
    const userNotes = await Note.find({ user: req.user._id });
    res.render("dashboard/index", {
      title: "Dashboard",
      user: req.user,
      userNotes,
      deleteNote: true,
      note,
      newNote: false,
    });
  }, 50);
}

async function share(req, res) {
  const note = await Note.findById(req.params.id);
  const user = await User.findOne({ email:
    req.body.email
  });

  if (user){

    note.usersWithAccess.push(user._id);
  }

  await note.save();

  if (!user) {
    res.render("notes/_id", {
      title: "Note",
      note,
      shared: false,
      newNote: false,
      editNote: false,
      failed: true,
    });
    return;
  }

  res.render("notes/_id", {
    title: "Note",
    note,
    shared: true,
    newNote: false,
    editNote: false,
    failed: false,

  });
}

module.exports = {
  new: newNoteForm,
  delete: deleteNoteForm,
  create,
  show,
  edit,
  update,
  editForm,
  share,
};
