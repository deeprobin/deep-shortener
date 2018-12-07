const fs = require("fs");
const path = require("path");

const winston = require("winston");
require("winston-daily-rotate-file");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.cli(),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, "../", "data", "logs", "log-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d"
    })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("data/db.json");
const db = low(adapter);

db.defaults({}).write();

const express = require("express");
const i18n = require("i18n");
const app = express();
const port = process.env.PORT || 3000;


i18n.configure({
  locales: ['en', 'de'],
  directory: path.join(__dirname, '../', 'public', 'i18n'),
  defaultLocale: 'en'
});

if (process.env.TRUST_PROXY == "true") app.enable("trust proxy");

app.use(i18n.init);
app.set("views", path.join(__dirname, "../views/"));
app.set("view engine", "pug");
app.disable('x-powered-by');

app.get("/", function(req, res) {
  res.setHeader("Content-Security-Policy","default-src 'self' cdnjs.cloudflare.com fonts.googleapis.com; style-src 'unsafe-inline' 'self' cdnjs.cloudflare.com fonts.googleapis.com; frame-src 'none'; object-src 'none'; font-src fonts.googleapis.com fonts.gstatic.com")
  res.setHeader("Strict-Transport-Security","max-age=63072000")
  res.setHeader("X-Content-Type-Options","nosniff")
  res.setHeader("X-Frame-Options","DENY")
  res.setHeader("X-XSS-Protection","1; mode=block")
  res.setHeader("Referrer-Policy", "strict-origin")
  res.setHeader("Feature-Policy","geolocation 'none'; microphone 'none'; ")
  res.render("index");
});

app.use("/", express.static(path.join(__dirname, "../public")));

app.get("/legal", function(req, res) {
  if(req.acceptsLanguages("de")) {
    res.render("legal/de/legal-disclosure");
  } else
  res.render("legal/en/legal-disclosure");
});

app.get("/terms", function(req, res) {
  if(req.acceptsLanguages("de")) {
    res.render("legal/de/terms");
  } else
  res.render("legal/en/terms");
});

app.get("/privacy-policy", function(req, res) {
  if(req.acceptsLanguages("de")) {
    res.render("legal/de/privacy-policy");
  } else
  res.render("legal/en/privacy-policy");
});

app.get("/legal-en", function(req, res) {
  res.render("legal/en/legal-disclosure");
});

app.get("/terms-en", function(req, res) {
  res.render("legal/en/terms");
});

app.get("/privacy-policy-en", function(req, res) {
  res.render("legal/en/privacy-policy");
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
      logger.log(
        "info",
        req.ip + " created short url(" + id + ") with url " + url
      );
    } catch (ex) {
      res.send("!!!error!!!");
      logger.log(
        "error",
        "Cannot create short url(" + id + ") Exception: " + ex
      );
    }
  } else {
    logger.log(
      "warn",
      req.ip +
        " tried to use not valid url(presumably clientside code change(inspector) or /new/ link call)"
    );
    res.send("!!!error!!!");
  }
});

app.get("/:id", function(req, res) {
  let url = db.get(req.params.id);

  if (new RegExp(urlExpression).test(url + "/")) {
    logger.log(
      "info",
      req.ip +
        " tries to load site with key: " +
        req.params.id +
        " (" +
        url +
        ")"
    );
    res.redirect(url);
  } else {
    logger.log(
      "info",
      req.ip + " tries to load 404 page(/" + req.params.id + "/)."
    );
    res.status(404);

    if (req.accepts("html")) {
      res.render("404", { url: req.url });
      return;
    }

    if (req.accepts("json")) {
      res.send({ error: "Not found" });
      return;
    }

    res.type("txt").send("Not found");
  }
});

app.listen(port, () =>
  logger.log("info", `URL shortener app listening on port ${port}!`)
);

function generateRandomId() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
