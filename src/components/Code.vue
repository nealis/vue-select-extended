<template>
<code :class="class"><slot></slot></code>
</template>

<script type="text/babel">
  export default {
    props: ['lang'],
    computed: {
      class () {
        return `language-${this.lang}`
      }
    }
  }
</script>