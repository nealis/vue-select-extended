<template>
<p>Install from GitHub via NPM</p>
      <pre><v-code lang="bash">npm install sagalbot/vue-select</v-code></pre>

      <p>To use the vue-select component in your templates, simply import it, and register it with your component.</p>
<pre><v-code lang="markup">&#x3C;template&#x3E;
  &#x3C;div id=&#x22;myApp&#x22;&#x3E;
    &#x3C;v-select :value.sync=&#x22;selected&#x22; :options=&#x22;options&#x22;&#x3E;&#x3C;/v-select&#x3E;
  &#x3C;/div&#x3E;
&#x3C;/template&#x3E;
&#x3C;script&#x3E;</v-code>
<v-code lang="javascript">import vSelect from "vue-select"
  export default {
    components: {vSelect},

    data() {
      return {
        selected: null,
        options: ['foo','bar','baz']
      }
    }
  }
&#x3C;/script&#x3E;</v-code>
</pre>
</template>
<script type="text/babel">
import vCode from '../Code.vue'
export default {
  components: {vCode}
}
</script>