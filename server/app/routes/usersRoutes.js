const express = require('express')
const UsersController = require('../controller/UsersController')
const UserImageUpload = require('../helper/usersImageUpload')
const { AuthCheck } = require('../middleware/auth')
const router = express.Router()

//@routes  POST  /api/users/register 
//Description     user register
//@access    public
router.post('/register', UserImageUpload.single('avatar'), UsersController.register)

//@routes   Post /api/users/login
//Description     user login
//@access    public
router.post('/login', UsersController.login)

//@routes  GET  /api/users
//Description     get single user profile
//@access    private
router.get('/', AuthCheck, UsersController.getUserDetails)

// router.post('/verify/email',UsersController.verifyEmail)
// router.post('/login',UsersController.login)
// router.post('/reset-password-link',UsersController.resetPasswordLink);
// router.post('/reset-password/:id/:token',UsersController.resetPassword);

module.exports = router