const { defineConfig } = require('@vue/cli-service')
const config = require('./public/config');
module.exports = defineConfig({
  transpileDependencies: true,
  
})
//console.log(config);
// module.exports = {
//   devServer: {
//     host: config.environment.apiUrlHost,
//     port: config.environment.apiUrlPort, 
//   },
// }



