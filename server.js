const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;

const dbConfig = require("./config/db.config");
db.mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((client) => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "worker",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'worker' to roles collection");
      });

      new Role({
        name: "helper",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'helper' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./routes/auth.routes")(app);
require("./routes/inhabitant.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
