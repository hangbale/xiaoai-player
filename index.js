// const xiaoai = require('xiaoai-tts')
import fs from 'fs'
import koa from 'koa'
import webdav from './webdav.js'
import routers from './router.js'
import xiaoai from './xiaoai.js'
import middleware from './middleware.js'
import { koaBody } from 'koa-body'

// let client = null

let xiaoaiUser = process.env.XIAOAI_USER
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
// if (!user || !password) {
//     console.error('请配置环境变量 XIAOAI_USER 和 XIAOAI_PASSWORD')
//     process.exit(1)
// }

// async function auth() {
//     try {
//         // 尝试读取本地 Session 信息
//         const Session = fs.readFileSync('./session', { encoding: 'utf8' })

//         // 通过 Session 登录
//         client = new xiaoai(JSON.parse(Session))
//     } catch (e) {
//         client = new xiaoai(user, password)

//         const Session = await client.connect()

//         // 将 Session 储存到本地
//         fs.writeFileSync('./session', JSON.stringify(Session))
//     }
// }

Promise.all([
    xiaoai.init(xiaoaiUser, xiaoaiPassword),
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


// async function main() {
//     // await auth()
//     // const ketingDevice = await client.getDevice('小爱音箱')
//     // client.useDevice(ketingDevice.deviceID)
//     // client.say('小九')
//     webdav.init(webdavHost, webdavUser, webdavPassword)
//     let files = await webdav.readDirectory('/one/tik')
//     console.log(files)
// }
// main()