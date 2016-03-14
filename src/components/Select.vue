<style scoped>
  .dropdown {
    position: relative;
  }

  .open .dropdown-toggle,
  .open .dropdown-menu {
    border-color: rgba(60,60,60,.26);
  }

  .open-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    display: inline-block;
    cursor: pointer;
    pointer-events: all;
    transition: all 150ms cubic-bezier(1.000, -0.115, 0.975, 0.855);
    transition-timing-function: cubic-bezier(1.000, -0.115, 0.975, 0.855);
  }

  .open .open-indicator {
    transform: rotate(180deg);
  }

  .dropdown-toggle {
    display: block;
    padding: 0;
    background: none;
    border: 1px solid rgba(60,60,60,.26);
    border-radius: 4px;
    white-space: normal;
  }
  .searchable .dropdown-toggle {
    cursor: text;
  }

  .open .dropdown-toggle {
    border-bottom: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .dropdown-menu {
    margin: 0;
    width: 100%;
    overflow-y: scroll;
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .selected-tag {
    color: #333;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    height: 26px;
    margin: 4px 1px 0px 3px;
    padding: 0 0.25em;
    float: left;
    line-height: 1.7em;
  }

  .selected-tag .close {
    float: none;
    margin-right: 0;
    font-size: 20px;
  }

  input[type=search],
  input[type=search]:focus {
    display: inline-block;
    border: none;
    outline: none;
    margin: 0;
    width: 10em;
    max-width: 100%;
    background: none;
    position: relative;
    box-shadow: none;
    float: left;
    clear: none;
  }

  input[type=search]:disabled {
    cursor: pointer;
  }

  li a {
    cursor: pointer;
  }

  .active a {
    background: rgba(50,50,50,.1);
    color: #333;
  }

  .highlight a,
  li:hover a {
    background: #f0f0f0;
    color: #333;
  }
</style>

<template>
  <div class="dropdown" :class="cssClasses">
    <div v-el:toggle @mousedown.prevent="toggleDropdown" class="dropdown-toggle clearfix" type="button">
        <span class="form-control" v-if="!searchable && isValueEmpty">
          {{ placeholder }}
        </span>

        <span class="selected-tag" v-for="option in valueAsArray">
          {{ getOptionLabel(option) }}
          <button v-if="multiple" @click="select(option)" type="button" class="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </span>

        <input
          v-el:search
          v-show="searchable"
          v-model="search"
          @keydown.delete="maybeDeleteValue"
          @keydown.esc="onEscape"
          @keydown.up.prevent="typeAheadUp"
          @keydown.down.prevent="typeAheadDown"
          @keydown.enter.prevent="typeAheadSelect"
          @blur="open = false"
          @focus="open = true"
          type="search"
          class="form-control"
          :placeholder="searchPlaceholder"
        >

        <i v-el:open-indicator role="presentation" class="open-indicator glyphicon-chevron-down glyphicon"></i>
    </div>

    <ul v-show="open" v-el:dropdown-menu :transition="transition" :style="{ 'max-height': maxHeight }" class="dropdown-menu animated">
      <li v-for="option in filteredOptions" :class="{ active: isOptionSelected(option), highlight: $index === typeAheadPointer }" @mouseover="typeAheadPointer = $index">
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
      options: {
        type: Array,
        default() { return [] },
      },
      maxHeight: {
        type: String,
        default: '400px'
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
        default: ''
      },
      transition: {
        type: String,
        default: 'expand'
      },
      clearSearchOnSelect: {
        type: Boolean,
        default: true
      },
      label: {
        type: String,
        default: 'label'
      }
    },

    data() {
      return {
        search: '',
        open: false,
        typeAheadPointer: -1,
      }
    },

    watch: {
      options() {
        this.$set('value', this.multiple ? [] : null)
      },
      multiple( val ) {
        this.$set('value', val ? [] : null)
      },
      filteredOptions() {
        this.typeAheadPointer = 0;
      }
    },

    methods: {
      select(option) {
          if (! this.isOptionSelected(option) ) {
            if (this.multiple) {

              if( ! this.value ) {
                  this.$set('value', [option])
              } else {
                this.value.push(option)
              }

            } else {
              this.value = option
            }
          } else {
            if (this.multiple) {
              this.value.$remove(option)
            }
          }

          if (!this.multiple) {
            this.open = !this.open
          }

          if( this.clearSearchOnSelect ) {
            this.search = ''
          }
      },

      /**
       * Toggle the visibility of the dropdown menu.
       * @param  {Event} e
       * @return {void}
       */
      toggleDropdown( e ) {
        if( e.target === this.$els.openIndicator || e.target === this.$els.search || e.target === this.$els.toggle || e.target === this.$el ) {
          if( this.open ) {
            this.$els.search.blur() // dropdown will close on blur
          } else {
            this.open = true
            this.$els.search.focus()
          }
        }
      },

      isOptionSelected( option ) {
        if( this.multiple && this.value ) {
          return this.value.indexOf(option) !== -1
        }

        return this.value === option;
      },

      getOptionValue( option ) {
        if( typeof option === 'object' && option.value ) {
          return option.value;
        }

        return option;
      },

      /**
       * Generate the option label text. If {option}
       * is an object, return option[this.label].
       *
       * @param  {Object || String} option
       * @return {String}
       */
      getOptionLabel( option ) {
        if( typeof option === 'object' ) {
          if( this.label && option[this.label] ) {
            return option[this.label];
          } else if( option.label ) {
            return option.label
          }
        }
        return option;
      },

      /**
       * Move the typeAheadPointer visually up the list by
       * subtracting the current index by one.
       * @return {void}
       */
      typeAheadUp() {
        if (this.typeAheadPointer > 0) this.typeAheadPointer--
      },

      /**
       * Move the typeAheadPointer visually down the list by
       * adding the current index by one.
       * @return {void}
       */
      typeAheadDown() {
        if (this.typeAheadPointer < this.filteredOptions.length - 1) this.typeAheadPointer++
      },

      /**
       * Select the option at the current typeAheadPointer position.
       * @return {void}
       */
      typeAheadSelect() {
        if( this.filteredOptions[ this.typeAheadPointer ] ) {
          this.select( this.filteredOptions[ this.typeAheadPointer ] );
        }

        if( this.clearSearchOnSelect ) {
          this.search = "";
        }
      },

      onEscape() {
        if( ! this.search.length ) {
          this.$els.search.blur()
        } else {
          this.$set('search', '')
        }
      },

      maybeDeleteValue() {
        if( ! this.$els.search.value.length && this.value ) {
          return this.multiple ? this.value.pop() : this.$set('value', null)
        }
      }
    },

    computed: {
      cssClasses() {
        return {
          open: this.open,
          searchable: this.searchable
        }
      },

      searchPlaceholder() {
        if( this.isValueEmpty && this.placeholder ) {
          return this.placeholder;
        }
      },

      filteredOptions() {
        return this.$options.filters.filterBy(this.options, this.search)
      },

      isValueEmpty() {
        if( this.value ) {
          return ! this.value.length
        }

        return true;
      },

      valueAsArray() {
        if( this.multiple ) {
          return this.value
        } else if (this.value) {
            return [this.value]
        }

        return []
      }
    }

  }
</script>
