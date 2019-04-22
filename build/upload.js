const qiniu = require('qiniu')
const path = require('path')
const fs = require('fs')

const mimeFile = fs.readFileSync(path.resolve(__dirname,'../mime.json'),'utf8')
const mime = JSON.parse(mimeFile)

const cdnConfig = require('../app.config').cdn

const { ak, sk, bucket } = cdnConfig
const mac = new qiniu.auth.digest.Mac(ak,sk)






const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z1;
const formUploader = new qiniu.form_up.FormUploader(config);

const fileRes = fs.readdirSync(path.resolve(__dirname,'../dist'))

const excludeFiles = [
  'server.ejs',
  'server-entry.js',
  'template.html'
]


const uploadFile = (key) => {
  const extr = key.substr(key.lastIndexOf(".")+1)
  const options = {
    scope: bucket+':'+key,
    callbackBodyType: mime[extr]
  }
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken=putPolicy.uploadToken(mac);
  const putExtra = new qiniu.form_up.PutExtra();
  formUploader.putFile(uploadToken, key, path.resolve(__dirname,`../dist/${key}`), putExtra, function(respErr, respBody, respInfo) {
    if (respErr) {
      throw respErr;
    }
    if (respInfo.statusCode === 200) {
      console.log(respBody);
    } else {
      console.log(respInfo.statusCode);
      console.log(respBody);
    }
  })
}


fileRes.map( fileName => {
  if (excludeFiles.indexOf(fileName) === -1) {
    uploadFile(fileName)
  }
})
