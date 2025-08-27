const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect("/"); // not logged in
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).render("403", { error: "Access denied" });
    }

    next();
  };
};

module.exports = requireRole;
