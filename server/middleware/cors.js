const crossOrigin = async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT,PATCH, DELETE, OPTIONS, HEAD"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization ,session-token,user-session-token "
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "DENY");

    if ("OPTIONS" === req.method) {
      Responder.sendResponse(StatusCode.SUCCESS, {}, res, req);
      return;
    } else {
      next();
    }
  }

  module.exports = crossOrigin