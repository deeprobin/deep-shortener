/** 
 * @param {Express} app The app
 * @param {winston.Logger} logger The Logger
 * @type {Express} app The app
 * @type {winston.Logger} logger The Logger 
*/
module.exports = function(app, logger){
    app.get("/legal", function(req, res) {
        if (req.acceptsLanguages("de")) {
          res.render("legal/de/legal-disclosure");
        } else res.render("legal/en/legal-disclosure");
      });
      
      app.get("/terms", function(req, res) {
        if (req.acceptsLanguages("de")) {
          res.render("legal/de/terms");
        } else res.render("legal/en/terms");
      });
      
      app.get("/privacy-policy", function(req, res) {
        if (req.acceptsLanguages("de")) {
          res.render("legal/de/privacy-policy");
        } else res.render("legal/en/privacy-policy");
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
}