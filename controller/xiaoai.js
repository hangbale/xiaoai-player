import xiaoai from "../miiot.js"
export default {
    deviceList: async function (ctx) {
        try {
            let d = await xiaoai.getXiaoAiSpeaker()
            ctx.success(d.map((i, j) => {
                return {
                    name: i.name,
                    did: i.did,
                    active: xiaoai.currentDid === i.did
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
            await xiaoai.speakerSayText(text)
            ctx.success()
        } catch (error) {
            console.error('发送消息失败', error)
            ctx.fail('发送消息失败')
        }
    },
    useDevice: async function (ctx) {
        let { did } = ctx.request.body
        if (!did) {
            ctx.fail('参数错误')
            return
        }
        try {
            await xiaoai.switchDevice(did)
            ctx.success()
        } catch (error) {
            console.error('切换设备失败', error)
            ctx.fail('切换设备失败')
        }
    },
    playControl: async function (ctx) {
        let { type, value } = ctx.request.body
        if (!type) {
            ctx.fail('参数错误')
            return
        }
        try {
            if(type === 'volume') {
                await xiaoai.speakerVolumeControl(value)
            } else {
                await xiaoai.speakerPlayControl(type)
            }
            ctx.success()
        } catch (error) {
            console.error('操作失败', error)
            ctx.fail('操作失败')
        }
    },
    getStaus: async function (ctx) {
        try {
            let status = await xiaoai.getSpeakerPlayStatus()
            ctx.success(status)
        } catch (error) {
            console.error('获取状态失败', error)
            ctx.fail('获取状态失败')
        }
    }
}