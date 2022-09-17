const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check, oneOf} = require('express-validator')


router.post('/signup',
[
    check('password', 'Password cannot be empty').notEmpty(),
    check('id', 'Id cannot be empty').notEmpty(),
    oneOf([
        check('id', 'Id is not email').isEmail(),
        check('id', 'Id is not phone').isMobilePhone()
    ])
],
 controller.signup);
router.post('/signin', controller.signin)
router.get('/logout', controller.logout)
router.get('/info', controller.info)
router.get('/latency', controller.latency)

module.exports = router