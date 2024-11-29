const { User } = require("../models");
const { signToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");

module.exports = class UserController {
  static async login(req, res, next) {
    const { email } = req.body;
    try {
      if (!email) {
        return next({ name: "BadRequest", message: "Email is required" });
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next({
          name: "Unauthorized",
          message: "Email is required",
        });
      }
      const access_token = signToken({ id: user.id });

      res.status(200).json({
        access_token,
      });
    } catch (err) {
      console.log("🚀 ~ UserController ~ login ~ err:", err);
      next();
    }
  }

    static async findUser(req, res, next) {
      try {
        const userId = req.user.id;

        const user = await User.findOne({
          where: { id: userId }, 
        });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
      } catch (err) {
        console.error("Error in findUser:", err);
        next(err);
      }
    }

  static async googleLogin(req, res, next) {
    try {
      const { googletoken } = req.headers;
      const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({
        idToken: googletoken,
        audience: process.env.GOOGLE_CLIENT_ID, 
      });
      const payload = ticket.getPayload();
      const { email, name, picture } = payload;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        user = await User.create({ email, username: name, picture });
      }
      const access_token = signToken({ id: user.id });
      res.status(200).json({
        access_token,
      });
    } catch (err) {
      console.log("🚀 ~ UserController ~ googleLogin ~ err:", err);
      next(err);
    }
  }
};
