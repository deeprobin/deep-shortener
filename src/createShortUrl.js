/**
 * @param {Express} app The express app
 * @param {winston.Logger} logger The Logger
 * @param {lowdb.FileSync} db LowDB
 * @param {string} urlExpression The regex expression for urls
 */
module.exports = function(app, logger, db, urlExpression) {
  app.get("/new/:url", function(req, res) {
    var url = Buffer.from(req.params.url, "base64").toString("utf-8");

    // Check if url has a protocol like http, https or ftp
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      url = "http://" + url;
    }

    if (new RegExp(urlExpression).test(url + "/")) {
      urlExists(function(key) {
        if(!key){
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
          logger.log('info', req.ip + " wanted to create a short url(" + url + ") but it already exists: " + key);
          res.setHeader('DeepShortener-Data','key already exist')
          res.send(key);
        }
      }, db, url)
      
    } else {
      logger.log(
        "warn",
        req.ip +
          " tried to use not valid url(presumably clientside code change(inspector) or /new/ link call)"
      );
      res.send("!!!error!!!");
    }
  });
};

/**
 * Generate random id for short url
 *
 * @returns {string} id
 */
function generateRandomId() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

/**
 * This function checks whether the url exists in the database
 *
 * @callback requestCallback
 * @param {requestCallback} callback
 * @param {lowdb.FileSync} db
 * @param {string} url
 * @returns {*} nothing
 */
function urlExists(callback, db, url) {
  for(key of Object.keys(db.getState())) {
    if(url === db.getState()[key]) {
      callback(key);
      return;
    }
  }
  callback(false);
}