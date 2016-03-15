<template>
  <div class="jumbotron jumbotron-green">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-md-offset-1">

          <v-select
            id="v-select"
            :placeholder="placeholder"
            :value.sync="select"
            :options="options[optionType]"
            :multiple="multiple">
          </v-select>

        </div>

        <pre id="output" class="col-md-4">{{ select | json }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
  import vSelect from './Select.vue'

  export default {
    components: { vSelect },

    data() {
      return {
        select: null,
        placeholder: 'Choose a Country',
        multiple: true,
        maxHeight: '400px',
        options: {
          advanced: require('../countries/countries.js'),
          simple: require('../countries/simpleCountries.js'),
          simpler: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}, {label: 'This is Baz', value: 'baz'}],
        },
        optionType: 'simple'
      }
    }
  }
</script>
