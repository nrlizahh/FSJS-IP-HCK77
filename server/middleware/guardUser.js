const { Note } = require("../models");
async function guardUser(req, res, next) {
  try {
    const noteId = Number(req.params.id);

    const userId = req.user.id;
    const note = await Note.findByPk(noteId);

    if (!note) {
      res.status(404).json({ message: "Note Not Found" });
      return;
    }

    if (note.userId !== userId) {
      res.status(403).json({ message: "Forbidden Access" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = guardUser;
