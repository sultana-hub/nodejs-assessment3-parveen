const httpStatusCode = require('../helper/httpStatusCode')
const { ProfileModel, profileValidation } = require('../model/Profile')
const { UserModel } = require('../model/Users')
const PostModel = require('../model/post')
const experienceValidation = require('../helper/validations/experience')
const educationValidation = require('../helper/validations/education')
const mongoose = require('mongoose')
const slugify = require('slugify');
class ProfileController {

    async getProfile(req, res) {
        try {
            const profile = await ProfileModel.findOne({ user: req.user._id }).populate('user', ['name', 'avatar']).lean();

            if (!profile) {
                return res.status(httpStatusCode.NotFound).json({
                    status: false,
                    message: "There is no profile for this user"
                });
            }

            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "Profile fetched successfully",
                data: profile
            });

        } catch (error) {
            console.error(error.message);
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: "Server error"
            });
        }
    }

    async createProfile(req, res) {
        try {
            // Validate input
            const { error, value } = profileValidation.validate({
                handle: req.body.handle,
                status: req.body.status,
                skills: req.body.skills,
            });

            if (error) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: error.details[0].message,
                });
            }

            // Check if a profile already exists
            const existingProfile = await ProfileModel.findOne({ user: req.user._id });
            if (existingProfile) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: 'Profile already exists',
                });
            }

            // Check if handle is taken
            const handleExists = await ProfileModel.findOne({ handle: req.body.handle });
            if (handleExists) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: 'That handle already exists',
                });
            }

            // Build profileFields
            const name = req.user.name || 'user';
            const handle =
                slugify(name, { lower: true, strict: true }) + '-' + Date.now();

            const profileFields = {
                user: req.user._id,
                handle,
                company: req.body.company,
                website: req.body.website,
                location: req.body.location,
                bio: req.body.bio,
                status: value.status,
                githubusername: req.body.githubusername,
                skills: Array.isArray(value.skills)
                    ? value.skills.map((skill) => skill.trim())
                    : value.skills.split(',').map((skill) => skill.trim()),
                social: {},
            };

            const socialFields = ['youtube', 'twitter', 'facebook', 'linkedin', 'instagram'];
            socialFields.forEach((key) => {
                if (req.body[key]) {
                    profileFields.social[key] = req.body[key];
                }
            });

            const profile = new ProfileModel(profileFields);
            await profile.save();

            return res.status(httpStatusCode.Create).json({
                status: true,
                message: 'Profile created successfully',
                data: profile,
            });
        } catch (err) {
            console.error(err.message);
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: 'Server error',
                error: err.message,
            });
        }
    }

    async allProfiles(req, res) {
        try {
            const profiles = await ProfileModel.find().populate('user', ['name', 'avatar', 'city'])
            res.json(profiles)
        } catch (error) {
            console.error(error.message)
            return res.status(httpStatusCode.InternalServerError).json({
                message: error.message
            })
        }
    }
    //get profile by user id 
    async getProfilesByUserId(req, res) {
        try {

            const { user_id } = req.params

            console.log("Requested user_id:", req.params.user_id);


            const profile = await ProfileModel.findOne({ user: user_id }).populate('user', ['name', 'avatar', 'city'])

            console.log("Profile found:", profile);

            if (!profile) {
                return res.status(httpStatusCode.NotFound).json({
                    message: "profile for this user does not exist"
                })
            }
            return res.json(profile)
        } catch (error) {
            console.error(error.message)
            if (error.kind == 'ObjectId') {
                return res.status(httpStatusCode.NotFound).json({
                    message: "profile for this user does not exist"
                })
            }
            return res.status(httpStatusCode.InternalServerError).json({
                message: error.message
            })
        }
    }



    async updateProfile(req, res) {
        try {
            // Validate input
            const { error, value } = profileValidation.validate({
                handle: req.body.handle,
                status: req.body.status,
                skills: req.body.skills,
            });

            if (error) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: error.details[0].message,
                });
            }

            // Check if profile exists
            const profile = await ProfileModel.findOne({ user: req.user._id });
            if (!profile) {
                return res.status(httpStatusCode.NotFound).json({
                    status: false,
                    message: 'Profile not found',
                });
            }

            const updatedFields = {
                company: req.body.company,
                website: req.body.website,
                location: req.body.location,
                bio: req.body.bio,
                status: value.status,
                githubusername: req.body.githubusername,
                skills: Array.isArray(value.skills)
                    ? value.skills.map((skill) => skill.trim())
                    : value.skills.split(',').map((skill) => skill.trim()),
                social: {},
            };

            const socialFields = ['youtube', 'twitter', 'facebook', 'linkedin', 'instagram'];
            socialFields.forEach((key) => {
                if (req.body[key]) {
                    updatedFields.social[key] = req.body[key];
                }
            });

            const updatedProfile = await ProfileModel.findOneAndUpdate(
                { user: req.user._id },
                { $set: updatedFields },
                { new: true }
            );

            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: 'Profile updated successfully',
                data: updatedProfile,
            });
        } catch (err) {
            console.error(err.message);
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: 'Server error',
                error: err.message,
            });
        }
    }



    // delete user ,profile and post
    async deleteUserData(req, res) {
        try {
            const userId = req.user._id;

            // Delete all posts created by the user (assuming you have a PostModel)
            await PostModel.deleteMany({ user: userId });

            // Delete profile
            await ProfileModel.findOneAndDelete({ user: userId });

            // Delete user
            await UserModel.findOneAndDelete({ _id: userId });
            return res.status(httpStatusCode.Ok).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                message: 'Server error: ' + error.message,
            });
        }
    }


    async addExperience(req, res) {
        try {
            const { error } = experienceValidation.validate(req.body);
            if (error) {
                return res.status(httpStatusCode.NotFound).json({ status: false, message: error.details[0].message });
            }

            const profile = await ProfileModel.findOne({ user: req.user._id });
            if (!profile) {
                return res.status(httpStatusCode.Forbidden).json({ status: false, message: 'Profile not found' });
            }

            // Create experience object
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            // Add to beginning of experience array
            profile.experience.unshift(newExp);
            await profile.save();

            return res.status(httpStatusCode.Ok).json({ status: true, message: 'Experience added', data: profile });
        } catch (error) {
            console.error(error.message);
            return res.status(httpStatusCode.InternalServerError).json({ status: false, message: 'Server error' });
        }
    }

    async deleteExperience(req, res) {
        try {
            const profile = await ProfileModel.findOne({ user: req.user._id });

            if (!profile) {
                return res.status(404).json({
                    status: false,
                    message: 'Profile not found'
                });
            }

            const experienceIndex = profile.experience.findIndex(
                exp => exp._id.toString() === req.params.exp_id
            );

            if (experienceIndex === -1) {
                return res.status(404).json({
                    status: false,
                    message: 'Experience not found'
                });
            }

            profile.experience.splice(experienceIndex, 1);
            await profile.save();

            return res.status(200).json({
                status: true,
                message: 'Experience deleted successfully',
                data: profile
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                status: false,
                message: 'Server error'
            });
        }
    }


    async addEducation(req, res) {
        try {
            const { error } = educationValidation.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: false,
                    message: error.details[0].message
                });
            }

            const {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description
            } = req.body;

            const newEdu = {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description
            };

            const profile = await ProfileModel.findOne({ user: req.user._id });

            if (!profile) {
                return res.status(404).json({ status: false, message: 'Profile not found' });
            }

            profile.education.unshift(newEdu);
            await profile.save();

            return res.status(200).json({
                status: true,
                message: 'Education added successfully',
                data: profile
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ status: false, message: 'Server error' });
        }
    }


    async deleteEducation(req, res) {
        try {
            // Validate edu_id
            if (!mongoose.Types.ObjectId.isValid(req.params.edu_id)) {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid education ID',
                });
            }

            const profile = await ProfileModel.findOne({ user: req.user._id });

            if (!profile) {
                return res.status(404).json({
                    status: false,
                    message: 'Profile not found',
                });
            }

            const eduIndex = profile.education.findIndex(
                (edu) => edu._id.toString() === req.params.edu_id
            );

            if (eduIndex === -1) {
                return res.status(404).json({
                    status: false,
                    message: 'Education entry not found',
                });
            }

            profile.education.splice(eduIndex, 1);
            await profile.save();

            return res.status(200).json({
                status: true,
                message: 'Education deleted successfully',
                data: profile,
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                status: false,
                message: 'Server error',
            });
        }
    }


}

module.exports = new ProfileController;


