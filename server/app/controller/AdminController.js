const { UserModel, validateSchema, loginSchema } = require("../model/Users");
const { ProfileModel } = require('../model/Profile')
const PostModel = require('../model/post')
const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const transporter = require('../config/EmailConfig')
// const sendEmailAndPassword = require('../helper/sendEmailPassword');
const httpStatusCode = require('../helper/httpStatusCode');
const { hashedPassword, comparePassword } = require('../middleware/auth')
const fs = require('fs');
const path = require('path')
const jwt = require('jsonwebtoken');

class AdminController {

    async ejsAuthCheck(req, res, next) {
        try {
            if (req.user) {
                next()
            } else {
                res.redirect('/admin');//login page
            }
        } catch (err) {
            console.log(err)
        }
    }


    async loginpage(req, res) {
        try {
            const message = req.flash('message')
            res.render('login', {
                title: "login",
                message,
                user: req.user
            })

        } catch (error) {
            console.error(error);
            req.flash('message', "Internal server error");
        }
    }
    async login(req, res) {
        try {
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                req.flash('message', error.details[0].message);
                return res.redirect('/admin');
            }

            const user = await UserModel.findOne({ email: value.email });
            if (!user) {
                req.flash('message', "User not found");
                return res.redirect('/admin');
            }

            const isMatch = await comparePassword(value.password, user.password);
            if (!isMatch) {
                req.flash('message', "Invalid password");
                return res.redirect('/admin');
            }

            if (user.isAdmin !== 'admin') {
                req.flash('message', "Please login with admin credentials");
                return res.redirect('/admin');
            }
            // 5. Generate JWT Token
            const token = jwt.sign({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image
            }, process.env.JWT_SECRET_KEY, { expiresIn: "4h" });


            // 5. Generate JWT Token
            // const tokenPayload = {
            //     _id: user._id,
            //     name: user.name,
            //     email: user.email,
            //     phone: user.phone,
            //     image: user.image
            // };

            // const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
            //     expiresIn: "4h"
            // });
            console.error(" token:", token);
            // 6. Set cookie
            res.cookie('usertoken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 4 * 60 * 60 * 1000 // 4 hours
            });

