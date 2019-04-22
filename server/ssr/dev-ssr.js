const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')



const renderFun = require('./render-fun')
const serverConfig = require(path.resolve(__dirname,'../../build/webpack.server.config.js'))
const serverComplier = webpack(serverConfig)
const mfs = new MemoryFs()
serverComplier.outputFileSystem = mfs


const getTemplate = async () => (
  (await axios.get('http://127.0.0.1:8080/public/server.template.ejs')).data
)

let bundle = ''
serverComplier.watch( {}, ( errs, status )=>{
  if (errs) throw errs
  status = status.toJson()
  status.errors.forEach( error=> console.log(error) )
  status.warnings.forEach( warn=> console.log(warn) )
  bundle = eval(mfs.readFileSync(path.resolve(serverConfig.output.path,serverConfig.output.filename),'utf8'))
})


const router = new Router()

router.all('*',async (ctx,next)=>{
  const template = await getTemplate()
  ctx.body = await renderFun(bundle,template,ctx)
})


module.exports = router
