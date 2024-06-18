import {
    dirInfo,
    openFile
} from './api.js'
import { CascaderView, Toast } from 'antd-mobile'
import {
    useEffect,
    useState,
    useRef
} from 'react'
import { FolderOutline, FileOutline } from 'antd-mobile-icons'

function genOptionLabel(i) {
    return (
        <div>
            {i.type === 'directory' ? < FolderOutline color='var(--adm-color-primary)' /> : <FileOutline color='var(--adm-color-primary)' />}
            <span style={{
                marginLeft: 8
            }}>{i.basename}</span>
        </div>
    )
}

function allowClick(i) {
    let list = [
        'audio/mpeg',
        'audio/flac',
        'audio/ape'
    ]
    return i.type === 'directory' || list.includes(i.mime)
}

function genOptions(origin, keyPath, list) {
    if (!origin.length || !keyPath) {
        return list.map(i => {
            return {
                label: genOptionLabel(i),
                value: i.filename,
                children: [],
                disabled: !allowClick(i),
                type: i.type
            }
        })
    }
    let current = {
        children: origin
    }
    keyPath.forEach(item => {
        current = current.children.find(i => i.value === item)
    })
    current.children = list.map(i => {
        return {
            label: genOptionLabel(i),
            value: i.filename,
            children: [],
            disabled: !allowClick(i),
            type: i.type
        }
    })
    return origin
}



export default function Webdav(props) {
    let [options, setOptions] = useState([])
    let [value, setValue] = useState([])
    let [currentPath, setCurrentPath] = useState('/')
    let currentType = useRef('directory')
    console.log('renddddd')
    useEffect(function () {
        console.log('innnn')
        console.log(currentPath)
        if(currentType.current !== 'directory') {
            return
        }
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0
        })
        dirInfo({
            path: currentPath
        }).then(res => {
            console.log(res)
            setOptions(genOptions(options.slice(), value, res))
        }).finally(function () {
            Toast.clear()
        })
    }, [currentPath])
    function playMusic(path) {
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0
        })
        openFile({
            path
        }).then(res => {
            console.log(res)
            props.onFile(path)
            Toast.show({
                icon: 'success',
                content: '播放成功'
            })
        })
    }
    return (
        <div>
            <h4>播放音乐</h4>
            <div
            >
                <CascaderView
                    style={{ '--height': '400px' }}
                    options={options}
                    value={value}
                    onChange={(val, extend) => {
                       
                        setCurrentPath(val[val.length - 1])
                        let item = extend.items[extend.items.length - 1]
                        currentType.current = item.type
                        if(item.type === 'file') {
                            console.log('fffff')
                            playMusic(item.value)
                        } else {
                            setValue(val)
                        }
                    }}
                />
            </div>
        </div>
    )
}