服务器端渲染(SSR)能够更好的SEO，方便搜索引擎爬虫工具可以直接查看完全渲染的页面

### CSR和SSR的区别

**CSR**一般由静态服务器(CDN)等直接返回HTML资源，之后浏览器解析加载HTML、加载CSS(CSS加载结束后页面会尽快进行首屏渲染FP)、加载JS资源，JS依赖加载结束后，Vue实例初始化，拉取页面数据，页面渲染

**SSR**由nodejs服务器来直出页面，请求到达后，后端拉取cgi接口数据，根据直出的bundle文件生成render对象，render对象将执行客户端代码构建VDOM，生成HTML string，填充进模版HTML，返回HTML资源，浏览器解析后加载CSS、JS资源(CSS加载结束后触发FP和FMP)，Vue实例初始化，接管后端直出的HTML，页面可响应

**SSR的缺陷**

1. 对服务器要求更高，本来是通过客户端完成渲染，现在统一到服务端node服务去做。尤其是高并发访问的情况，会大量占用服务端CPU资源
2. 由于cgi拉取和vdom直出后才吐出HTML页面，FMP虽然提前了，但是FP相对延迟了
3. 相比CSR，SSR渲染后，由于仍然需要进行依赖、vue初始化，页面可交互时间并没有较大改善

### 构建流程

这是一张构建图，图片来源于官网

![构建图](/Users/qianhongxiu/WebstormProjects/vue-ssr-tech/client/assets/images/构建图.jpg)

1. `app.js` -> `client/create-app.js`

   构建一个Vue的实例以供服务端和客户端使用

2. `Server entry` -> `client/server-entry.js`

   路由的跳转并匹配组件

3. `Client entry` -> `client/client-entry.js`

   挂载Vue实例到指定的dom元素上

4. `Server Bundle ` -> `build/webpack.config.server.js`

   打包要通过`node`生成预渲染`HTML`字符串的文件

5. `Client Bundle` -> `build/webpack.config.client.js`

   