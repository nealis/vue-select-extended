<template>
  <div class="jumbotron">
    <div class="container">
      <h1>Vue Select</h1>
      <p class="lead">A simple component that provides similar functionality to Select2 without the overhead of jQuery.</p>
      <a class="btn btn-primary" href="https://github.com/sagalbot/vue-select">View on GitHub</a>
    </div>
  </div>

    <div class="jumbotron" style="background: none;">
      <div class="row">
        <div class="col-md-6 col-md-offset-3">
          <v-select
            :placeholder="placeholder"
            :value.sync="select"
            :options="options[optionType]"
            :multiple="multiple">
          </v-select>
        </div>

        <!-- <div class="col-md-6">
          <h4>Output</h4>
          <pre>{{ select | json }}</pre>
        </div> -->
      </div>
    </div>

    <div id="app" class="container">
    <h4 class="page-header">Component Settings <small>play around with the above vue-select</small></h4>

    <div class="row">
      <div class="col-md-6">
        <label class="control-label">Allow Multiple</label>
        <div class="checkbox">
          <label class="control-label">
            <input v-model="multiple" type="checkbox"> True
          </label>
          <span class="help-block">Equivalent to the <code>multiple</code> attribute to a <code>&#x3C;select&#x3E;</code>. You'll want to clear any selections you have made before changing this option. It's not one that should be changed after render.</span>
        </div>

        <label class="control-label">Option Set Type</label><br>
        <div class="radio">
          <label for="advanced">
            <input id="advanced" type="radio" v-model="optionType" value="advanced"> Advanced <code>[{value: 'foo', label: 'Foo'}]</code>
          </label>

          <label for="simple">
            <input id="simple" type="radio" v-model="optionType" value="simple"> Simple <code>['foo', 'bar']</code>
          </label>
          <span class="help-block">The <code>options</code> property is watched for changes, and the value is reset anytime the options change. This is useful if you have multiple selection boxes that depend on its ancestors values.</span>
        </div>
      </div>

      <div class="col-md-6">

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
      </div>
    </div>

    <!-- <h3>Todos:</h3>
    <ul>
      <li>Fix layout issue where selected tags & text input overflow outside <code>.dropdown</code>.</li>
      <li>Clicking the 'caret' icon should toggle the dropdown.</li>
      <li>Add boolean prop to disable search.</li>
      <li>Add a 'simple' prop that disables search, and the selected 'tags'. Uses an active class on the selected item(s) while keeping the placeholder constant.</li>
    </ul> -->

    <h2 class="page-header">Installing</h2>
    <p><code>npm install sagalbot/vue-select</code></p>

    <h2 class="page-header">Usage</h2>
    <pre v-pre>
&#x3C;template&#x3E;
  &#x3C;div id=&#x22;myApp&#x22;&#x3E;
    &#x3C;v-select:value.sync=&#x22;selected&#x22; :options=&#x22;options&#x22;&#x3E;&#x3C;/v-select&#x3E;
  &#x3C;/div&#x3E;
&#x3C;/template&#x3E;

&#x3C;script&#x3E;
  import vSelect from &#x27;vue-select&#x27;
  export default {
    components: {vSelect},

    data() {
      return {
        selected: null,
        options: [&#x27;foo&#x27;,&#x27;bar&#x27;,&#x27;baz&#x27;]
      }
    }
  }
&#x3C;/script&#x3E;
    </pre>

    <h2 class="page-header">Contributing</h2>
    <h4>Build Setup <small>built using the <a href="https://github.com/vuejs-templates/webpack">vue-cli webpack template</a></small></h4>
    <p>install dependencies <br/><code>npm install</code></p>
    <p>serve with hot reload at localhost:8080 <br><code>npm run dev</code></p>
    <p>build for production with minification <br><code>npm run build</code></p>
    <p>lint all *.js and *.vue files <br><code>npm run lint</code></p>
    <p>run unit tests <br><code>npm test</code></p>

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
      select: null,
      placeholder: 'Choose a Country',
      multiple: true,
      maxHeight: '400px',
      options: {
        advanced: require('./countries.js'),
        simple: require('./simpleCountries.js'),
        simpler: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}, {label: 'This is Baz', value: 'baz'}]

      },
      optionType: 'advanced'
    }
  }
}
</script>
