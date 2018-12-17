
const headers = {
  "Content-Security-Policy":
    "default-src 'self' 'unsafe-inline' cdnjs.cloudflare.com fonts.googleapis.com; style-src 'unsafe-inline' 'self' cdnjs.cloudflare.com fonts.googleapis.com; frame-src 'none'; object-src 'none'; font-src fonts.googleapis.com fonts.gstatic.com",
  "Strict-Transport-Security": "max-age=63072000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin",
  "Feature-Policy": "geolocation 'none'; microphone 'none';"
};

/**
 * Set Default Headers
 * @param {Express} app The Express App
 */
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.set(headers);
    next();
  });
};
