import request from 'axios'
import { Toast } from 'antd-mobile'

const StatusCode = {
    unauthorized: 401
}

let base = request.create({
    baseURL: '/api',
})
// base.interceptors.request.use((config) => {
//     config.headers['Authorization'] = `Bearer ${getToken()}`
//     return config
// })
base.interceptors.response.use((response) => {
    if (response.status === 200) {
        if (response.data.code === 200) {
            return response.data.data
        } else if(response.config.responseType === 'blob') {
            return response
        } else {
            if(response.data.code === StatusCode.unauthorized) {
                return
            }
            Toast.show({
                icon: 'fail',
                content: response.data.message || '请求失败'
            })
            return Promise.reject(response)
        }
    } else {
        message.error('请求失败')
        return Promise.reject(response)
    }
})

export function getDevice() {
    return base.get('/devices')
}
export function sendText(data) {
    return base.post('/sendtext', data)
}
export function useDevice(data) {
    return base.post('/devices/use', data)
}
export function dirInfo(data) {
    return base.get('/webdav/dir', { params: data })
}