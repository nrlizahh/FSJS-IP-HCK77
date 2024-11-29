const { Status } = require("../models");

module.exports = class StatusController {
  static async getStatus(req, res, next) {
    try {
        const status = await Status.findAll();
        res.status(200).json(status);
    } catch (err) {
      console.log("🚀 ~ StatusController ~ getStatus ~ err:", err);
      next();
    }
  }
};
