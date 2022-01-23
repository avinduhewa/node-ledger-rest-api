const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

const authorize = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(httpStatus.FORBIDDEN)
      .send(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
  }
  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), config.token_key);
    req.user = decoded;
  } catch (err) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }
  return next();
};

module.exports = authorize;
