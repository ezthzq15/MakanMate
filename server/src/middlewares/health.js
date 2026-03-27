function validateHealthRequest(req, res, next) {
  const currentCondition = ["Good", "Bad", "Critical"];
  const { condition } = req.body;

  if (!currentCondition.includes(condition)) {
    return res.status(400).send("Wrong value");
  }

  res.send({
    message: `Your current condition is ${condition}`,
    timestamp: req.timestamp,
    data: req.body,
  });
}

module.exports = { validateHealthRequest };
