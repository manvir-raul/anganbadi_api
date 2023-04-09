const controller = require("../controllers/inhabitant.controller");

const inhabitant = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/inhabitant/detail/:inhabitantID", controller.inhabitantDetails);
  app.post("/api/inhabitant/list", controller.inhabitantList);

  app.post("/api/inhabitant/add", controller.addInhabitant);
};

module.exports = inhabitant;
