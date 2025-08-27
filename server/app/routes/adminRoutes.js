const express = require('express');
const adminController = require('../controller/AdminController')
const EjsAuthCheck = require('../middleware/EjsAuthCheck')
// const UserImageUpload=require('../helper/usersImageUpload')
// const ProfileController=require('../controller/ProfileController')
// const PostController=require('../controller/PostController')

const router = express.Router();
//view login and register pages
router.get('/', adminController.loginpage)
//post login and register pages
router.post('/login', adminController.login)
//post register
// router.post('/register', adminController.)
//dashboard view
router.get('/dashboard',EjsAuthCheck, adminController.ejsAuthCheck,adminController.dashboard)
router.get('/user-list',EjsAuthCheck,adminController.getAllUsers)
router.post('/toggle-block/:id', adminController.toggle_block);
router.get('/profile-list',EjsAuthCheck,adminController.getAllProfiles)
router.get('/post-list',EjsAuthCheck,adminController.getAllPost)
router.get('/logout',EjsAuthCheck, adminController.logout)
//delete user
router.post('/delete/:id',EjsAuthCheck, adminController.deleteUserData);
router.post('/delete/post/:id',EjsAuthCheck, adminController.deletePost);
module.exports = router;