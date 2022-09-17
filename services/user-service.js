const tokenService = require("./token-service");
const userModel = require('../model/user')
const UserDto = require('../dtos/user-dto')

class UserService {
    defineIdType(id) {
        if(id.indexOf('@') != -1) {
            return 'Email'
        } else {
            return 'Phone'
        }
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            res.status(400).json({message: 'User not authorized'})
          }
          const userData = tokenService.validateRefreshToken(refreshToken)
          const tokenFromDb = await tokenService.findToken(refreshToken)
          if(!userData || !tokenFromDb) {
            res.status(400).json({message: 'User not authorized'})
          }
          const user = await userModel.findById(userData.idUser)
          const userDto = new UserDto(user)
            const tokens = await tokenService.generateTokens({...userDto}) // unfold 
            await tokenService.saveToken(userDto.idUser, tokens.refreshToken)
            return tokens.refreshToken
    }
}

module.exports = new UserService();