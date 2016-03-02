<template>
  <div id="app" class="container">

    <h1>Vue Select</h1>
    <p class="lead">A simple component that provides similar functionality to Select2 without the overhead of jQuery.</p>

    <div class="row">
      <div class="col-md-6">

        <h3>Options</h3>
        <div class="checkbox">
        <label>
          <input v-model="multiple" type="checkbox"> Allow Multiple
        </label>
      </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <v-select
          placeholder="choose something"
          :value.sync="select"
          :options="options"
          :multiple="multiple">
        </v-select>
      </div>

      <div class="col-md-6">
        <pre><strong>Selected:</strong>{{ select | json }}</pre>
      </div>
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
      multiple: true,
      options: require('./countries.js')
    }
  }
}
</script>
