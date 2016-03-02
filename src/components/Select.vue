<style scoped>
  .dropdown-toggle {
    display: block;
    padding: 0;
    max-width: 100%;
    background: none;
    text-align: left;
  }

  .dropdown-toggle:hover,
  .dropdown-toggle:active,
  .dropdown-toggle:focus,
  .open .dropdown-toggle:hover,
  .open .dropdown-toggle:active,
  .open .dropdown-toggle:focus {
    background: none;
    border-color: #337ab7;
  }

  .open .dropdown-toggle {
    background: none;
    border-color: #337ab7;
    border-bottom: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .dropdown-menu {
    margin: 0;
    max-height: 400px;
    overflow-y: scroll;
    border-top: none;
    border-color: #337ab7;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .alert {
    margin: 0;
    margin-left: .25em;
    padding: .25em;
  }

  .alert .close {
    float: none;
    margin-right: 0;
    font-size: 20px;
  }

  input[type=search] {
    display: inline-block;
    border: none;
    outline: none;
    margin: 0;
    width: 100%;
    background: none;
    position: relative;
  }

  input[type=search]:focus {
    box-shadow: none;
  }

  input[type=search].inline {
    width: auto;
  }

  .dropdown-toggle:after {
    display: block;
    /*width: 10px;
    height: 10px;*/
    position: absolute;
    top: 10px;
    right: 10px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    content: "\e114";
    transition: all .25s;
  }

  .open .dropdown-toggle:after {
    transform: rotate(180deg);
  }

  .form-control {
    border: none;
  }

  li a {
    cursor: pointer;
  }

  .highlight a,
  .active.highlight a {
    background: rgba(50,50,50,.1);
    color: #333;
  }
</style>

<template>
  <div class="dropdown" :class="{open: open, }">
    <div v-el:toggle @click="toggleDropdown" class="btn btn-default dropdown-toggle clearfix" type="button">
        <span class="form-control" v-if="! searchable && placeholder && ! selected.length">
          {{ placeholder }}
        </span>

        <span class="alert alert-info" v-for="option in value">
          {{ getOptionLabel(option) }}
          <button v-if="multiple" @click="select(option)" type="button" class="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </span>

        <input
          @keydown.delete="maybeDeleteValue"
          @keydown.esc="onEscape"
          @keydown.up.prevent="typeAheadUp"
          @keydown.down.prevent="typeAheadDown"
          @keydown.enter.prevent="typeAheadSelect"
          v-bind:placeholder="searchPlaceholder"
          class="form-control"
          :class="{inline: selected.length}"
          v-el:search type="search"
          v-show="searchable"
          v-model="search"
        >
    </div>

    <ul v-if="open" :style="{width: dropdownWidth + 'px'}" :transition="transition" class="dropdown-menu animated">
      <li v-for="option in filteredOptions" :class="{ active: value.indexOf(option.value) !== -1, highlight: $index === typeAheadPointer }">
        <a @mousedown.prevent="select(option)">
          {{ getOptionLabel(option) }}
        </a>
      </li>
      <li transition="fade" v-if="!filteredOptions.length" class="divider"></li>
      <li transition="fade" v-if="!filteredOptions.length" class="text-center">Sorry, no matching options.</li>
    </ul>
  </div>
</template>


<script>
  export default {

    props: {
      value: {
        twoway: true,
        required: true
      },
      searchable: {
        type: Boolean,
        default: true
      },
      multiple: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: null
      },
      transition: {
        type: String,
        default: 'expand'
      },
      options: {
        type: Array,
        default() { return [] },
      },
      ajax: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        search: '',
        open: false,
        typeAheadPointer: -1,
      }
    },

    ready() {
      this.$watch('open', function(open) {
        if( open ) {
          this.$els.search.focus();
        } else {
          this.$els.search.blur();
          this.typeAheadPointer = 0;
        }
      });
    },

    methods: {
      select(v) {
          if (this.value.indexOf(v) === -1) {
            if (this.multiple) {
              this.value.push(v)
            } else {
              this.value = [v]
            }
          } else {
            if (this.multiple) {
              this.value.$remove(v)
            }
          }

          if (!this.multiple) {
            this.open = !this.open
          }
      },

      toggleDropdown( e ) {
        if( e.target == this.$els.toggle || e.target == this.$els.search ) {
          this.open = !this.open
        }
      },

      getOptionValue( option ) {
        if( typeof option === 'object' && option.value ) {
          return option.value;
        }

        return option;
      },

      getOptionLabel( option ) {
        if( typeof option === 'object' && option.label ) {
          return option.label;
        }

        return option;
      },

      typeAheadUp() {
        if (this.typeAheadPointer > 0) this.typeAheadPointer--
      },

      typeAheadDown() {
        if (this.typeAheadPointer < this.filteredOptions.length - 1) this.typeAheadPointer++
      },

      typeAheadSelect() {
        var option = this.filteredOptions[ this.typeAheadPointer ];
        this.select( this.getOptionValue(option) );
        this.search = "";
      },

      onEscape() {
        if( ! this.search.length ) {
          this.open = false
        } else {
          this.$set('search', '')
        }
      },

      maybeDeleteValue() {
        if( ! this.$els.search.value.length ) {
          this.value.pop();
        }
      }
    },

    computed: {
      selected() {
        let foundItems = []
        if (this.value.length) {
          for (let item in this.value) {
            if (typeof this.value[item] === "string") {
              foundItems.push(this.value[item])
            }
          }
        }

        return foundItems
      },

      searchPlaceholder() {
        if( ! this.value.length && this.placeholder ) {
          return this.placeholder;
        }
      },

      dropdownWidth() {
        return this.$els.toggle.offsetWidth
      },

      filteredOptions() {
        return this.$options.filters.filterBy(this.options, this.search)
      }
    }

  }
</script>
