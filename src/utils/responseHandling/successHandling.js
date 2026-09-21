export const sendSuccess = (res, statusCode, data, message) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};