# vue-select

Rather than bringing in jQuery just to use Select2 or Chosen, this Vue.js component provides similar functionality without the extra overhead of jQuery.

## Demo
[http://sagalbot.github.io/vue-select/](http://sagalbot.github.io/vue-select/)

## Install / Usage
``` bash
$ npm install sagalbot/vue-select
```

```
<template>
   <div id="myApp">
      <v-select :value.sync="selected" :options="options"></v-select>
   </div>
</template>

<script>
import vSelect from 'vue-select'
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

## Todos:
- fix layout issues with multiple selections
	- tags overflow outside `.dropdown`
	- search input overflows outside `.dropdown`
- `search` prop should be optional
- `simple` prop that disables `search` and keeps a static `placeholder` regardless of current selection (useful for things like icon button dropdowns)
- less opinionated styles / only include css necessary to acheive layout (no colors, etc)
- ability to pre-select options when using `[{label: 'Foo', value: 'foo'}]` syntax (already works with `['foo','bar','baz']` syntax
- more tests!!


## Build Setup for Contributing

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production without minification
npm run build

# build for production with minification
npm run uglify

# lint all *.js and *.vue files
npm run lint

# run unit tests
npm test
```

For more information see the [docs for vueify](https://github.com/vuejs/vueify).
