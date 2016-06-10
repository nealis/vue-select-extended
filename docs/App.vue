<style lang="scss">
  @import 'assets/scss/_demo.scss';
  @import 'assets/scss/_cyan_theme.scss';
  @import 'assets/scss/_prism.scss';
  @import 'assets/scss/_octicons.scss';
</style>

<template>
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

export default {
  components: { Params, Install }
}
</script>
