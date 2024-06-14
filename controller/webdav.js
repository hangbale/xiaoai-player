import webdav from "../webdav.js"
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
}