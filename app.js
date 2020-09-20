var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

let titlesApiRouter = require("./routes/api/titles");
let chaptersApiRouter = require("./routes/api/chapters");
let sectionsApiRouter = require("./routes/api/sections");

let indexRouter = require("./routes/views/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/titles", titlesApiRouter);
app.use("/api/chapters", chaptersApiRouter);
app.use("/api/sections", sectionsApiRouter);

app.use("/", indexRouter);
app.use("/index", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res) {
  res.writeHead(404, { "Content-type": "text/plain" });
  res.end("Not found");
});

module.exports = app;
