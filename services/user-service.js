const userModel = require('../models/user')
const User = require('../models/user')
const { defineIdType } = require('./data-service');
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')

const bcrypt = require('bcrypt');

class UserService {
    async signup(id, password) {
        const candidate = await User.findOne({ id });
            if(candidate) {
              return `User: ${id} already exist. Please login!`
            }
            const hashPassword = await bcrypt.hash(password, 3);
            const id_type = defineIdType(id)
            const user = await User.create({
                id,
                id_type,
                password: hashPassword,
              });
            const userDto = new UserDto(user)
            const tokens = await tokenService.generateTokens({...userDto}) // unfold 
            await tokenService.saveToken(userDto.idUser, tokens.refreshToken)
            
            return tokens.refreshToken
    }

    async signin(id, password) {
        const user = await userModel.findOne({id})
        if(!user) {
            return `User with id: ${id} was not found. Please register!`
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals) {
            return 'Wrong password!'
        }
        const userDto = new UserDto(user)
        const tokens = await tokenService.generateTokens({...userDto}) // unfold 
        await tokenService.saveToken(userDto.idUser, tokens.refreshToken)
            
        return tokens.refreshToken
    }

    async logout(refreshToken, all) {
        if(!refreshToken) {
            return 'User not authorized'
          }

         if(all == 'true') {
            const tokenData = await tokenService.removeAllTokens()
            return "Succsesful logout all users!"
          } else if (all == 'false') {
            const token = await tokenService.removeToken(refreshToken)
            return "Succsesful logout current user!"
          } else {
            return `Param all: ${all} is wrong!`
          }
    }
}

module.exports = new UserService();