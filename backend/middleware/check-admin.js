const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const { JWT_KEY, isAdminEmail } = require("../util/auth-config");

// Lets the request through only if it carries a valid token from an admin user
module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  let decodedToken;
  try {
    // Header format: "Authorization: Bearer TOKEN"
    const token = (req.headers.authorization || "").split(" ")[1];
    if (!token) {
      throw new Error("No token");
    }
    decodedToken = jwt.verify(token, JWT_KEY);
  } catch (err) {
    return next(new HttpError("Authentication failed, please log in again.", 401));
  }

  if (!isAdminEmail(decodedToken.email)) {
    return next(new HttpError("You are not allowed to see this page.", 403));
  }

  req.userData = { userId: decodedToken.userId, email: decodedToken.email };
  next();
};
