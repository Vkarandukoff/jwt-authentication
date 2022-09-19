const userModel = require('../models/user')
const tokenService = require('./token-service')
const refreshService = require('./refresh-service')

const jwt = require('jsonwebtoken')

class DataService {
    defineIdType(id) {
        if(id.indexOf('@') != -1) {
            return 'Email'
        } else {
            return 'Phone'
        }
    }

    async info(refreshToken) {
        if(!refreshToken) {
            return 'User not authorized!'
          }
        const { idUser } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY)
        const userData = await userModel.findById(idUser)

        const updateToken = await refreshService.refresh(refreshToken)

        return {id: userData.id, id_type: userData.id_type, newToken: updateToken}           
    }
}

module.exports = new DataService();