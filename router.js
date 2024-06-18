import koaRouter from '@koa/router';
const router = new koaRouter();
import xiaoai from './controller/xiaoai.js';
import webdav from './controller/webdav.js';
router.get('/devices', xiaoai.deviceList);
router.post('/sendtext', xiaoai.sendText);
router.post('/devices/use', xiaoai.useDevice);
router.get('/webdav/dir', webdav.dirInfo);
router.post('/webdav/file/play', webdav.openFile);
router.post('/play/control', xiaoai.playControl);
router.get('/device/status', xiaoai.getStaus);

export default router