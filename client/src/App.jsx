import { useState, useEffect } from 'react'
import {
  CapsuleTabs,
  Form,
  Button,
  TextArea,
  Toast,
  SafeArea
} from 'antd-mobile'
import {
  getDevice,
  sendText,
  useDevice
} from './api.js'
import Webdav from './webdav.jsx'
function App() {
  let [activeKey, setActiveKey] = useState('0')
  let [deviceList, setDeviceList] = useState([])
  useEffect(function () {
    getDevice().then(function (data) {
      if(data) {
        setDeviceList(data)
      }
    })
  }, [])
  function submitForm(v) {
    console.log(v)
    sendText({
      text: v.text
    }).then(res => {
      Toast.show({
        icon: 'success',
        content: '发送成功'
      })
    })
  }
  function onDeviceChange(key) {
    let d = deviceList[key]
    console.log(d)
    useDevice({
      deviceName: d.name
    }).then(res => {
      Toast.show({
        icon: 'success',
        content: '切换成功'
      })
    
    })
  }
  return (
    <div>
      <h4>设备列表</h4>
      <CapsuleTabs
        activeKey={activeKey}
        onChange={(key) => {
          onDeviceChange(key)
          setActiveKey(key)
        }}
      >
        {
          deviceList.map((i, j) => {
            return <CapsuleTabs.Tab title={i.name} key={j} />
          })
        }
      </CapsuleTabs>

      <Form
        style={{
          marginTop: 24
        }}
        footer={
          <Button block type='submit' color='primary' size='large'>
            提交
          </Button>
        }
        onFinish={submitForm}
      >
        <Form.Header>发消息</Form.Header>
        <Form.Item name='text' label='消息'
          rules={[
            { required: true, message: '请输入消息' }
          ]}
        >
          <TextArea
            placeholder='请输入消息'
            maxLength={100}
            rows={2}
            showCount
          />
        </Form.Item>
      </Form>
      <Webdav />
      <SafeArea position='bottom' />
    </div>
  )
}

export default App
