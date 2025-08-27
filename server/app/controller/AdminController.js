
const { UserModel, roles, loginSchema, validateSchema } = require('../model/user')
const httpStatusCode = require('../helper/httpStatusCode')
const bcrypt = require('bcryptjs');
const { hashedPassword, comparePassword } = require('../middleware/hashPasswors')
const fs = require('fs');
const path = require('path')
const jwt = require('jsonwebtoken');
const BlogModel = require('../model/blog');

class AdminController {


    async registerpage(req, res) {

        try {
            const message = req.flash('message')
            res.render('register', {
                title: "Register",
                message
            });
        } catch (error) {
            console.error(error);
            req.flash('message', "Internal server error");
            res.redirect('/');
        }

    }


    async register(req, res) {
        try {
            console.log("BODY RECEIVED:", req.body);
            console.log("FILE RECEIVED:", req.file);

            // if no file uploaded
            if (!req.file) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "Avatar file is required",
                });
            }
            let role = req.body.role;

            // Map frontend values → backend roles
            if (role.toLowerCase() === "user") role = "User";
            if (role.toLowerCase() === "admin") role = "Admin";
            const usersData = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password, // plain password (will hash later)
                role:
                    req.body.role.charAt(0).toUpperCase() +
                    req.body.role.slice(1).toLowerCase(),
                avatar: req.file.path, //  store filename or full path
            };

            const { error, value } = validateSchema.validate(usersData);
            if (error) {
                return res.status(httpStatusCode.Unauthorized).json({
                    message: error.details[0].message,
                });
            }

            // Check duplicate email
            const isExist = await UserModel.findOne({ email: value.email });
            if (isExist) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "User already exists",
                });
            }

            // Hash password before saving
            value.password = await hashedPassword(value.password);

            // Save user
            const user = await UserModel.create(value);

            // Generate JWT
            const token = jwt.sign(
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "36h" }
            );
            res.redirect('/')
            // return res.status(httpStatusCode.Create).json({
            //     message: "User created successfully. Credentials sent to email.",
            //     data: user,
            //     token: token,
            // });
        } catch (error) {
            res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message,
            });
        }
    }



    async loginpage(req, res) {
        try {
            const message = req.flash('message');
            res.render('login', {
                title: "Login",
                message
            });
        } catch (error) {
            console.error(error);
            req.flash('message', "Internal server error");
            res.redirect('/');
        }
    }


    async login(req, res) {
        try {
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                req.flash('message', error.details[0].message);
                return res.redirect('/');
            }

            const user = await UserModel.findOne({ email: value.email });
            if (!user) {
                req.flash('message', "User not found");
                return res.redirect('/');
            }

            const isMatch = await comparePassword(value.password, user.password);
            if (!isMatch) {
                req.flash('message', "Invalid password");
                return res.redirect('/');
            }

            //  Access Token (short expiry)
            const accessToken = jwt.sign(
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "15m" } // short lived
            );

            //  Refresh Token (longer expiry)
            const refreshToken = jwt.sign(
                { _id: user._id, email: user.email },
                process.env.REFRESH_SECRET_KEY, // use a different secret
                { expiresIn: "7d" } // valid for 7 days
            );

            //  Save refresh token in DB (optional: helps revoke tokens later)
            user.refreshTokens = refreshToken;
            await user.save();

            //  Set cookies
            res.cookie("usertoken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie("refreshtoken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            req.flash("message", "Welcome admin!");
            return res.redirect("/dashboard");

        } catch (err) {
            console.error(" Login error:", err);
            req.flash("message", "Internal server error");
            return res.redirect("/");
        }
    }

    async logout(req, res) {
        try {
            // If you stored JWT in cookies
            res.clearCookie("token");
            // If you also used session
            req.session.destroy(() => {
                res.redirect("/?message=Logged out successfully");
            });
        } catch (error) {
            console.error("Logout error:", error);
            res.redirect("/?error=Something went wrong");
        }
    }

    async dashboard(req, res) {
        try {
            //Logged-in user comes from JWT (middleware attached req.user)
            const loggedInUser = req.user;

            //  Use flash for dynamic message
            req.flash("success", `Welcome to ${loggedInUser.role} dashboard`);

            res.render("dashboard", {
                title: `${loggedInUser.role} Dashboard`,
                user: loggedInUser,   // only logged-in user
                message: req.flash("success"),
            });
        } catch (error) {
            console.error("Dashboard error:", error);
            req.flash("error", "Failed to load dashboard");
            return res.redirect("/");
        }
    }


    async getAllUsers(req, res) {
        try {
            // Fetch all users except the currently logged-in admin
            const users = await UserModel.find({ _id: { $ne: req.user._id } });

            // Flash message, if any
            const message = req.flash('message');

            // Render the user list page
            res.render('users/list', {
                title: "Manage Users",
                users,
                message,
                user: req.user, // currently logged-in user
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            req.flash('message', "Failed to load users");
            res.redirect('/dashboard');
        }
    }

    async deleteUser(req, res) {
        try {
            const userId = req.params.id;

            // Prevent admin from deleting themselves
            if (userId === req.user._id.toString()) {
                req.flash('message', "You cannot delete yourself!");
                return res.redirect('/user-list');
            }

            const deletedUser = await UserModel.findByIdAndDelete(userId);

            if (!deletedUser) {
                req.flash('message', "User not found");
                return res.redirect('/user-list');
            }

            req.flash('message', "User deleted successfully");
            res.redirect('/user-list');
        } catch (error) {
            console.error("Error deleting user:", error);
            req.flash('message', "Failed to delete user");
            res.redirect('/user-list');
        }
    }

    async getusersBlog(req, res) {
        try {
            const entry = await BlogModel.find().populate("author", "name");
            const message = req.flash('message');
            res.render('blog/list', {
                title: "blog list",
                message,
                entry
            });
        } catch (error) {
            console.error(error);
            req.flash('message', "Internal server error");
            res.redirect('/dashboard');
        }
    }


    async createBlogPage(req, res) {
        try {
            const message = req.flash('message', "Time table created ");
            res.render('blog/add', {
                title: "User Blog",
                message
            })
        } catch (error) {
            console.log("error in getting page ", error.message)
            req.flash('message', "Internal server error");
        }
    }


    async createBlog(req, res) {
        try {
            const { title, content } = req.body;

            if (!title || !content) {
                return res.status(400).json({
                    status: false,
                    message: "All fields are required",
                });
            }

            // Ensure user role
            if (!req.user || req.user.role !== "User") {
                return res.status(403).json({
                    status: false,
                    message: "Access denied. Users only",
                });
            }

            const blog = new BlogModel({
                title,
                content,
                author: req.user._id, // always take from logged-in user
            });

            await blog.save();

            return res.redirect("/blog-list?message=Blog entry created successfully");
        } catch (error) {
            console.error("Error creating Blog:", error);
            return res.status(500).json({
                status: false,
                message: "Server error while creating Blog",
            });
        }
    }

    // GET edit page
async editBlogPage(req, res) {
    try {
        const blog = await BlogModel.findById(req.params.id).populate("author", "name");
        if (!blog) return res.status(404).send("Blog not found");

        // Only author can edit
        if (blog.author._id.toString() !== req.user._id.toString()  && req.user.role !== 'Admin') {
            return res.status(403).render("403"); // or res.status(403).send("Access Denied");
        }

        res.render("blog/edit", { blog, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}


    // POST update
    async updateBlog(req, res) {
        try {
            const { title, content } = req.body;

            if (!title || !content) {
                return res
                    .status(400)
                    .json({ status: false, message: "Title and content are required" });
            }

            // Only allow blog author (or Admin) to update
            const blog = await BlogModel.findById(req.params.id);

            if (!blog) {
                return res
                    .status(404)
                    .json({ status: false, message: "Blog not found" });
            }

            if (blog.author.toString() !== req.user._id.toString()  && req.user.role !== 'Admin') {
                return res
                    .status(403)
                    .json({ status: false, message: "Access denied. Not authorized" });
            }

            await BlogModel.findByIdAndUpdate(
                req.params.id,
                { title, content, updatedAt: Date.now() },
                { new: true }
            );

            // If using EJS
            return res.redirect("/blog-list?message=Blog updated successfully");

            // If API only:
            // return res.json({ status: true, message: "Blog updated successfully" });
        } catch (err) {
            console.error("Error updating blog:", err);
            res.status(500).send("Server error");
        }
    }


 
 // DELETE blog
async deleteBlog(req, res) {
    try {
        const { id } = req.params;

        // Find the blog first
        const blog = await BlogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ status: false, message: "Blog not found" });
        }

        // Check ownership: only the author can delete
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'Admin'){
            return res.status(403).json({ status: false, message: "Access denied. Not authorized" });
        }

        await BlogModel.findByIdAndDelete(id);

        // Redirect to blog list
        res.redirect("/blog-list?message=Blog deleted successfully");
    } catch (err) {
        console.error("Error deleting blog:", err);
        res.status(500).json({ status: false, message: "Server error" });
    }
}

 // Get all blogs (Admin view)
async allBlogsAdmin(req, res) {
    try {
        // Fetch all blogs and populate the author name
        const blogs = await BlogModel.find().populate("author", "name role");

        res.render("blog/admin-list", {
            entry: blogs,
            user: req.user, // current logged-in admin
            message: req.query.message || null
        });
    } catch (err) {
        console.error("Error fetching blogs:", err);
        res.status(500).send("Server error");
    }
}
 // PUT /blog/update/:id
async updateBlogAdmin(req, res) {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            req.flash('message', 'Title and content are required');
            return res.redirect('back');
        }

        const blog = await BlogModel.findById(req.params.id);
        if (!blog) {
            req.flash('message', 'Blog not found');
            return res.redirect('/blog-list');
        }

        // Only author or admin can update
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            req.flash('message', 'Access denied. Not authorized');
            return res.redirect('/blog-list');
        }

        blog.title = title;
        blog.content = content;
        await blog.save();

        req.flash('message', 'Blog updated successfully');
        res.redirect('/blog-list');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

// DELETE /blog/delete/:id
async deleteBlogAdmin(req, res) {
    try {
        const blog = await BlogModel.findById(req.params.id);
        if (!blog) {
            req.flash('message', 'Blog not found');
            return res.redirect('/blog-list');
        }

        // Only author or admin can delete
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            req.flash('message', 'Access denied. Not authorized');
            return res.redirect('/blog-list');
        }

        await BlogModel.findByIdAndDelete(req.params.id);
        req.flash('message', 'Blog deleted successfully');
        res.redirect('/blog-list');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

// GET edit page - Admin only
async editBlogPageAdmin(req, res) {
    try {
        const blog = await BlogModel.findById(req.params.id).populate("author", "name");
        if (!blog) return res.status(404).send("Blog not found");

        // Only Admin can edit
        if (req.user.role !== "Admin") {
            return res.status(403).render("403"); // Render a 403 page
        }

        res.render("blog/edit", { blog, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}




}

module.exports = new AdminController