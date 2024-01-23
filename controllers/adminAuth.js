const Admin = require('../models/admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res, next) => {
    const { name, email, password, profile } = req.body
    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const createAdmin = await Admin.create({
            name,
            email,
            password: hashPassword,
            profile
        })
        return res.json({ success: true, message: 'Admin created.', adminData: createAdmin })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue try again later.', error })
    }
}

exports.signin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.json({ success: false, message: "*All field required." })
        }
        const validateEmail = (email) => {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(email);
        };
        if (!validateEmail(email)) {
            return res.json({ success: false, message: "*Email not valid." })
        }
        const existingUser = await Admin.findOne({ email })
        if (!existingUser) {
            return res.json({ success: false, message: "*Not found." })
        }
        const hashPassword = existingUser.password
        const checkPass = await bcrypt.compare(password, hashPassword)
        if (!checkPass) {
            return res.json({ success: false, message: "*Incorrect password." })
        }
        const obj = {
            email: existingUser.email,
            _id: existingUser._id
        }
        const expiresIn = '6h';
        const jwtSecret = process.env.JWT_SECRET
        const token = await jwt.sign(obj, jwtSecret, { expiresIn })
        return res.json({ success: true, message: 'Signin successfully.', adminData: existingUser, token })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: '*Server issue try again later.', error })
    }
}
