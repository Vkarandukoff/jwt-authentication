const userService = require('../services/user-service')

const { validationResult } = require('express-validator')

class authController {
    async signup(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: 'Registration error', errors})
            }
            const { id, password } = req.body;
            const token = await userService.signup(id, password)

            res.json(token)
        } catch (error) {
            console.log(error) 
        }
    }

    async signin(req, res, next) {
        try {
            const { id, password } = req.body;
            const token = await userService.signin(id, password)

            res.json(token)
        } catch (error) {
            
        }
    }

    async logout(req, res, next) {
        try {
            const refreshToken = req.headers.authorization.split(' ')[1];
            const all = req.query.all;

            const message = await userService.logout(refreshToken, all)
            
            res.json(message)
        } catch (error) {
            
        }
    }
}

module.exports = new authController()