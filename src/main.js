const urlExpression = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

const path = require("path");

const low = require("lowdb");
const winston = require("winston");
require("winston-daily-rotate-file");

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, "../", "data", "logs", "log-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.printf(msg => 
          (msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`)
        )),
      colorize: false
    }),
    new winston.transports.Console({
      format: winston.format.cli(),
      colorize: true
    })
  ]
});

const database_file = process.env.DB_PATH || path.join(__dirname, '../', 'data', 'db.json')
const port = process.env.PORT || 3000;
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync(database_file);
const db = low(adapter);

db.defaults({}).write();

const express = require("express");
const i18n = require("i18n");
const app = express();

i18n.configure({
  locales: ["en", "de"],
  directory: path.join(__dirname, "../", "public", "i18n"),
  defaultLocale: "en"
});

if (process.env.TRUST_PROXY == "true") app.enable("trust proxy");

app.use(i18n.init);
app.set("views", path.join(__dirname, "../views/"));
app.set("view engine", "pug");
app.disable("x-powered-by");

const defaultHeaders = require('./defaultHeaders.js')
defaultHeaders(app)

app.get("/", function(req, res) {
  res.render("index");
  logger.log('info', req.ip + ' loaded main page.')
});

app.use("/", express.static(path.join(__dirname, "../public")));

const legalPages = require('./legalPages.js')
legalPages(app, logger);

app.all("/favicon.ico", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/img/favicon.ico"))
});


const createShortUrl = require('./createShortUrl.js')
createShortUrl(app, logger, db, urlExpression)

const visitShortUrl = require('./visitShortUrl.js')
visitShortUrl(app, logger, db, urlExpression)

app.listen(port, () =>
  logger.log("info", `URL shortener app listening on port ${port}!`)
);
