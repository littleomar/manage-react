const Koa = require('koa')
const server = require('koa-static')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const mount = require('koa-mount')
const session = require('koa-session')
const cookiesMiddleware = require('universal-cookie-koa')
// const fs = require('fs')



const isDev = process.env.NODE_ENV === 'development'
const app = new Koa()



app.use(cookiesMiddleware())
app.use(bodyParser());
app.keys = ['stone']
app.use(session({
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 3 * 60 * 60 * 1000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: false, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
},app))
app.use(mount('/favicon.ico',app.use(server(path.resolve(__dirname,'../')))))

// const mime = JSON.parse(fs.readFileSync(path.resolve(__dirname,"../mime.json"),"utf8"))
const interfaceRouter = require('./interfaceNetWork')
app.use(interfaceRouter.routes()).use(interfaceRouter.allowedMethods())

if (!isDev) {
  app.use(mount('/public',app.use(server(path.resolve(__dirname,'../dist/')))))
  const devRouter = require('./ssr/pro-ssr')
  app.use(devRouter.routes()).use(devRouter.allowedMethods())
} else {
  const axios = require('axios')
  app.use(mount('/public',async (ctx,next)=>{
    ctx.type = ctx.request.url.substr(ctx.request.url.lastIndexOf('.')+1)
    ctx.body = (await axios.get(`http://127.0.0.1:8080/public/${ctx.request.url}`, {
      responseType: 'arraybuffer'
    })).data
  }))
  const ssrRouter = require('./ssr/dev-ssr')
  app.use(ssrRouter.routes()).use(ssrRouter.allowedMethods())
}



const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.listen(port,host,()=>{
  console.log(`the server render is listening ${host}:${port}`);
})
