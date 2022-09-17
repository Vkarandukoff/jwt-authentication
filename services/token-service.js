const jwt = require('jsonwebtoken');
const tokenModel = require('../model/token');
const user = require('../model/user');

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

    validateAccessToken(token) {
      try {
        const userData = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
        return userData
      } catch (error) {
        return null
      }
    }

    validateRefreshToken(token) {
      try {
        const userData = jwt.verify(token, process.env.REFRESH_TOKEN_KEY)
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