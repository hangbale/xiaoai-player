import {
    dirInfo
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

function genOptions(origin, keyPath, list) {
    if (!origin.length || !keyPath) {
        return list.map(i => {
            return {
                label: genOptionLabel(i),
                value: i.filename,
                children: [],
                disabled: i.type !== 'directory'
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
            disabled: i.type !== 'directory'
        }
    })
    return origin
}
export default function Webdav(props) {
    let [options, setOptions] = useState([])
    let [value, setValue] = useState([])
    let currentPath = useRef('/')
    useEffect(function () {
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0
        })
        dirInfo({
            path: currentPath.current
        }).then(res => {
            console.log(res)
            setOptions(genOptions(options.slice(), value, res))
        }).finally(function () {
            Toast.clear()
        })
    }, [currentPath.current])
    return (
        <div>
            <h4>网盘音乐</h4>
            <div
            >
                <CascaderView
                    style={{ '--height': '400px' }}
                    options={options}
                    value={value}
                    onChange={(val, extend) => {
                        setValue(val)
                        currentPath.current = val[val.length - 1]
                        console.log('onChange', val, extend.items)
                    }}
                />
            </div>
        </div>
    )
}