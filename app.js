var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

let constitutionRouter = require("./routes/api/constitution");

let indexRouter = require("./routes/views/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/constitution", constitutionRouter);

app.use("/", indexRouter);
app.use("/index", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res) {
  res.writeHead(404, { "Content-type": "text/plain" });
  res.end("Not found");
});

module.exports = app;
