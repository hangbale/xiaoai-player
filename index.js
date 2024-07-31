import koa from 'koa'
import webdav from './webdav.js'
import routers from './router.js'
import xiaoai from './xiaoai.js'
import middleware from './middleware.js'
import { koaBody } from 'koa-body'
import miiot from './miiot.js'
// let client = null

let xiaoaiUserId = process.env.XIAOAI_USER_ID
let xiaoaiPassword = process.env.XIAOAI_PASSWORD
let webdavHost = process.env.WEBDAV_HOST
let webdavUser = process.env.WEBDAV_USER
let webdavPassword = process.env.WEBDAV_PASSWORD

const app = new koa()
middleware.forEach(f => {
    app.use(f)
})
app.use(koaBody())

app.use(routers.routes())
if (!xiaoaiUserId || !xiaoaiPassword) {
    console.error('请配置环境变量 XIAOAI_USER 和 XIAOAI_PASSWORD')
    process.exit(1)
}



Promise.all([
    miiot.init(xiaoaiUserId, xiaoaiPassword),
    webdav.init(webdavHost, webdavUser, webdavPassword)
]).then(() => {
    console.log('init success')
    let port = process.env.port || 3003
    app.listen(port, '0.0.0.0', () => {
        console.log(`server listening on port ${port}`)
    })
}).catch(err => {
    console.error('init failed', err)
})



