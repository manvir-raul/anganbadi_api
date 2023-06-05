const {
  checkDuplicateUsernameOrEmail,
  verifyToken,
} = require("../middlewares");
const controller = require("../controllers/auth.controller");

const auth = (app) => {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    checkDuplicateUsernameOrEmail,
    controller.signup
  );

  app.get("/api/auth/authenticate", verifyToken, controller.authenticate);

  app.post("/api/auth/signin", controller.signin);
};

module.exports = auth;
