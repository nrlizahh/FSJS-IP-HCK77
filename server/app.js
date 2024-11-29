const cors = require("cors");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// const port = process.env.PORT || 3000;

const express = require("express");
const NoteController = require("./controllers/NoteController");
const StatusController = require("./controllers/StatusController");
const { errorHandler } = require("./middleware/errorHandler");
const UserController = require("./controllers/UserController");
const authentication = require("./middleware/authentication");
const guardUser = require("./middleware/guardUser");
const crossOrigin = require("./middleware/cors");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(crossOrigin);

//User
app.post("/login", UserController.login);
app.post("/google-login", UserController.googleLogin)

app.post("/gemini-suggestion", NoteController.geminiSuggestion)
app.use(authentication);
//user
app.get("/user", UserController.findUser)
//Notes
app.get("/notes", NoteController.getNote);
app.post("/notes", NoteController.createNote);
app.get("/notes/:id", NoteController.findNoteById);
app.put("/notes/:id", guardUser, NoteController.updateNote);
app.delete("/notes/:id", guardUser, NoteController.deleteNote);

//Status
app.get("/statuses", StatusController.getStatus);

app.use(errorHandler);

// app.listen(port, () => {
//     console.log(`i like ur ${port} dollars`);
//   });
module.exports = app;
