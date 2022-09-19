const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token');
const userModel = require('../models/user')
const UserDto = require('../dtos/user-dto')

class TokenService {
    async generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {expiresIn: '10m'})
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {expiresIn: '10m'})
        return {
          accessToken,
          refreshToken
        }
      }

      async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId})
        if (tokenData) {
          tokenData.refreshToken = refreshToken
          return tokenData.save()
        }
        const token = await tokenModel.create({user: userId, refreshToken})
        return token
      }

      async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData
      }

      async removeAllTokens() {
        const tokenData = await tokenModel.deleteMany({})
        return tokenData
      }

      validateRefreshToken(refreshToken) {
        try {
          const userData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY)
          return userData
        } catch (error) {
          return null
        }
      }
  
      async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData
      }
}

module.exports = new TokenService();