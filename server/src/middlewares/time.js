function addTimestamp(req, res, next) {
  req.timestamp = Date.now();
  next();
}

module.exports = { addTimestamp };
