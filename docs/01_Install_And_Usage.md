Install via NPM
```bash
npm install sagalbot/vue-select
```

To use the vue-select component in your templates, simply import it, and register it within your component.

```html
<template>
  <div>
    <v-select :value.sync="selected" :options="options"></v-select>
  </div>
</template>
<script>
  import vSelect from "vue-select"

  export default {
    components: {vSelect},

    data() {
      return {
        selected: null,
        options: ['foo','bar','baz']
      }
    }
  }
</script>
```

Alternatively, you can register the component globally. This is ideal if you are going to be using `vue-select` in multiple components.

```js
import Vue from 'vue'
import vSelect from 'vue-select'

Vue.component('v-select', vSelect)
```