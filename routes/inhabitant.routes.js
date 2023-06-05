const controller = require("../controllers/inhabitant.controller");
const { verifyToken } = require("../middlewares");

const inhabitant = (app) => {
  // app.use(function (req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  //   res.header("Access-Control-Allow-Credentials", true);
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept"
  //   );
  //   next();
  // });
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

  app.post("/api/inhabitant/list", verifyToken, controller.inhabitantList);

  app.post("/api/inhabitant/add", verifyToken, controller.addInhabitant);
  app.get("/api/inhabitant/lookup", verifyToken, controller.lookUpInhabitant);

  app.get(
    "/api/inhabitant/detail/:inhabitantID",
    verifyToken,
    controller.inhabitantDetails
  );
  app.put(
    "/api/inhabitant/update/:inhabitantID",
    verifyToken,
    controller.updateInhabitant
  );
};

module.exports = inhabitant;
