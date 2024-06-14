const sessionPath = './session'
import xiaoai from 'xiaoai-tts'
import fs from 'fs'
export default {
    userinfo: {
        user: null,
        password: null
    },
    client: null,
    currentDevice: null,
    auth: async function() {
        try {
            // 尝试读取本地 Session 信息
            const Session = fs.readFileSync(sessionPath,
                { encoding: 'utf8' }
            )
    
            // 通过 Session 登录
            this.client = new xiaoai(JSON.parse(Session))
        } catch (e) {
            this.client = new xiaoai(this.userinfo.user, this.userinfo.password)
    
            const Session = await this.client.connect()
    
            // 将 Session 储存到本地
            fs.writeFileSync(sessionPath, JSON.stringify(Session))
        }
    },
    getClient: async function() {
        if (this.client) {
            return this.client
        }
        await this.auth()
        return this.client
    },
    useDevice: async function(deviceName) {
        if (this.currentDevice && deviceName === this.currentDevice.name) {
            return
        }
        const client = await this.getClient()
        try {
            let d = await client.getDevice(deviceName)
            this.currentDevice = d
            this.client.useDevice(d.deviceID)
        } catch (error) {
            console.error('获取设备失败', error)
        }
    },
    init : async function(user, password, deviceName) {
        this.userinfo = {
            user: user,
            password: password
        }
        try {
            await this.auth()
            if(deviceName) {
                await this.useDevice(deviceName)
            }
        } catch (error) {
            console.error('初始化失败', error)
            throw error
        }
    },
    switchDevice: async function(deviceName) {
        await this.useDevice(deviceName)
    },
}