            req.flash("message", "Welcome admin!");
            return res.redirect('/admin/dashboard');
        } catch (err) {
            console.error(" Login error:", err);
            req.flash('message', "Internal server error");
            return res.redirect('/admin');
        }
    };


    async dashboard(req, res) {
        try {
            const message = req.flash('Welcome to admin dashboard')
            const user = await UserModel.find({ isAdmin: 'admin' });
            // Get metrics
            const totalUsers = await UserModel.countDocuments();
            const totalProfiles = await ProfileModel.countDocuments();
            const totalBlocked = await UserModel.countDocuments({ isBlock: true });
            res.render('dashboard', {
                title: "Admin Dashboard",
                userdata: req.user,
                user,
                message,
                totalUsers,
                totalProfiles,
                totalBlocked
            });
        } catch (error) {
            console.error("Dashboard error:", error);
            req.flash("message", "Failed to load dashboard");
            return res.redirect("/admin");
        }
    }


    async logout(req, res) {
        try {
            res.clearCookie('usertoken');
            return res.redirect('/admin')

        } catch (error) {
            console.log(error.message);

        }

    }

    //  async userList(req, res) {
    //         try {
    //             const message = req.flash('Welcome to users list');
    //             const users = await UserModel.find({ isAdmin: { $ne: 'admin' } });

    //             res.render('users/list', {
    //                 title: "User List",
    //                 users,             //  This is the array to loop over
    //                 user: req.user,    //  Logged-in admin user (used for profile etc.)
    //                 message
    //             });
    //         } catch (error) {
    //             console.error("List error:", error);
    //             req.flash("message", "Failed to load users list");
    //             return res.redirect("/admin/list");
    //         }
    //     }


    // controller
    async toggle_block(req, res) {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                req.flash("message", "User not found");
                return res.redirect("/admin/list");
            }

            // Toggle the isBlock status
            user.isBlock = !user.isBlock;
            await user.save();

            req.flash("message", `User has been ${user.isBlock ? "blocked" : "unblocked"}`);
            res.redirect("/admin/user-list");
        } catch (err) {
            console.error("Toggle Block Error:", err);
            req.flash("message", "Something went wrong");
            res.redirect("/admin/user-list");
        }
    }
    //delete user
    async deleteUser(req, res) {
        const id = req.params.id

    }
    //searching 

    async getAllUsers(req, res) {
        try {
            const message = req.flash('Welcome to users list');
            const query = req.query.query;
            let users = [];

            if (query) {
                const regex = new RegExp(query, 'i'); // case-insensitive
                users = await UserModel.find({
                    $or: [
                        { name: regex },
                        { email: regex }
                    ]
                });
            } else {
                users = await UserModel.find({ isAdmin: { $ne: 'admin' } });
            }

            res.render('users/list', {
                title: "User List",
                users,
                message
            });
        } catch (error) {
            console.error("User list error:", error);
            req.flash("message", "Something went wrong!");
            return res.redirect("/admin/list");
        }
    }
    // async getAllProfiles(req, res) {
    //     try {
    //         const message = req.flash('Welcome to Users Profile list');
    //         const profiles = await ProfileModel.find().populate('user', 'name');

    //         res.render('profiles/list', {
    //             title: "Profile List",
    //             profiles,             //  This is the array to loop over
    //             user: req.user,    //  Logged-in admin user (used for profile etc.)
    //             message
    //         });
    //     } catch (error) {
    //         console.error("List error:", error);
    //         req.flash("message", "Failed to load users list");
    //         return res.redirect("/admin/profile-list");
    //     }
    // }
    async getAllProfiles(req, res) {
        try {
            const message = req.flash('Welcome to Users Profile list');
            const searchQuery = req.query.query;

            // Base query
            let query = {};

            if (searchQuery) {
                // First, find users whose name or email matches
                const matchingUsers = await UserModel.find({
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { email: { $regex: searchQuery, $options: 'i' } }
                    ]
                }).select('_id');

                // Extract matching user IDs
                const matchingUserIds = matchingUsers.map(user => user._id);
                query.user = { $in: matchingUserIds };
            }

            const profiles = await ProfileModel.find(query)
                .populate('user', 'name email');

            res.render('profiles/list', {
                title: "Profile List",
                profiles,
                user: req.user,
                message
            });

        } catch (error) {
            console.error("List error:", error);
            req.flash("message", "Failed to load users list");
            return res.redirect("/admin/profile-list");
        }
    }
    async getAllPost(req, res) {
        try {
            const message = req.flash('Welcome to Users Posts list');
            const searchQuery = req.query.query;

            // Base query
            let query = {};

            if (searchQuery) {
                // First, find users whose name or email matches
                const matchingUsers = await UserModel.find({
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { email: { $regex: searchQuery, $options: 'i' } }
                    ]
                }).select('_id');

                // Extract matching user IDs
                const matchingUserIds = matchingUsers.map(user => user._id);
                query.user = { $in: matchingUserIds };
            }

            const posts = await PostModel.find(query).sort({ date: -1 })
                .populate('user', 'name email');

            res.render('posts/list', {
                title: "Post List",
                posts,
                user: req.user,
                message
            });

        } catch (error) {
            console.error("List error:", error);
            req.flash("message", "Failed to load post list");
            return res.redirect("/admin/post-list");
        }

    }

    async deleteUserData(req, res) {
        try {
            const userId = req.user._id;

            // Delete all posts created by the user (assuming you have a PostModel)
            await PostModel.deleteMany({ user: userId });

            // Delete profile
            await ProfileModel.findOneAndDelete({ user: userId });

            // Delete user
            await UserModel.findOneAndDelete({ _id: userId });

            // Redirect or send response
            return res.redirect('/admin/user-list');
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                message: 'Server error: ' + error.message,
            });
        }
    }

async getPostById(req, res) {
    try {
        const id = req.params.id;
        const post = await PostModel.findById(id);
        
        if (!post) {
            req.flash("message", "Post not found");
            return res.status(httpStatusCode.NotFound).json({
                message: "post not exist"
            });
        }

        return res.json(post);

    } catch (error) {
        console.log(error.message);

        if (error.kind === 'ObjectId') {
            return res.status(httpStatusCode.NotFound).json({
                message: "post not exist"
            });
        }

        return res.status(httpStatusCode.InternalServerError).json({
            message: "Something went wrong"
        });
    }
}

    
    async deletePost(req, res) {
        try {
            const post = await PostModel.findById(req.params.id);

            if (!post) {
                req.flash("message", "Post not found");
                return res.redirect('/admin/post-list');
            }
            if (post.user.toString() !== req.user._id.toString() && req.user.isAdmin !== 'admin') {
                req.flash("message", "Unauthorized action");
                return res.redirect('/admin/post-list');
            }

            await post.deleteOne();

            req.flash("message", "Post deleted successfully");
            return res.redirect('/admin/post-list');
        } catch (error) {
            console.error("Delete Post Error:", error.message);
            if (error.kind === 'ObjectId') {
                return res.status(httpStatusCode.NotFound).json({
                    message: "post not exist"
                })
            }
            req.flash("message", "Error in deleting post");
            return res.redirect('/admin/post-list');
        }
    }

}

module.exports = new AdminController