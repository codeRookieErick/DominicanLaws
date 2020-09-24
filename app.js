var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

let constitutionRouterApi = require("./routes/api/constitution");
let indexRouter = require("./routes/views/index");
let constitutionRouter = require("./routes/views/constitution");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/constitution", constitutionRouterApi);

app.use("/", indexRouter);
app.use("/index", indexRouter);
app.use("/constitution", constitutionRouter);
app.use("/title", require("./routes/views/title"));
// catch 404 and forward to error handler
app.use(function (req, res) {
  res.writeHead(404, { "Content-type": "text/plain" });
  res.end("Not found");
});

module.exports = app;
