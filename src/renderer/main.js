import Vue from 'vue'
import axios from 'axios'
import Vuetify from 'vuetify'

import 'roboto-fontface/css/roboto-condensed/roboto-condensed-fontface.css'
import 'vuetify/dist/vuetify.css'
import '@/assets/magfont/style.css'

import App from './App'
import router from './router'
import store from './store'

import Rx from 'rxjs/Rx'
import VueRx from 'vue-rx'
import RxFsm from '@/plugins/rx-fsm'

Vue.use(VueRx, Rx)
Vue.use(RxFsm)

Vue.use(Vuetify)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
