module.exports = {
  data() {
    return {
      typeAheadPointer: -1
    }
  },

  watch: {
    filteredOptions(newVal, oldVal) {
      if (this.typeAheadPointer > 0) {
        this.typeAheadPointer = newVal.findIndex(opt =>
          opt[this.valueField] === oldVal[this.typeAheadPointer][this.valueField]
        )
      } else {
        this.typeAheadPointer = 0
      }
    }
  },

  methods: {
    /**
     * Move the typeAheadPointer visually up the list by
     * subtracting the current index by one.
     * @return {void}
     */
    typeAheadUp() {
      if (!this.disabled && this.typeAheadPointer > 0) {
        this.typeAheadPointer--
      }
    },

    /**
     * Move the typeAheadPointer visually down the list by
     * adding the current index by one.
     * @return {void}
     */
    typeAheadDown() {
      this.open = true
      if (!this.disabled){
        if (this.typeAheadPointer < this.filteredOptions.length - 1) {
          this.typeAheadPointer++
        } else {
          this.onScrollEnd()
        }
      }
    },

    /**
     * Select the option at the current typeAheadPointer position.
     * Optionally clear the search input on selection.
     * @return {void}
     */
    typeAheadSelect() {
      if (!this.disabled) {
        if (!this.open) {
          this.open = true
        } else {
          if( this.filteredOptions[ this.typeAheadPointer ] ) {
            this.select( this.filteredOptions[ this.typeAheadPointer ] );
          } else if (this.taggable && this.search.length){
            this.select(this.search)
          }
          if( this.clearSearchOnSelect ) {
            this.search = "";
          }
        }
      }
    },
  }
}
