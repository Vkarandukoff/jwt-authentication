const tokenService = require('./token-service')
const userModel = require('../models/user')
const UserDto = require('../dtos/user-dto')

class refreshService {
    async refresh(refreshToken) {
        if (!refreshToken) {
            return null
          }
          const userData = tokenService.validateRefreshToken(refreshToken)
          const tokenFromDb = await tokenService.findToken(refreshToken)
          if(!userData || !tokenFromDb) {
            return null
          }
          const user = await userModel.findById(userData.idUser)
          const userDto = new UserDto(user)
          const tokens = await tokenService.generateTokens({...userDto}) // unfold 
          await tokenService.saveToken(userDto.idUser, tokens.refreshToken)
          return tokens.refreshToken
    }
}

module.exports = new refreshService();