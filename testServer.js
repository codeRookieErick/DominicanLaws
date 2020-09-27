let xorEncript = (data, password) => {
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(
      data.charCodeAt(i) ^ password.charCodeAt(i % password.length)
    );
  }
  return result;
};

require("http")
  .createServer((req, res) => {
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end(req.url);
  })
  .listen(2020);
