import Vue from 'vue'
import App from './App.vue'
import store from './vuex/store'
import 'prismjs'
import vSelect from '../src/components/Select.vue'

Vue.component('v-select', vSelect)

Vue.config.debug = true
Vue.config.devtools = true

import { setSelected, toggleMultiple, setPlaceholder, toggleOptionType } from './vuex/actions'


/* eslint-disable no-new */
new Vue({
  el: 'body',
  store,
  components: { App },
  vuex: {
    getters: {
      placeholder (store) {
        return store.placeholder
      },
      selected (store) {
        return store.selected
      },
      type (store) {
        return store.optionType
      },
      options (store) {
        return store.options[store.optionType]
      },
      multiple (store) {
        return store.multiple
      }
    },
    actions: { setSelected, toggleMultiple, setPlaceholder, toggleOptionType }
  }
})
