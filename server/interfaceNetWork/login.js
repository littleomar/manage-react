const fetchApiData = require('./fetchFun')




module.exports = async (router) => {
  router.post('/login',async (ctx,next)=>{

    const { accessToken } = ctx.request.body

    let adminRes = await fetchApiData({url:`https://d.apicloud.com/mcm/api/admin?filter=${JSON.stringify({fields:"accessToken",where:{},skip:0,limit:20})}`})

    if (accessToken === adminRes[0].accessToken) {
      ctx.session.user = {
        isLogin: true
      }
      ctx.body = {
        code: 0,
        msg: 'login success'
      }
    } else {
      ctx.body = {
        code: 1,
        msg: 'access token wrong'
      }
    }
  })

  router.all('*',async (ctx,next)=>{
    if (ctx.session.user && ctx.session.user.isLogin) {
      await next()
    } else {
      ctx.body = {
        code: 2,
        msg: 'need login'
      }
    }
  })

  return router
}
