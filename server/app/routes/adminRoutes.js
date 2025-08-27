const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const EjsAuthCheck = require("../middleware/EjsAuthCheck");
const requireRole = require("../middleware/roles");
const UserImageUpload = require('../helper/userImageUpload')
// login + register pages
router.get("/", AdminController.loginpage);
router.post("/login", AdminController.login);
router.get('/logout', AdminController.logout)


router.get('/register', AdminController.registerpage)
router.post('/register', UserImageUpload.single('avatar'), AdminController.register)

// dashboard (any logged-in user can see)
router.get("/dashboard", EjsAuthCheck, AdminController.dashboard);

// // only ADMIN can access user list
router.get("/user-list", EjsAuthCheck, requireRole("Admin"), AdminController.getAllUsers);
router.delete("/delete", EjsAuthCheck, requireRole("Admin"), AdminController.deleteUser)


// // only TEACHER can manage timetable
router.get("/blog-list", EjsAuthCheck, requireRole("User", "Admin"), AdminController.getusersBlog);
router.get('/create-blog', EjsAuthCheck, requireRole("User", "Admin"), AdminController.createBlogPage)
router.post('/create-blog', EjsAuthCheck, requireRole("User", "Admin"), AdminController.createBlog)
router.get("/blog/edit/:id", EjsAuthCheck, requireRole("User", "Admin"), AdminController.editBlogPage)
router.put("/blog/update/:id", EjsAuthCheck, requireRole("User", "Admin"), AdminController.updateBlog)
router.delete("/blog/delete/:id", EjsAuthCheck, requireRole("User", "Admin"), AdminController.deleteBlog);


router.get(
    '/admin/blog-list',
    EjsAuthCheck,
    requireRole('Admin'),
    AdminController.allBlogsAdmin
);

// Edit blog (author or admin)
router.get('/blog/admin/edit/:id', EjsAuthCheck, requireRole("Admin","User"), AdminController.editBlogPage);
router.put('/blog/admin/update/:id', EjsAuthCheck, requireRole("Admin", "User"), AdminController.updateBlog);

// Delete blog (author or admin)
router.delete('/blog/admin/delete/:id', EjsAuthCheck, requireRole("Admin", "User"), AdminController.deleteBlog);
// // logout
router.get("/logout", EjsAuthCheck, AdminController.logout);

module.exports = router;
