const dataService = require('../services/data-service')
const request = require('request')

class dataController {
    async info(req, res, next) {
        try {
            const refreshToken = req.headers.authorization.split(' ')[1];
            const message = await dataService.info(refreshToken)
            
            res.json(message) 
        } catch (error) {
            console.log(error)
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
        })
      }
}

module.exports = new dataController()