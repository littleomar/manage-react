const axios = require('axios')
const dbConfig = require('./config')
const SHA1 = require('sha1')
let now = Date.now()
let appKey = SHA1(dbConfig.appId+"UZ"+dbConfig.appKey+"UZ"+now)+"."+now


const fetchApiData = (option) => {
  const config = Object.assign({},{
    methods: 'GET',
    headers: {
      "X-APICloud-AppId": dbConfig.appId,
      "X-APICloud-AppKey": appKey
    }
  },option)

  return new Promise((resolve, reject) => {
    axios(config).then(res=>{
      resolve(res.data)
    }).catch(reject)
  })
}


module.exports = fetchApiData
