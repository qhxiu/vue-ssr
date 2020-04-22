console.log(111)
module.exports = (isDev) => {
  return {
    // 去掉html空格
    preserveWhitepace: true,
    // vue文件的css单独打包
    extractCss: !isDev,
    cssModules: {
      localIndentName: '[path]-[name]-[hash:base64:5]',
      camelCase: true,
      module: true
    }
  }
}