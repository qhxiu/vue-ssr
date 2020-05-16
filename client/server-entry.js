import createApp from './create-app'

export default context => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-unused-vars
    const { app, router, store } = createApp()
    router.push(context.url)
    router.onReady(() => {
      // 得到匹配到的组件
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new Error('no component matched'))
      }
      Promise.all(matchedComponents.map(Component => {
        // 判断组件是否有asyncData这个方法
        if (Component.asyncData) {
          return Component.asyncData({
            route: router.currentRoute,
            router,
            store
          })
        }
      })).then(data => {
        console.log(store.state)
        context.meta = app.$meta()
        resolve(app)
      })
    })
  })
}
