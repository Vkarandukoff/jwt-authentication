const Router = require('express')
const router = new Router()
const dataController = require('../controllers/dataController')

router.get('/info', dataController.info)
router.get('/latency', dataController.latency)

module.exports = router