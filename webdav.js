import { createClient } from 'webdav'

export default  {
    hostinfo: {
        host: null,
        user: null,
        password: null
    },
    client: null,
    init: function(host, user, password) {
        this.hostinfo = {
            host: host,
            user: user,
            password: password
        }
        this.connect()
    },
    connect: async function() {
        this.client = createClient(
            this.hostinfo.host,
            {
                username: this.hostinfo.user,
                password: this.hostinfo.password
            }
        )
    },
    readDirectory: async function(path) {
        try {
            return await this.client.getDirectoryContents(path)
        } catch (error) {
            console.error('读取目录失败', error)
        }
    }
}