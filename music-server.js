import koa from 'koa'
import middleware from './middleware.js'
import { koaBody } from 'koa-body'
import koaRouter from '@koa/router';
import execSh from 'exec-sh'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import serve from 'koa-static'
const exec = execSh.promise


let ALIST_WEBDAV = process.env.ALIST_WEBDAV
let ALIST_USER = process.env.ALIST_USER
let ALIST_PASSWORD = process.env.ALIST_PASSWORD

// 获取当前模块的文件路径
const __filename = fileURLToPath(import.meta.url);

// 获取当前模块的目录路径
const __dirname = dirname(__filename);

const router = new koaRouter();
const app = new koa()
middleware.forEach(f => {
    app.use(f)
})
app.use(koaBody())
console.log(__dirname)
app.use(serve(join(__dirname, 'music')))
function genDownloadCMD(itemPath) {
    let c = `wget --user=${ALIST_USER} --password=${ALIST_PASSWORD} -P ./music ${ALIST_WEBDAV}${itemPath}`
    return c
}

router.post('/file/download', async (ctx) => {
    let { path } = ctx.request.body
    if (!path) {
        ctx.fail('参数错误')
        return
    }
    let out
    try {
        out = await exec(genDownloadCMD(path))
        ctx.success({
            path
        })
    } catch (error) {
        console.log('Error: ', e);
        console.log('Stderr: ', e.stderr);
        console.log('Stdout: ', e.stdout);
        ctx.fail('下载文件失败')
    }
    console.log('out: ', out.stdout, out.stderr);
});

app.use(router.routes())


let port = process.env.port || 3004
app.listen(port, '0.0.0.0', () => {
    console.log(`server listening on port ${port}`)
})


