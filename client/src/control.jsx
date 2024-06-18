import { Popup, Slider } from 'antd-mobile'
import {
  AppOutline,
  MessageOutline,
  MessageFill,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
import {
  PlayIcon,
  PauseIcon,
  VolumeIcon
} from './icon.jsx'
import { useEffect, useState } from 'react'
import {
  debounce
} from './utils.js'
export default function PlayerControl(props) {
  let [visible, setVisible] = useState(false)
  let [status, setStatus] = useState('pause')
  let r = {}
  new Array(21).fill(0).map((i, j) => {
    r[j * 5] = j * 5
  })
  let marks = r
  let volumeChange = debounce(function (e) {
    console.log(e)
    props.onChange({
      type: 'volume',
      value: e
    })
  }, 500)
  function handleAction(action) {
    setStatus(action)
    props.onChange({
      type: action
    })
  }
  useEffect(function () {
    setStatus(props.songTitle ? 'play' : 'pause')
  }, [
    props.songTitle
  ])
  return (
    <>
      <div
        className='bottom-bar'
      >
        {
          status === 'pause' ? <PlayIcon onClick={() => {
            handleAction('play')
          }} /> : <PauseIcon
            onClick={() => {
              handleAction('pause')
            }}
          />
        }
        <div
          className='song-title'
        >
          {props.songTitle || ''}
        </div>
        <VolumeIcon
          onClick={() => {
            setVisible(true)
          }}
        />
      </div>
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false)
        }}
        onClose={() => {
          setVisible(false)
        }}
        bodyStyle={{ height: '80px' }}
      >
        <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
        }}
        >
          <Slider style={{
            flex: 1
          }}
          onChange={volumeChange}
          marks={marks}
          ticks
          />
        </div>
      </Popup>
    </>
  )
}