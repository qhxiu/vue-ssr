const Koa = require('koa')
const sned = require('send')
const path = require('path')
const koaBody = require('koa-body')
const koaSession = require('koa-session')

const staticRouter = require('./routers/static')
const apiRouter = require('./routers/api')
const userRouter = require('./routers/user')

const createDb = require('./db/db')
const config = require('../app.config')

const db = createDb(config.db.appId, config.db.appKey)

const app = new Koa()

app.keys = ['vue ssr tech']
// 在koa应用中用于记录请求者身份的常用中间件
app.use(koaSession({
  key: 'v-ssr-id',
  // 过期时间 2个小时
  maxAge: 2 * 60 * 60 * 1000
}, app))
const isDev = process.env.NODE_ENV === 'development'

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = 500
    if (isDev) {
      ctx.body = err.message
    } else {
      ctx.body = 'please try again later'
    }
  }
})

app.use(async (ctx, next) => {
  ctx.db = db
  await next()
})

// app.use(async (ctx, next) => {
//   if (ctx.path === '/favicon.ico') {
//     await sned(ctx, '/favicon.ico', { root: path.join(__dirname, '../') })
//   } else {
//     next()
//   }
// })

app.use(koaBody())
app.use(userRouter.routes()).use(userRouter.allowedMethods())
app.use(staticRouter.routes()).use(staticRouter.allowedMethods())
// 这样/api里开头的路由全部会到apiRouter里去处理
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())

let pageRouter
if (isDev) {
  pageRouter = require('./routers/dev-ssr')
} else {
  pageRouter = require('./routers/ssr')
}

app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3332

app.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST}:${PORT}`)
})
