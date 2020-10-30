import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'

import './plugins/element.js'
import './assets/css/reset.css'
import './common/stylus/common.styl'
import './common/stylus/othcommon.styl'
import Service from './api/service'

Vue.prototype.$service = Service

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
