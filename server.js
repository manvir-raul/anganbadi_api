const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();
const cors = require("cors");

const app = express();

const corsOptions = {
  //To allow requests from client
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

const store = new MongoDBStore(
  {
    uri: process.env.MONGO_DB_URL,
    collection: "mySessions",
  },
  function (error) {
    console.log("error1", error);
  }
);

store.on("error", function (error) {
  console.log("error2", error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cors(corsOptions));
app.options("*", cors());

// parse requests of content-type - application/json
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cookieParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;
const PORT = process.env.PORT || 8080;

const dbConfig = require("./config/db.config");
db.mongoose.set("strictQuery", true);
db.mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((client) => {
    console.log("Successfully connect to MongoDB.");
    initial();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
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

require("./routes/auth.routes")(app);
require("./routes/inhabitant.routes")(app);

// set port, listen for requests
