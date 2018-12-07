/** 
 * @param {Express} app The express app
 * @param {winston.Logger} logger The Logger
 * @param {lowdb.FileSync} db LowDB
 */
module.exports = function(app, logger, db) {
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
}