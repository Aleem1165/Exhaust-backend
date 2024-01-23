const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path');
const otpGenerator = require('otp-generator');
const sendEmail = require('../helper/handleNodemailer')

require('dotenv').config()

exports.signup = async (req, res, next) => {
    const { name, email, password, profile, location, countryCode, number } = req.body
    try {
        if (!name || !email || !password || !profile || !location || !countryCode || !number) {
            return res.json({ success: false, message: "*All field required." })
        }
        const validateEmail = (email) => {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(email);
        };
        if (!validateEmail(email)) {
            return res.json({ success: false, message: "*Email not valid." })
        }
        if (!(password.length >= 8)) {
            return res.json({ success: false, message: "*Password must be at least 8 characters." })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: "*This email already exist.Try another email." })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            profile,
            countryCode,
            number,
            location,
            cart: [],
            cards: [],
            shippingAddress: [],
            orders: [],
        })

        const userData = { ...newUser._doc };
        delete userData.password;

        const obj = {
            email: newUser.email,
            _id: newUser._id
        }
        const jwtSecret = process.env.JWT_SECRET
        const token = await jwt.sign(obj, jwtSecret)
        req.data = {
            userData,
            token
        }
        next()
        // return res.json({ success: true, message: 'New user created.', userData, token })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue try again later.', error })
    }
}

exports.signin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.json({ success: false, message: "*Email and password required." })
        }
        const validateEmail = (email) => {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(email);
        };
        if (!validateEmail(email)) {
            return res.json({ success: false, message: "*Email not valid." })
        }

        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.json({ success: false, message: "*User not found." })
        }

        const hashPassword = existingUser.password
        const checkPass = await bcrypt.compare(password, hashPassword)

        if (!checkPass) {
            return res.json({ success: false, message: "*Incorrect password." })
        }

        const userData = { ...existingUser._doc };
        delete userData.password;

        const obj = {
            email: existingUser.email,
            _id: existingUser._id
        }
        const jwtSecret = process.env.JWT_SECRET
        const token = await jwt.sign(obj, jwtSecret)
        req.data = {
            userData,
            token
        }
        next()
        // return res.json({ success: true, message: 'Signin successfully.', userData, token })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue try again later.' })
    }
}

exports.changePassword = async (req, res, next) => {
    const _id = req._id
    const { password } = req.body
    if (!password) {
        return res.json({ success: false, message: "*Password required." })
    }
    if (!(password.length >= 8)) {
        return res.json({ success: false, message: "*Password must be at least 8 characters." })
    }
    // const userdata = await User.findOne({_id})
    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const changePassword = await User.findByIdAndUpdate(
            { _id },
            { password: hashPassword },
        )
        return res.json({ success: true, message: 'Password changed.' })
    } catch (error) {
        // return res.json({ success: false, message: '*Server issue try again later.', error })
        return res.status(500).json({ success: false, message: '*Server issue, try again later.', error: error.message });
    }
}

exports.forgotPasswordOtp = async (req, res, next) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.json({ success: false, message: '*Email required.' });
        }

        const validateEmail = (email) => {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(email);
        };

        if (!validateEmail(email)) {
            return res.json({ success: false, message: "*Email not valid." });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.json({ success: false, message: '*User not found.' });
        }

        const htmlFilePath = path.join(__dirname, '../html/forgotPasseordEmail.html');
        const subject = 'Exhaust Forgot Password Request';

        const otp = otpGenerator.generate(4, {
            lowerCaseAlphabets: false,
            specialChars: false,
            upperCaseAlphabets: false,
        });

        await sendEmail(email, subject, htmlFilePath, otp);

        return res.json({ success: true, message: 'Forgot password email sent.', otp });
    } catch (error) {
        console.error(error, "error api=-=-=-=-");
        return res.json({ success: false, message: 'Email sending failed.', error: error.message });
    }
};

exports.checkExistingEmail = async (req, res, next) => {
    try {
        const { email, password, name, phone, location } = req.body
        if (!name || !email || !password || !phone || !location) {
            return res.json({ success: false, message: '*All fields are required.' })
        }
        if (!email || !password) {
            return res.json({ success: false, message: '*Please enter your email and password to proceed.' })
        }
        const validateEmail = (email) => {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(email);
        };
        if (!validateEmail(email)) {
            return res.json({ success: false, message: "*Please enter a valid email address." })
        }
        const existingEmail = await User.findOne({ email })
        if (!existingEmail) {
            if (!(password.length >= 8)) {
                return res.json({ success: false, message: "*Password must be at least 8 characters." })
            }
            return res.json({ success: true, message: 'This email is available.' })
        }
        return res.json({ success: false, message: `*This email already exist. Please try another email.` })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue try again later.', error })
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email) {
            return res.json({ success: false, message: '*Email required.' })
        }
        if (!password) {
            return res.json({ success: false, message: '*password required.' })
        }
        if (!(password.length >= 8)) { 
            return res.json({ success: false, message: "*Password must be at least 8 characters." })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const updatePassword = await User.findOneAndUpdate(
            { email },
            { password:hashPassword }
        )
        return res.json({ success: true, message: 'Password updated.' })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue try again later.', error })
    }
}

