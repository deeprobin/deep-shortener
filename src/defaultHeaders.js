
const headers = {
  "Content-Security-Policy":
    "default-src 'self' 'unsafe-inline' www.googletagservices.com cdnjs.cloudflare.com adservice.google.de adservice.google.fr adservice.google.en adservice.google.com fonts.googleapis.com ssl.google-analytics.com pagead2.googlesyndication.com www.google-analytics.com google-analytics.com; style-src 'unsafe-inline' 'self' cdnjs.cloudflare.com fonts.googleapis.com; frame-src googleads.g.doubleclick.net; object-src 'none'; font-src fonts.googleapis.com fonts.gstatic.com",
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
