import webdav from "../webdav.js"
import xiaoai from "../xiaoai.js"
export default {
    dirInfo: async function (ctx) {
        let { path } = ctx.query
        if (!path) {
            ctx.fail('参数错误')
            return
        }
        try {
            let d = await webdav.readDirectory(path)
            ctx.success(d)
        } catch (error) {
            console.error('获取目录失败', error)
            ctx.fail('获取目录失败')
        }
    },
    openFile: async function (ctx) {
        let { path } = ctx.request.body
        if (!path) {
            ctx.fail('参数错误')
            return
        }
        try {
            // await axios.post(`${process.env.MUSIC_SERVER}/file/download`, { path })
            let onlineMusicPath = `${process.env.MUSIC_SERVER}${path}`
            console.log('onlineMusicPath', onlineMusicPath)
            xiaoai.client.playUrl(encodeURIComponent(onlineMusicPath)).then(res => {
                console.log('res', res)
            })
            ctx.success({
                path
            })
        } catch (error) {
            console.error('打开文件失败', error)
            ctx.fail('打开文件失败')
        }
    }
}