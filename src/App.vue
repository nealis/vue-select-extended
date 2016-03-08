<template>
  <div id="app" class="container">

    <h1>Vue Select</h1>
    <p class="lead">A simple component that provides similar functionality to Select2 without the overhead of jQuery.</p>

    <hr>

    <div class="row">
      <div class="col-md-6">
        <v-select
          :placeholder="placeholder"
          :value.sync="select"
          :options="options"
          :multiple="multiple">
        </v-select>
      </div>

      <div class="col-md-6">
        <pre><strong>Selected:</strong>{{ select | json }}</pre>
      </div>
    </div>

    <hr>

    <div class="row">
      <div class="col-md-6">
        <h4>Todos:</h4>
        <ul>
          <li>Fix layout issue where selected tags & text input overflow outside <code>.dropdown</code>.</li>
          <li>Clicking the 'caret' icon should toggle the dropdown.</li>
          <li>Add boolean prop to disable search.</li>
          <li>Add a 'simple' prop that disables search, and the selected 'tags'. Uses an active class on the selected item(s) while keeping the placeholder constant.</li>
        </ul>
      </div>

      <div class="col-md-6">
        <h4>Component Props</h4>

        <div class="form-group">
          <label class="control-label">Max Height</label>
          <input type="text" v-model="maxHeight" class="form-control">
          <span class="help-block">Limit the height of the dropdown menu.</span>
        </div>

        <div class="form-group">
          <label class="control-label">Placeholder</label>
          <input type="text" v-model="placeholder" class="form-control">
          <span class="help-block">Equivalent to the <code>placeholder</code> attribute.</span>
        </div>


        <div class="checkbox">
          <label class="control-label">
            <input v-model="multiple" type="checkbox"> Multiple
          </label>
          <span class="help-block">Equivalent to the <code>multiple</code> attribute to a <code>&#x3C;select&#x3E;</code></span>
        </div>

        <div class="form-group">

        </div>
      </div>
    </div>

    <hr>

    <h3>Build Setup</h3>


      <h5>install dependencies</h5>
      <p><code>npm install</code></p>

      <h5>serve with hot reload at localhost:8080</h5>
      <p><code>npm run dev</code></p>

      <h5>build for production with minification</h5>
      <p><code>npm run build</code></p>

      <h5>lint all *.js and *.vue files</h5>
      <p><code>npm run lint</code></p>

      <h5>run unit tests</h5>
      <p><code>npm test</code></p>


  </div>
</template>

<script>
import Vue from 'vue'
import vSelect from './components/Select.vue'

Vue.config.debug = true

export default {
  components: {vSelect},

  data() {
    return {
      // select: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}],
      select: ['one'],
      placeholder: 'Choose a Country',
      multiple: true,
      maxHeight: '400px',
      // options: require('./countries.js')
      options: ['one','two','three']
      // options: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}, {label: 'This is Baz', value: 'baz'}]
    }
  }
}
</script>
