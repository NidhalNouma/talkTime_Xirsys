const http = require("http");
const app = require("./app");
const config = require("config");
const httpport = process.env.PORT || config.get("host").httpport || 3080;

// app.get("/*", function (req, res) {
//   res.redirect("/");
// });

http.createServer(app).listen(httpport, function (err) {
  if (err) {
    throw err;
  }
  console.log("Insecure server is listening on port " + httpport + "...");
});
