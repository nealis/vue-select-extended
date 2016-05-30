<style lang="scss">
  @import 'assets/scss/_demo.scss';
  @import 'assets/scss/_cyan_theme.scss';
  @import 'assets/scss/_prism.scss';
  @import 'assets/scss/_octicons.scss';
</style>

<template>
  <div class="jumbotron jumbotron-top">
    <div class="container">
      <div class="col-md-8 col-md-offset-2">

        <h1>Vue Select</h1>

        <p class="accolades lead">
          <a href="https://travis-ci.org/sagalbot/vue-select"><img src="https://img.shields.io/travis/sagalbot/vue-select.svg?style=flat-square" alt="Build Status"></a>
          <a href="https://codeclimate.com/github/sagalbot/vue-select"><img src="https://img.shields.io/codeclimate/github/sagalbot/vue-select.svg?style=flat-square" alt="Code Climate Rating"></a>
          <a href="https://codeclimate.com/github/sagalbot/vue-select"><img src="https://img.shields.io/codeclimate/coverage/github/sagalbot/vue-select.svg?style=flat-square" alt="Code Coverage"></a>
          <a href="https://gemnasium.com/github.com/sagalbot/vue-select"><img src="https://img.shields.io/gemnasium/sagalbot/vue-select.svg?style=flat-square" alt="No Dependencies"></a>
          <img src="https://img.shields.io/github/license/sagalbot/vue-select.svg?style=flat-square" alt="MIT License">
          <img src="https://img.shields.io/github/release/sagalbot/vue-select.svg?style=flat-square" alt="Current Release">
        </p>

        <p class="lead">A well-tested, native Vue.js select component that provides similar functionality to Select2/Chosen without the overhead of jQuery.</p>

        <v-select
          id="v-select"
          taggable
          :placeholder="placeholder"
          :value="selected"
          :options="options"
          :multiple="multiple"
          :on-change="setSelected"
        >
        </v-select>

        <div class="row">
          <div class="col-md-3 col-md-offset-3">
            <ul class="list-vue">
              <li>Fully Reactive</li>
              <li>Tagging Support <small>v1.1.0</small></li>
              <li>Works with Vuex</li>
              <li>Zero dependencies</li>
            </ul>
          </div>
          <div class="col-md-3">
            <ul class="list-vue">
              <li>+90% Test Coverage</li>
              <li>Select Single/Multiple</li>
              <li>Typeahead Suggestions</li>
              <li>Bootstrap Friendly Markup</li>
            </ul>
          </div>
        </div>

        <a class="btn btn-primary btn-outline" href="https://github.com/sagalbot/vue-select"><span class="octicon octicon-mark-github"></span> View on GitHub</a>
      </div>
    </div>
    <a href="#install" class="down-arrow">
      Install, Examples &amp; Documentation
      <i role="presentation" class="glyphicon glyphicon-chevron-down"></i>
    </a>
  </div>

  <div class="container">
    <div class="col-md-10 col-md-offset-1">
      <install></install>
      <params></params>
    </div>
  </div>
</template>

<script type="text/babel">

/**
 * Note that this file (and anything other than src/components/Select.vue)
 * has nothing to do with how you use vue-select. These files are used
 * for the demo site at http://sagalbot.github.io/vue-select/. They'll
 * be moved out of this repo in the very near future to avoid confusion.
 */

import Install from './components/Install.vue'
import Params from './components/Params.vue'
import vSelect from './components/Select.vue'
import { setSelected, toggleMultiple, setPlaceholder, toggleOptionType } from './vuex/actions'

export default {
  components: { Params, Install, vSelect },

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
    },
    methods: {
      onPlaceholderChange ( e ) {
        this.setPlaceholder( e.target.value )
      }
    }
}
</script>
