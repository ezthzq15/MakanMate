function logger(req, res, next) {
  console.log(`${req.timestamp || Date.now()} - ${req.method} ${req.ip}${req.originalUrl}`);
  next();
}

module.exports = { logger };
