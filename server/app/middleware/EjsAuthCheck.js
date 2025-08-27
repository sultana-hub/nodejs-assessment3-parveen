const jwt = require("jsonwebtoken");

const EjsAuthCheck = (req, res, next) => {
  if (req.cookies && req.cookies.usertoken) {
    jwt.verify(
      req.cookies.usertoken,
      process.env.JWT_SECRET_KEY,
      (err, decoded) => {
        if (err) {
          // If token is invalid or expired
          req.user = null;
          res.locals.user = null;
          return next();
        }

        req.user = decoded;
        res.locals.user = decoded;
        return next();
      }
    );
  } else {
    req.user = null;
    res.locals.user = null;
    return next();
  }
};

module.exports = EjsAuthCheck;
