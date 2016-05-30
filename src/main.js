import Vue from 'vue'
import App from './App.vue'
import store from './vuex/store'
import 'prismjs'

// Vue.config.debug = true
Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  el: 'body',
  store,
  components: { App }
})
