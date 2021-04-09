module.exports = {
  filenameHashing: false,
  chainWebpack: config => {
    // New
    // config.plugins.delete('html')
    // config.plugins.delete('preload')
    // config.plugins.delete('prefetch')

    // Old 
    const oneOfsMap = config.module.rule("scss").oneOfs.store;
    oneOfsMap.forEach(item => {
      item
        .use("sass-resources-loader")
        .loader("sass-resources-loader")
        .options({
          resources: ["./src/assets/sass/styles.scss"]
        })
        .end();
    });
  }
};
