    const User = require('../models/userModel')
    const bcrypt = require('bcryptjs')
    const {generateToken} = require('../utils/generateToken')
    const crypto = require('crypto');
    const nodemailer = require('nodemailer');

    const  sendEmail = require("../utils/sendEmail")

    const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);

const hashedPassword =
  await bcrypt.hash(password, salt);

const user = await User.create({
  name,
  email,
  password: hashedPassword,
});

    // EMAIL VERIFICATION TOKEN
    const verificationToken =
        crypto.randomBytes(32).toString("hex");

    user.verificationToken = verificationToken;

    user.verificationTokenExpire =
        Date.now() + 10 * 60 * 1000;

    await user.save();

    // VERIFY URL
    const verifyUrl =
    `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    

    // SEND EMAIL
    await sendEmail({
        email: user.email,

        subject: "Verify Your Email",

        message: `
        <h2>Email Verification</h2>

        <a href="${verifyUrl}">
            Verify Email
        </a>
        `,
    });

    res.status(201).json({
        success: true,
        message:
        "Registered successfully. Please verify email.",
    });
    };

    const loginUser = async(req,res)=>{
        try {
            const {email,password} = req.body;
        
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message:"Invalid email or pasword"
            })
        }
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid email or pasword"
            })
        }
        if (!user.isVerified) {
  return res.status(401).json({
    message: "Please verify your email first"
  });
}

        const token = generateToken(user);

        res.cookie("token",token,{
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
        message:"Login successful",

        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
            
        }
        });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    const logoutUser = async (req, res) => {

    res.cookie("token", "", {

        httpOnly: true,

        expires: new Date(0),

        sameSite: "lax",

        secure: false,
    })

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    })
    }

    const getProfile = async (req, res) => {

        res.status(200).json({
            user: req.user
        });
    };

    const forgotPassword = async(req,res)=>{
        try {
            const {email} = req.body

            const user = await User.findOne({email})

            if(!user){
                return res.status(404).json({
                    message:"user not found"
                })
            }

            const resetToken = crypto.randomBytes(32) .toString('hex');

            const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')

            user.resetPasswordToken = hashedToken

        

            user.resetPasswordExpire = Date.now()+10*60*1000
            
            await user.save()

            const resetUrl =

                `http://localhost:5173/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({

        service: 'gmail',

        auth: {

            user: process.env.EMAIL_USER,

            pass: process.env.EMAIL_PASS
        }
    });
            await transporter.sendMail({

                from: process.env.EMAIL_USER,

                to: user.email,

                subject: 'Password Reset',

                text: `Reset your password using this link: ${resetUrl}`
            });

            res.status(200).json({
                message: "Reset email sent"
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });
        }
    };

    const resetPassword = async (req, res) => {

        try {

            const { password } = req.body;


            // HASH TOKEN FROM URL

            const hashedToken = crypto

                .createHash('sha256')

                .update(req.params.token)

                .digest('hex');


            // FIND USER WITH VALID TOKEN

            const user = await User.findOne({

                resetPasswordToken: hashedToken,

                resetPasswordExpire: {

                    $gt: Date.now()
                }
            });


            // INVALID OR EXPIRED

            if (!user) {

                return res.status(400).json({

                    message: "Invalid or expired token"
                });
            }


            // HASH NEW PASSWORD

            const salt = await bcrypt.genSalt(10);

            const hashedPassword = await bcrypt.hash(password, salt);


            // SAVE NEW PASSWORD

            user.password = hashedPassword;


            // REMOVE RESET FIELDS

            user.resetPasswordToken = undefined;

            user.resetPasswordExpire = undefined;


            await user.save();


            res.status(200).json({

                message: "Password reset successful"
            });

        } catch (error) {

            res.status(500).json({

                message: error.message
            });
        }
    };

    const verifyEmail = async (req, res) => {

    try {

        const { token } = req.params;

        

        const user = await User.findOne({

        verificationToken: token,

        verificationTokenExpire: {
            $gt: Date.now(),
        },
        });

        if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired token",
        });
        }

        user.isVerified = true;

        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;

        await user.save();

        const jwtToken = generateToken(user._id);

res.cookie("token", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
});

        res.json({
        success: true,
        message: "Email verified successfully",
        user
        });

    } catch (error) {

        res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    };

    module.exports = {
        registerUser,
        loginUser,
        logoutUser,
        getProfile,
        forgotPassword,
        resetPassword,
        verifyEmail
    };