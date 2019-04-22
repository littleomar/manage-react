const fetchApiData = require('./fetchFun')


const prefix = '/customer'

module.exports = (router) => {
  router.get(`${prefix}/info`,async ctx=>{
    const { skip, id, filter } = ctx.request.query
    const where = {}
    id ? where.id = id : ""
    if (filter) {
      let userRes = await fetchApiData({url:`https://d.apicloud.com/mcm/api/customers?filter=${JSON.stringify({limit:999999})}`})
      ctx.body = userRes.filter((user) => {
        return user.username.indexOf(filter) >= 0
      })
      return false
    }
    ctx.body = await fetchApiData({url:`https://d.apicloud.com/mcm/api/customers?filter=${JSON.stringify({limit:10,skip:parseInt(skip),where})}`})
  })


  router.get(`${prefix}/count`,async ctx=>{
    ctx.body = (await fetchApiData({url: `https://d.apicloud.com/mcm/api/customers/count?filter={"where":{}}`})).count
  })


  router.delete(`${prefix}/delete`, async ctx => {
    await fetchApiData({
      method: 'DELETE',
      url: `https://d.apicloud.com/mcm/api/customers/${ctx.request.query.id}`
    })
    ctx.body = {
      message: 'delete success'
    }
  })

  router.post(`${prefix}/modify`,async ctx => {
    let { id,username,region,telephone } = ctx.request.body

    await fetchApiData({
      method: 'PUT',
      url: `https://d.apicloud.com/mcm/api/customers/${id}`,
      data: {
        username,
        region,
        telephone
      }
    })

    ctx.body = {
      message: 'modify success'
    }
  })

  router.post(`${prefix}/addUser`,async ctx => {
    await fetchApiData({
      url: `https://d.apicloud.com/mcm/api/customers`,
      method: "POST",
      data: ctx.request.body
    })

    ctx.body = {
      message: 'add success'
    }
  })

  return router
}
