const Router = require('koa-router')

const userRouter = new Router({ prefix: '/user' })

userRouter.post('/login', async ctx => {
  const user = ctx.request.body
  if (user.username === 'karin' && user.password === '123') {
    // 登录成功了设置session，koa-session会把这部分信息写到session里面去，这是一个叫json-web-token的东西，然后会给这部分数据加一个签名，签名会根据app.keys进行加密，然后cookie下一次请求带过来的时候会根据keys然后写在里面的数据再进行一次加密，加密后跟设置的cookie签名进行对比，对比成功后代表这个cookie是可用的，就可以通过认证
    ctx.session.user = {
      username: 'karin'
    }
    ctx.body = {
      success: true,
      data: {
        username: 'karin'
      }
    }
  } else {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: 'username or password error'
    }
  }
})

module.exports = userRouter
