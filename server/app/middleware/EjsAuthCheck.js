const jwt = require("jsonwebtoken");

const EjsAuthCheck = (req, res, next) => {
  if (req.cookies && req.cookies.usertoken) {
    jwt.verify(
      req.cookies.usertoken,
      process.env.JWT_SECRET_KEY,
      (err, decoded) => {
        if (err) {
          return res.redirect("/"); // invalid/expired → go login
        }
        req.user = decoded;
        res.locals.user = decoded;
        return next();
      }
    );
  } else {
    return res.redirect("/"); // no token → go login
  }
};

module.exports = EjsAuthCheck;
