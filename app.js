const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const hostWebsite = false;
const hostApi = true;

var app = express();

// view engine, cookies, static files, body-parser
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded());

if (hostWebsite) {
  app.use("/constitution", require("./routes/views/constitution"));
  app.use("/title", require("./routes/views/title"));
}

if (hostApi) {
  app.use("/api/users", require("./routes/api/users"));
  app.use("/api/constitution", require("./routes/api/constitution"));
}

// catch 404 and forward to error handler
app.use(function (req, res) {
  res.json("Not found");
});

module.exports = app;
