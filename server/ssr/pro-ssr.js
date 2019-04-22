const Router = require('koa-router')
const path = require('path')
const fs = require('fs')




const router = new Router()
const bundle = require(path.resolve(__dirname,'../../dist/server.js'))
const template = fs.readFileSync(path.resolve(__dirname,'../../dist/server.template.ejs'),'utf8')
const renderFun = require('./render-fun')



router.all('*',async (ctx,next)=>{
  ctx.body = await renderFun(bundle,template,ctx)
})



module.exports = router
