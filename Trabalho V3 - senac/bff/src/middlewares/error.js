module.exports = (err, req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Erro interno',
    ...(err.payload ? { details: err.payload } : {})
  });
};
