import { getMiIOT, getMiNA } from "mi-service-lite";

export default {
    clinet: null,
    userInfo: {},
    speakerList: [],
    currentDid: null,
    minaClient: null,
    init: async function(userId, password) {
        this.userInfo = {
            userId,
            password
        }
        this.client = await getMiIOT(this.userInfo);
    },
    initMina: async function() {
        this.minaClient = await getMiNA({
            ...this.userInfo,
            did: this.currentDid
        })
    },
    getDeviceList: async function() {
        if (!this.client) {
            console.log('未初始化')
            this.init()
        }
        return this.client.getDevices()
    },
    getXiaoAiSpeaker: async function() {
        let devices = await this.getDeviceList()
        let device = devices.filter(d => d.model.includes('wifispeaker'))
        this.speakerList = device
        return device
    },
    switchDevice: async function(did) {
        this.currentDid = did
        this.clinet = await getMiIOT({
            ...this.userInfo,
            did
        })
        this.minaClient = null
    },
    doAction: async function(siid, aiid, params) {
        return this.client.doAction(siid, aiid, params)
    },
    setProperty: async function(siid, piid, value) {
        return this.client.setProperty(siid, piid, value)
    },
    getProperty: async function(siid, piid) {
        return this.client.getProperty(siid, piid)
    },
    speakerSayText: async function(text) {
        await this.doAction(5, 3, text)
    },
    speakerPlayControl: async function(type) {
        let action = {
            play: [3, 2],
            pause: [3, 3],
            stop: [3, 4],
            pre: [3, 5],
            next: [3, 6]
        }
        await this.doAction(...action[type])
    },
    speakerVolumeControl: async function(num) {
        await this.setProperty(2, 1, num)
    },
    getSpeakerPlayStatus: async function() {
        return this.getProperty(3, 1)
    },
    speakerPlayOnlineMusic: async function(url) {
        if(!this.minaClient) {
            this.initMina()
        }
        this.minaClient.play({
            url
        })
    }
}