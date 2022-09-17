const { defineIdType } = require('./services/user-service');
const { validationResult } = require('express-validator')
const tokenService = require('./services/token-service')
const userService = require('./services/user-service')
const tokenModel = require('./model/token');
const UserDto = require('./dtos/user-dto')
const userModel = require('./model/user')
const token = require('./model/token');
const User = require('./model/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const request = require('request')
const bcrypt = require('bcrypt')

class authController {  
    async signup(req, res) {
      try {
        const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: 'Registration error', errors})
            }
            const { id, password } = req.body;
            const candidate = await User.findOne({ id });
            if(candidate) {
              return res.status(409).send(`User: ${id} Already Exist. Please Login`);
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
            res.status(201).json(tokens.refreshToken);
      } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Error'});
      }
    }

    async signin(req, res) {
      try {
        const { id, password } = req.body
        const user = await userModel.findOne({id})
        if(!user) {
            res.status(400).json({message: `User with id: ${id} was not found. Please register!`});
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals) {
            res.status(400).json({message: 'Wrong password'});
        }
        const userDto = new UserDto(user)
            const tokens = await tokenService.generateTokens({...userDto}) // unfold 
            await tokenService.saveToken(userDto.idUser, tokens.refreshToken)
            res.status(201).json(tokens.refreshToken);
      } catch (error) {
        res.status(400).json({message: 'Error'});
        console.log(error)  
      }
    }

    async logout(req, res) {
      try {
        const refreshToken = req.headers.authorization.split(' ')[1];
        if(!refreshToken) {
          res.status(400).json({message: 'User not authorized'})
        }
        const all = req.query.all;
        if(all == 'true') {
          const allUsers = await tokenModel.deleteMany({})
          res.status(200).json({message: "Succsesful logout all users!", all: allUsers})
        } else if (all == 'false') {
          const token = await tokenService.removeToken(refreshToken)    
          res.status(200).json({message: "Succsesful logout current user!", token: token})
        } else {
          res.status(400).json({message: `Param all: ${all} is wrong!`})
        }
      } catch (e) {
          console.log(e)
          res.status(400).json({message: 'Logout error!'})
      }
    }   

    async info(req, res) {
      try {
        const refreshToken = req.headers.authorization.split(' ')[1];
      if(!refreshToken) {
        res.status(400).json({message: 'User not authorized!'})
      }
      const { idUser } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY)
      const userData = await userModel.findById(idUser)
      const updateToken = await userService.refresh(refreshToken) //update refreshToken!!!
      res.status(200).json({id: userData.id, id_type: userData.id_type})
      } catch (error) {
        console.log(error)
          res.status(400).json({message: 'Failed to get information!'})
      }
    }

    latency(req, res) {
      request({
        uri: 'https://www.google.com',
        method: 'GET',
        time: true
      }, (err, resp) => {
        const latency = Math.round(resp.timings.connect)
        res.status(200).send(`Service server latency for google.com = ${latency} ms.`)
        console.log(err || resp.timings.connect)
      })
    }
  }
  
module.exports = new authController()