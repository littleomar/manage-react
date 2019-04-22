const fetchApiData = require('./fetchFun')
const moment = require('moment')


const prefix = '/statistic'

module.exports = (router) => {
  router.get(`${prefix}/last`,async ctx=>{
    let startDate = moment().subtract(30,'d').format("YYYY-MM-DD")
    let endDate = moment().format("YYYY-MM-DD")
    const respData = {}

    for (let i = 0; i < 30; ++i ) {
      let date = moment().subtract(30-i,'d').format("YYYY-MM-DD")
      respData[date] = 0
    }


    let sellCountRes = await fetchApiData({url:`https://d.apicloud.com/mcm/api/goodsells?filter=${JSON.stringify({limit:999999,fields:["count","buyTime","totalMeter"],where:{and: [{buyTime: {gte:startDate}}, {buyTime: {lt:endDate}}]}})}`})

    let tempObj = {}
    sellCountRes.map(sell=>{
      // console.log(parseInt(((parseFloat(sell.totalMeter) || 0) * 100) / 2.4));
      if (sell.buyTime in tempObj) {
        tempObj[sell.buyTime] += parseInt(sell.count || 0) * 100 + parseInt(((parseFloat(sell.totalMeter) || 0)  * 100)/2.4)
      } else {
        tempObj[sell.buyTime] = parseInt(sell.count || 0) * 100 + parseInt(((parseFloat(sell.totalMeter) || 0)  * 100)/2.4)
      }
    })

    Object.keys(tempObj).forEach((key)=>{
      respData[key] = tempObj[key]/100
    })

    ctx.body = respData

  })


  router.get(`${prefix}/everyType`,async ctx=>{
    let { month } = ctx.request.query
    const respData = {}

    let startDate = moment(month).startOf('month').format("YYYY-MM-DD")
    let endDate = moment(month).endOf('month').format("YYYY-MM-DD")

    let sellCountRes = await fetchApiData({url:`https://d.apicloud.com/mcm/api/goodsells?filter=${JSON.stringify({limit:999999,fields:["count","name","totalMeter"],where:{and: [{buyTime: {gte:startDate}}, {buyTime: {lte:endDate}}]}})}`})


    let tempObj = {}
    sellCountRes.map(sell=>{
      // console.log(parseInt(((parseFloat(sell.totalMeter) || 0) * 100) / 2.4));
      if (sell.name in tempObj) {
        tempObj[sell.name] += parseInt(sell.count || 0) * 100 + parseInt(((parseFloat(sell.totalMeter) || 0)  * 100)/2.4)
      } else {
        tempObj[sell.name] = parseInt(sell.count || 0) * 100 + parseInt(((parseFloat(sell.totalMeter) || 0)  * 100)/2.4)
      }
    })

    let typeRes = await fetchApiData({url:`https://d.apicloud.com/mcm/api/goodtypes?filter=${JSON.stringify({where:{},skip:0,limit:999,fields:["id","typeName"]})}`})

    let typeObj = {}
    typeRes.map(type=>{
      typeObj[type.id] = type.typeName
    })


    let kindRes = await fetchApiData({url:`https://d.apicloud.com/mcm/api/goodkinds?filter=${JSON.stringify({where:{},skip:0,limit:999,fields:["id","type"]})}`})

    let kindObj = {}
    kindRes.map(kind=>{
      kindObj[kind.id] = kind.type
    })


    let resObj = {}
    Object.keys(tempObj).forEach((key)=>{
      if (typeObj[kindObj[key]] in resObj) {
        resObj[typeObj[kindObj[key]] ] += tempObj[key]
      } else {
        resObj[typeObj[kindObj[key]] ] = tempObj[key]
      }
    })

    Object.keys(resObj).forEach(key=>{
      respData[key] = resObj[key] /100
    })



    ctx.body = respData





    //
    // ctx.body = respData



  })



  return router
}
