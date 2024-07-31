import { useState, useEffect, useCallback } from 'react'
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
  useDevice,
  playControl,
  getStatus
} from './api.js'
import Webdav from './webdav.jsx'
import Control from './control.jsx'
function App() {
  let [activeKey, setActiveKey] = useState('')
  let [deviceList, setDeviceList] = useState([])
  let [currentFile, setCurrentFile] = useState('')
  useEffect(function () {
    getDevice().then(function (data) {
      if(data) {
        setDeviceList(data)
        setActiveKey('' + data.findIndex(i => i.active))
      }
    })
    getStatus().then(function (data) {
      console.log(data)
    })
  }, [])
  function submitForm(v) {
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
    useDevice({
      did: d.did
    }).then(res => {
      Toast.show({
        icon: 'success',
        content: '切换成功'
      })
    
    })
  }
  function controlChange(e) {
    playControl(e).then(res => {
      Toast.show({
        icon: 'success',
        content: '操作成功'
      })

    })
  }
  let onFile = useCallback(function (path) {
    let s = path.split('/').pop()
    setCurrentFile(s)
  }, [])
  return (
    <div>
      <h4
        style={{
          marginBottom: 0
        }}
      >设备列表</h4>
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
      <h4>发消息</h4>
      <Form
        style={{
          marginTop: 24
        }}
        footer={
          <Button block type='submit' color='primary' size='large'>
            发送
          </Button>
        }
        onFinish={submitForm}
      >
        {/* <Form.Header>发消息</Form.Header> */}
        <Form.Item name='text' label='消息内容'
          rules={[
            { required: true, message: '请输入消息' }
          ]}
        >
          <TextArea
            placeholder='请输入消息'
            maxLength={30}
            rows={2}
            showCount
          />
        </Form.Item>
      </Form>
      <Webdav
        onFile={onFile}
      />
      {/* <SafeArea position='bottom' /> */}
      <Control
          songTitle={currentFile}
        onChange={controlChange}
      />
    </div>
  )
}

export default App
