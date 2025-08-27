const express=require('express')
const router=express.Router()
const { AuthCheck } = require('../middleware/auth');
const ProfileController=require('../controller/ProfileController')

//@routes    /api/profile/me
//@ desc     get current user frofile
//@access    private
router.get('/me',AuthCheck,ProfileController.getProfile)

//@routes    /api/profile/create
//@ desc     post frofile
//@access    private
router.post('/create',AuthCheck,ProfileController.createProfile)

//@routes    /api/profile/
//@ desc     get all  frofile
//@access    public
router.get('/',ProfileController.allProfiles)

//@routes    /api/profile/user/user_id
//@ desc     get frofile by user_id
//@access    public
router.get('/user/:user_id',ProfileController.getProfilesByUserId)



//@routes    /api/profile/update
//@ desc     post frofile
//@access    private
router.post('/update',AuthCheck,ProfileController.updateProfile)

//@routes    /api/profile/delete
//@ desc     get frofile by user_id
//@access    private
router.delete('/delete',AuthCheck,ProfileController.deleteUserData)


//@routes    /api/profile/experience
//@ desc     post frofile experience
//@access    private
router.put('/experience',AuthCheck,ProfileController.addExperience)

//@routes    /api/profile/experience/delete/:exp_id
//@ desc     post frofile experience
//@access    private
router.delete('/experience/delete/:exp_id',AuthCheck,ProfileController.deleteExperience)

//@routes    /api/profile/education
//@ desc     post frofile education
//@access    private

router.put('/education', AuthCheck, ProfileController.addEducation);

//@routes    /api/profile/education/delete/:edu_id
//@ desc     delete frofile education
//@access    private
router.delete('/education/delete/:edu_id', AuthCheck, ProfileController.deleteEducation);


module.exports=router