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
    typeAheadUp(event) {
      if (!event || this.open) {
        if (event) event.stopPropagation()
        if (!this.disabled) {
            let filterableIndexes = this.filteredOptions
                .map((opt, index) => {
                    return {vselectOptionType: opt.vselectOptionType, index: index}
                })
                .filter(opt => !opt.vselectOptionType)
                .map(opt => opt.index)
            let mappedPointer = filterableIndexes.indexOf(this.typeAheadPointer)
            if (mappedPointer > 0) {
                this.typeAheadPointer = filterableIndexes[mappedPointer - 1]
            } else {
                this.onScrollEnd()
            }
        }
      }
    },

    /**
     * Move the typeAheadPointer visually down the list by
     * adding the current index by one.
     * @return {void}
     */
    typeAheadDown(event) {
      if (!event || this.open) {
        if (event) event.stopPropagation()
        this.open = true
        if (!this.disabled){
          let filterableIndexes = this.filteredOptions
              .map((opt, index) => {
                return {vselectOptionType: opt.vselectOptionType, index: index}
              })
              .filter(opt => !opt.vselectOptionType)
              .map(opt => opt.index)
          let mappedPointer = filterableIndexes.indexOf(this.typeAheadPointer)
          if (mappedPointer < filterableIndexes.length - 1) {
            this.typeAheadPointer = filterableIndexes[mappedPointer + 1]
          } else {
            this.onScrollEnd()
          }
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
        }
      }
    },
  }
}
