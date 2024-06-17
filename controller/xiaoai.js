import xiaoai from "../xiaoai.js"
export default {
    deviceList: async function (ctx) {
        try {
            let d = await xiaoai.client.getDevice()
            ctx.success(d.map((i, j) => {
                return {
                    name: i.name,
                    alias: i.alias,
                    presence: i.presence,
                    active: j === 0
                }
            }))
        } catch (error) {
            console.error('获取设备失败', error)
            ctx.fail('获取设备失败')
        }
    },
    sendText: async function (ctx) {
        let { text } = ctx.request.body
        if (!text) {
            ctx.fail('参数错误')
            return
        }
        try {
            await xiaoai.client.say(text)
            ctx.success()
        } catch (error) {
            console.error('发送消息失败', error)
            ctx.fail('发送消息失败')
        }
    },
    useDevice: async function (ctx) {
        let { deviceName } = ctx.request.body
        if (!deviceName) {
            ctx.fail('参数错误')
            return
        }
        try {
            await xiaoai.switchDevice(deviceName)
            ctx.success()
        } catch (error) {
            console.error('切换设备失败', error)
            ctx.fail('切换设备失败')
        }
    }
}