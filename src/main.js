const fs = require('fs');
const path = require('path');

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("data/db.json");
const db = low(adapter);

db.defaults({ urls: {} }).write();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "../views/"));
app.set("view engine", "pug");
app.get("/", function(req, res) {
  res.render("index");
});

app.use("/", express.static(path.join(__dirname, "../public")));

// chrome automatic undefined call cancle - for clear clientside console
app.all("/undefined", function(req, res) {
  res.writeHead(200);
  res.send();
});

app.get("/legal", function(req, res) {
  res.render("legal/legal-disclosure");
});

app.get("/terms", function(req, res) {
  res.render("legal/terms");
});

app.get("/privacy-policy", function(req, res) {
  res.render("legal/privacy-policy");
});

app.all("/favicon.ico", function(req, res) {
  res.set({
    "Content-Type": "image/x-icon"
  });
  fs.readFile(path.join(__dirname, "../public/img/favicon.ico"), function(
    err,
    data
  ) {
    res.send(data);
  });
});

const urlExpression = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

app.get("/new/:url", function(req, res) {
  var url = Buffer.from(req.params.url, "base64").toString("utf-8");

  if (new RegExp(urlExpression).test(url + "/")) {
    try {
      var id = "id";
      var has = false;
      while (!has) {
        id = generateRandomId();
        has = db.has(id);
      }

      db.set(id, url).write();
      res.send(id);
      console.log(req.ip + " created short url(" + id + ") with url " + url);
    } catch (ex) {
      res.send("!!!error!!!");
      console.error("Errored: " + ex);
    }
  } else {
    console.log(
      req.ip +
        " tried to use not valid url(presumably clientside code change(inspector) or /new/ link call)"
    );
    res.send("!!!error!!!");
  }
});

app.get("/:id", function(req, res) {
  console.log(req.ip + " tries to load site with key: " + req.params.id);
  let url = db.get(req.params.id);
  if (url) res.redirect(url);
  else res.status(404);
});

app.listen(port, () =>
  console.log(`URL shortener app listening on port ${port}!`)
);

function generateRandomId() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
