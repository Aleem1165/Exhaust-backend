const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/auth')
const isAuth = require('../middleware/isAuth')
const getAllProduct = require('../controllers/getAllProduct')

router.post('/signup', authControllers.signup , getAllProduct)
router.post('/signin', authControllers.signin , getAllProduct)
router.post('/forgotPasswordOtp', authControllers.forgotPasswordOtp)
router.post('/changePassword', isAuth, authControllers.changePassword)
router.post('/checkExistingEmail', authControllers.checkExistingEmail)
router.post('/resetPassword', authControllers.resetPassword)


module.exports = router