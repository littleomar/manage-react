const {renderToString, renderToStaticMarkup} = require('react-dom/server')

const ejs = require('ejs')
const { SheetsRegistry, createGenerateClassName } = require('react-jss')
const Helemt = require('react-helmet').default



const getStoreState = stores => {
  return Object.keys(stores).reduce((result,storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  },{})
}

module.exports = async (bundle,template,ctx) => {
  const sheets = new SheetsRegistry()
  const bundleFun = bundle.default
  const createStoreMap = bundle.createStoreMap
  const createClassName = new createGenerateClassName()
  const stores = createStoreMap()
  const context = {}

  const bundleApp = bundleFun(sheets,context,ctx.request.url,stores,createClassName,ctx.request.universalCookies)
  const appString = await renderToString(bundleApp)
  const helmet = Helemt.renderStatic()
  if (context.url) {
    ctx.redirect(context.url)
  }
  return ejs.render(template,{
    appString,
    styles: sheets.toString(),
    title: helmet.title.toString(),
    script: helmet.script.toString(),
    meta: helmet.meta.toString(),
    link: helmet.link.toString(),
    initState: JSON.stringify(getStoreState(stores))
  })
}
