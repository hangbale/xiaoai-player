import { getMiIOT, getMiNA } from "mi-service-lite";

const USE_PLAY_MUSIC_API = [
    "LX04",
    "L05B",
    "L05C",
    "L06",
    "L06A",
    "X08A",
    "X10A",
]

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
        console.log(this.clinet)
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
    // 部分设备的音乐播放api不一样
    // https://github.com/yihong0618/MiService/blob/57fdc6f18d214c3a6e09b684b80a81f00066ebf6/miservice/minaservice.py#L163
    // mi-service-lite库中写死的"mediaplayer", "player_play_url"
    // 小爱音箱paly增强版要用 "mediaplayer", "player_play_music",
    speakerPlayOnlineMusic: async function(url) {
        if(!this.minaClient) {
            await this.initMina()
        }
        if(USE_PLAY_MUSIC_API.includes(this.minaClient.account.device.hardware)) {
            console.log('ffd')
            console.log(this.minaClient.ubus)
            let d = genMusicPostData(url)
            console.log(d)
            this.minaClient.ubus('mediaplayer', 'player_play_music', d)
        } else {
            this.minaClient.play({
                url
            })
        }
    }
}

function genMusicPostData(url) {
    return {
        startaudioid: '1582971365183456177',
        music: {
            payload: {
                audio_type: 'MUSIC', // MUSIC 灯会亮
                audio_items: [
                    {
                        item_id: {
                            audio_id: '1582971365183456177',
                            cp: {
                                album_id: -1,
                                episode_index: 0,
                                id: '355454500',
                                name: 'xiaowei',
                            },
                        },
                        stream: {url: url},
                    }
                ],
                list_params: {
                    listId: -1,
                    loadmore_offset: 0,
                    origin: 'xiaowei',
                    type: 'MUSIC',
                },
            },
            play_behavior: 'REPLACE_ALL',
        }
    }
}