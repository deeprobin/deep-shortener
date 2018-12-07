const urlExpression = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

/** 
 * @param {Express} app The express app
 * @param {winston.Logger} logger The Logger
 * @param {lowdb.FileSync} db LowDB
 */
module.exports = function(app, logger, db) {
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
}

function generateRandomId() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }