const Router = require('koa-router')
const loginRouter = require('./login')
const CustomerRouter = require('./customer')
const GoodsRouter = require('./goods')
const StatisticRouter = require('./statistic')

const router = new Router({
  prefix: '/api'
})

loginRouter(router)

CustomerRouter(router)

GoodsRouter(router)

StatisticRouter(router)

module.exports = router
