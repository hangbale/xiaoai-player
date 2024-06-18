import xiaoai from "../xiaoai.js"
export default {
    deviceList: async function (ctx) {
        try {
            await xiaoai.client.test()
        } catch (error) {
            await xiaoai.auth()
        }
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
    },
    playControl: async function (ctx) {
        let { type } = ctx.request.body
        if (!type) {
            ctx.fail('参数错误')
            return
        }
        try {
            if(type === 'play') {
                await xiaoai.client.play()
            } else if(type === 'pause') {
                await xiaoai.client.pause()
            } else if(type === 'volume') {
                await xiaoai.client.setVolume(ctx.request.body.value)
            }
            ctx.success()
        } catch (error) {
            console.error('操作失败', error)
            ctx.fail('操作失败')
        }
    },
    getStaus: async function (ctx) {
        try {
            let status = await xiaoai.client.getStatus()
            console.log(status)
            ctx.success(status)
        } catch (error) {
            console.error('获取状态失败', error)
            ctx.fail('获取状态失败')
        }
    }
}