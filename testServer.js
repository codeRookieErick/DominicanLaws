require("http")
  .createServer((req, res) => {
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end(req.url);
  })
  .listen(2020);
