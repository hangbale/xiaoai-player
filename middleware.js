export default [
    async function resMiddleware(ctx, next) {
        ctx.success = function (data) {
            ctx.body = {
                code: 200,
                data,
                message: 'success'
            }
        }
        ctx.fail = function (message, code) {
            ctx.body = {
                code: code || 500,
                data: {},
                message: message || '操作失败'
            }
        }
        ctx.unauthorized = function () {
            ctx.body = {
                code: 401,
                data: {},
                message: '用户未登录'
            }
        }
        await next();
    }
]