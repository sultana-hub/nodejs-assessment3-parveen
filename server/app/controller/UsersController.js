const { validateSchema, UserModel } = require('../model/Users')
const httpStatusCode = require('../helper/httpStatusCode')
const { AuthCheck, hashedPassword, comparePassword } = require('../middleware/auth')
const sendEmailVerificationOTP = require("../helper/SendOtpVerification");
const gravatar = require('gravatar')
const OtpModel = require('../model/OtpModel')
const jwt = require('jsonwebtoken')
const fs = require('fs')

class UsersController {
  //registration

  async register(req, res) {
    try {
      console.log(req.body);
      console.log("req.file = ", req.file);
      const usersData = {
        name: req.body.name,
        email: req.body.email,
        city: req.body.city,
        phone: req.body.phone,
        password: req.body.password,
        avatar: req.file
          ? req.file.path
          : gravatar.url(req.body.email, { s: "200", r: "pg", d: "mm" }),
      };

      const { error, value } = validateSchema.validate(usersData);
      if (error) {
        // Delete uploaded file if validation fails
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) console.error("Failed to delete invalid uploaded file:", err);
          });
        }

        return res.status(httpStatusCode.Unauthorized).json({
          message: error.details[0].message,
        });
      }

      const isExist = await UserModel.findOne({ email: value.email });
      if (isExist) {
        return res.status(httpStatusCode.BadRequest).json({
          status: false,
          message: "User already exists",
        });
      }

      // Hash password
      const newHashedPassword = hashedPassword(value.password);
      value.password = newHashedPassword;

      const user = await UserModel.create(value);
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          city: user.city,
          avatar: user.avatar
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "36h" }
      );

       sendEmailVerificationOTP(req, user)
      return res.status(httpStatusCode.Create).json({
        message: "User created successfully",
        data: user,
        token: token
      });
    } catch (error) {
      res.status(httpStatusCode.InternalServerError).json({
        status: false,
        message: error.message,
      });
    }
  }


  async getUserDetails(req, res) {
    try {
      const user = await UserModel.findById(req.user.id).select('-password');

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        status: true,
        message: 'User profile fetched successfully',
        data: user
      });
    } catch (error) {
      console.error(error.message);
      res.status(httpStatusCode.InternalServerError).json({
        status: false,
        message: error.message
      });
    }
  }



  // otp verification
  async verifyEmail(req, res) {
    try {
      const { email, otp } = req.body;
      // Check if all required fields are provided
      if (!email || !otp) {
        return res.status(httpStatusCode.BadRequest).json({ status: false, message: "All fields are required" });
      }
      const Userexisting = await UserModel.findOne({ email });

      // Check if email doesn't exists
      if (!Userexisting) {
        return res.status(httpStatusCode.NotFound).json({ status: "failed", message: "Email doesn't exists" });
      }

      // Check if email is already verified
      if (Userexisting.is_verify) {
        return res.status(httpStatusCode.BadRequest).json({ status: false, message: "Email is already verified" });
      }
      // Check if there is not  a matching email verification OTP
      const emailVerification = await OtpModel.findOne({ userId: Userexisting._id, otp });
      if (!emailVerification) {
        if (!Userexisting.is_verify) {
          // console.log(existingUser);
          await sendEmailVerificationOTP(req, Userexisting);
          return res.status(400).json({ status: false, message: "Invalid OTP, new OTP sent to your email" });
        }
        return res.status(400).json({ status: false, message: "Invalid OTP" });
      }
      // Check if OTP is expired
      const currentTime = new Date();
      // 15 * 60 * 1000 calculates the expiration period in milliseconds(15 minutes).
      const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
      if (currentTime > expirationTime) {
        // OTP expired, send new OTP
        await sendEmailVerificationOTP(req, Userexisting);
        return res.status(400).json({ status: "failed", message: "OTP expired, new OTP sent to your email" });
      }
      // OTP is valid and not expired, mark email as verified
      Userexisting.is_verify = true;
      await Userexisting.save();

      // Delete email verification document
      await OtpModel.deleteMany({ userId: Userexisting._id });
      return res.status(200).json({ status: true, message: "Email verified successfully" });


    } catch (error) {
      console.error("Email verification failed:", error);
      res.status(httpStatusCode.InternalServerError).json({ status: false, message: "Unable to verify email, please try again later" });
    }

  }

//resend otp 
  async resendOtp(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          status: false,
          message: "Email is required",
        });
      }

      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found with this email",
        });
      }

      if (user.is_verify) {
        return res.status(400).json({
          status: false,
          message: "Email is already verified",
        });
      }

      // Optional: Remove existing OTPs for the user
      await OtpModel.deleteMany({ userId: user._id });

      // Send new OTP
      await sendEmailVerificationOTP(req, user);

      return res.status(200).json({
        status: true,
        message: "New OTP sent to your email successfully",
      });

    } catch (error) {
      console.error("Resend OTP error:", error);
      return res.status(500).json({
        status: false,
        message: "Unable to resend OTP. Please try again later.",
      });
    }
  
  }





  //login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(httpStatusCode.BadRequest).json({
          status: false,
          message: "All fields are required"
        });
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(httpStatusCode.BadRequest).json({
          status: false,
          message: "User not found"
        });
      }

      // Compare password with hash
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(httpStatusCode.BadRequest).json({
          status: false,
          message: "Invalid password"
        });
      }

      // Sign the token
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2h" }
      );

      return res.status(httpStatusCode.Ok).json({
        status: true,
        message: "User login successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        token: token
      });

    } catch (error) {
      console.error(error.message);
      return res.status(httpStatusCode.InternalServerError).json({
        status: false,
        message: "Server error"
      });
    }
  }


  async resetPasswordLink(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ status: false, message: "Email field is required" });
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ status: false, message: "Email doesn't exist" });
      }
      // Generate token for password reset
      const secret = user._id + process.env.WT_SECRET_KEY;
      const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '20m' });
      // Reset Link and this link generate by frontend developer
      const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/${user._id}/${token}`;
      //console.log(resetLink);
      // Send password reset email  
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password Reset Link",
        html: `<p>Hello ${user.name},</p><p>Please <a href="${resetLink}">Click here</a> to reset your password.</p>`
      });
      // Send success response
      res.status(200).json({ status: true, message: "Password reset email sent. Please check your email." });

    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, message: "Unable to send password reset email. Please try again later." });

    }
  }

  //reset password

  async resetPassword(req, res) {

    try {
      const { password, confirm_password } = req.body;
      const { id, token } = req.params;
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }
      // Validate token check 
      const new_secret = user._id + process.env.WT_SECRET_KEY;
      jwt.verify(token, new_secret);

      if (!password || !confirm_password) {
        return res.status(400).json({ status: false, message: "New Password and Confirm New Password are required" });
      }

      if (password !== confirm_password) {
        return res.status(400).json({ status: false, message: "New Password and Confirm New Password don't match" });
      }
      // Generate salt and hash new password
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);

      // Update user's password
      await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } });

      // Send success response
      res.status(200).json({ status: "success", message: "Password reset successfully" });

    } catch (error) {
      return res.status(500).json({ status: "failed", message: "Unable to reset password. Please try again later." });
    }
  }



}

module.exports = new UsersController