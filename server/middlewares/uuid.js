module.exports = function(req, res, next) {
  if (!req.params.taskId) {
    return next();
  }
  const v4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
  if (!v4.test(req.params.taskId)) {
    return res.json(404, {
      statusCode: 404,
      message: 'task not found'
    });
  }
  next();
};