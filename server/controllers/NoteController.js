const { Note } = require("../models");
const axios = require('axios')

module.exports = class NoteController {
  static async getNote(req, res, next) {
    try {
      const userId = req.user.id;
      const note = await Note.findAll({ where: { userId } });
      res.status(200).json(note);
    } catch (err) {
      console.log("🚀 ~ NoteController ~ getNote ~ err:", err);
      next(err);
    }
  }

  static async findNoteById(req, res, next) {
    try {
      const { id } = req.params;
      const note = await Note.findByPk(id);

      if (!note) {
        return next({
          name: "NotFound",
          message: "Note not found",
        });
      }

      res.status(200).json(note);
    } catch (err) {
      console.log("🚀 ~ NoteController ~ findNoteById ~ err:", err);
      next(err);
    }
  }

  static async createNote(req, res, next) {
    try {
      let data = {
        ...req.body
      }
      data.userId = req.user.id;

      const lastNote = await Note.findOne({
        where: { 
          userId: req.user.id,
          // statusId: req.body.statusId,
        },
        order: [['order', 'DESC']],
      });
  
      data.order = lastNote ? lastNote.order + 1 : 1;

      const note = await Note.create(data);
      
      res
        .status(201)
        .json({ data: note, message: `Note ${data.task} created` });
    } catch (err) {
      console.log("🚀 ~ NoteController ~ createNote ~ err:", err);
      next(err);
    }
  }

  static async updateNote(req, res, next) {
    try {
      req.body.userId = req.user.id;
      const { id } = req.params;
      const note = await Note.findByPk(id);
      if (!note) {
        return next({
          name: "NotFound",
          message: "Note not found",
        });
      }
      await note.update(req.body, {
        individualHooks: true,
      });

      res.status(200).json({ data: note, message: `Note ${note.task} update` });
    } catch (err) {
      console.log("🚀 ~ NoteController ~ updateNote ~ err:", err);
      next(err);
    }
  }

  static async deleteNote(req, res, next) {
    try {
      const { id } = req.params;
      const note = await Note.findByPk(id);

      if (!note) {
        return next({
          name: "NotFound",
          message: `Note id:${id} not found`,
        });
      }

      await note.destroy();
      res.status(200).json({ message: `Note ${note.task} success to delete` });
    } catch (err) {
      console.log("🚀 ~ NoteController ~ deleteNote ~ err:", err);
      next(err);
    }
  }

static async geminiSuggestion(req, res, next){
  try {
    const response = await axios.post(
      "https://api.gemini.ai/suggest",
      req.body,
      {
        headers: {
          "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data && response.data.suggestion) {
      res.json({ suggestion: response.data.suggestion });
    } else {
      res.status(500).json({ error: "Failed to generate description." });
    }
  } catch (err) {
    console.log("🚀 ~ NoteController ~ geminiSuggestion ~ err:", err)
    next(err)
  }
}

};
