<template>
  <div id="app" class="container">

    <h1>Vue Select</h1>

    <div class="row">
      <div class="col-md-6">
        <v-select placeholder="choose something" :value.sync="select" :options="options" :multiple="true"></v-select>
      </div>

      <pre class="col-md-6">{{ select | json }}</pre>

    </div>
  </div>
</template>

<script>
import vSelect from './components/Select.vue'

export default {
  components: {vSelect},

  data() {
    return {
      select: [],
      options: require('./countries.js')
    }
  }
}
</script>
