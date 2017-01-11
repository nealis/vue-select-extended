<style>
	.v-select {
		position: relative;
	}

	.v-select .open-indicator {
		position: absolute;
		bottom: 6px;
		right: 10px;
		display: inline-block;
		cursor: pointer;
		pointer-events: all;
		transition: all 150ms cubic-bezier(1.000, -0.115, 0.975, 0.855);
		transition-timing-function: cubic-bezier(1.000, -0.115, 0.975, 0.855);
		opacity: 1;
		transition: opacity .1s;
	}

	.v-select.loading .open-indicator {
		opacity: 0;
	}

	.v-select .open-indicator:before {
		border-color: rgba(60, 60, 60, .5);
		border-style: solid;
		border-width: 0.25em 0.25em 0 0;
		content: '';
		display: inline-block;
		height: 10px;
		width: 10px;
		vertical-align: top;
		transform: rotate(133deg);
		transition: all 150ms cubic-bezier(1.000, -0.115, 0.975, 0.855);
		transition-timing-function: cubic-bezier(1.000, -0.115, 0.975, 0.855);
	}

	.v-select.open .open-indicator {
		bottom: 1px;
	}

	.v-select.open .open-indicator:before {
		transform: rotate(315deg);
	}

	.v-select .dropdown-toggle {
		display: block;
		padding: 0;
		background: none;
		border: 1px solid rgba(60, 60, 60, .26);
		border-radius: 4px;
		white-space: normal;
	}

	.v-select.searchable .dropdown-toggle {
		cursor: text;
	}

	.v-select.open .dropdown-toggle {
		border-bottom: none;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.v-select > .dropdown-menu {
		margin: 0;
		width: 100%;
		overflow-y: auto;
		border-top: none;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}

	.v-select .selected-tag {
		color: #333;
		margin: 4px 1px 0px 3px;
		padding: 0 0.25em;
		float: left;
		line-height: 1.7em;
	}

	.v-select .selected-tag.multiple {
		background-color: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.v-select .selected-tag .close {
		float: none;
		margin-right: 0;
	}

	.v-select input[type=search],
	.v-select input[type=search]:focus {
		display: inline-block;
		border: none;
		outline: none;
		margin: 0;
		padding: 0 .5em;
		width: 10em;
		max-width: 100%;
		background: none;
		position: relative;
		box-shadow: none;
		float: left;
		clear: none;
	}

	.v-select input[type=search]:disabled {
		cursor: pointer;
	}

	.v-select li a {
		cursor: pointer;
	}

	.v-select .active a {
		background: rgba(50, 50, 50, .1);
		color: #333;
	}

	.v-select .highlight a,
	.v-select li:hover > a {
		background: #f0f0f0;
		color: #333;
	}

	.v-select .spinner {
		position: absolute;
		top: 1em;
    right: 4em;
		font-size: 5px;
		text-indent: -9999em;
		overflow: hidden;
		border-top: .9em solid rgba(100, 100, 100, .1);
		border-right: .9em solid rgba(100, 100, 100, .1);
		border-bottom: .9em solid rgba(100, 100, 100, .1);
		border-left: .9em solid rgba(60, 60, 60, .45);
		transform: translateZ(0);
		animation: vSelectSpinner 1.1s infinite linear;
		transition: opacity .1s;
	}

	.v-select .spinner,
	.v-select .spinner:after {
		border-radius: 50%;
		width: 4em;
		height: 4em;
	}

	@-webkit-keyframes vSelectSpinner {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes vSelectSpinner {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>

<template>
	<div class="dropdown v-select" :class="dropdownClasses">
		<div @mousedown.prevent="toggleDropdown" ref="toggle" class="dropdown-toggle clearfix" type="button">

        <span :class="selectedTagClasses" v-for="option in mutableValues" v-bind:key="option.index">
					<slot name="selected" :data="option">
						{{ option[valueField] }}
					</slot>
          <button @click="toggle(option)" type="button" class="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </span>

			<input
							ref="search"
							:debounce="debounce"
							v-model="search"
							@mousedown.prevent="toggleDropdown"
							@keydown="open = true"
							@keydown.delete="maybeDeleteValue"
							@keyup.esc="onEscape"
							@keydown.up.prevent="typeAheadUp"
							@keydown.down.prevent="typeAheadDown"
							@keyup.enter.prevent="typeAheadSelect"
							@blur="open = false"
							type="search"
							class="form-control"
							:maxlength="(isValueEmpty || multiple) ? maxlength : 0"
							:placeholder="searchPlaceholder"
							:readonly="!searchable"
							:style="{ width: isValueEmpty ? '100%' : (multiple ? 'auto' : '2em') }"
			>

			<div ref="openIndicator" class="open-indicator-container" @mousedown.prevent="toggleDropdown">
				<slot name="open-indicator">
					<i role="presentation" class="open-indicator"></i>
				</slot>
			</div>

			<slot name="spinner">
				<div class="spinner" v-show="mutableLoading">Loading...</div>
			</slot>
		</div>

		<ul ref="dropdownMenu" v-show="open" :transition="transition" class="dropdown-menu" :style="{ 'max-height': maxHeight }" @scroll="scroll">
			<li v-for="(option, index) in filteredOptions" v-bind:key="index" :class="{ active: isOptionSelected(option), highlight: index === typeAheadPointer }" @mouseover="typeAheadPointer = index">
				<a @mousedown.prevent="toggle(option)">
					<slot name="item" :data="option">
						{{ option[valueField] }}
					</slot>
				</a>
			</li>
			<transition name="fade">
				<li v-if="!filteredOptions.length" class="divider"></li>
			</transition>
			<transition name="fade">
				<li v-if="!filteredOptions.length" class="text-center">
					<slot name="no-options">Sorry, no matching options.</slot>
				</li>
			</transition>
		</ul>
	</div>
</template>


<script type="text/babel">
	import pointerScroll from '../mixins/pointerScroll'
	import typeAheadPointer from '../mixins/typeAheadPointer'
	import ajax from '../mixins/ajax'

	export default {
		mixins: [pointerScroll, typeAheadPointer, ajax],

		props: {
			/**
			 * Contains the currently selected values.
			 * @type {Object}
			 */
			values: {
				default() {
					return []
				}
			},

			/**
			 * The name of the attribute inside the values used to
			 * distinguish them
			 */
			valueField: {
				default: 'value'
			},

			/**
			 * The name of the attribute inside the values used to
			 * filter them
			 */
			filterField: {
				default: 'value'
			},

			/**
			 * Maximum text search input length in characters
			 */
			maxlength: {
				default: 255
			},

			/**
			 * An array of objects to be used as dropdown choices.
			 */
			options: {
				type: Array,
				default() {
					return []
				},
			},

			/**
			 * Sets the max-height property on the dropdown list.
			 * @deprecated
			 * @type {String}
			 */
			maxHeight: {
				type: String,
				default: '400px'
			},

			/**
			 * A callback function that will be
			 * run when the dropdown has a scrollbar and
			 * is scrolled to the bottom.
			 */
			onScrollEnd: {
				type: Function,
				default: function() {
					if (this.onSearch) this.onSearch(this.search, this.toggleLoading, this.typeAheadPointer)
				}
			},

			/**
			 * A callback function that will be
			 * run when the dropdown is closing.
			 */
			onCloseDropdown: {
				type: Function,
				default: function(){}
			},

			/**
			 * Enable/disable filtering the options.
			 * @type {Boolean}
			 */
			searchable: {
				type: Boolean,
				default: true
			},

			/**
			 * Equivalent to the `multiple` attribute on a `<select>` input.
			 * @type {Object}
			 */
			multiple: {
				type: Boolean,
				default: false
			},

			/**
			 * Equivalent to the `placeholder` attribute on an `<input>`.
			 * @type {Object}
			 */
			placeholder: {
				type: String,
				default: ''
			},

			/**
			 * Sets a Vue transition property on the `.dropdown-menu`. vue-select
			 * does not include CSS for transitions, you'll need to add them yourself.
			 * @type {String}
			 */
			transition: {
				type: String,
				default: 'expand'
			},

			/**
			 * Enables/disables clearing the search text when an option is selected.
			 * @type {Boolean}
			 */
			clearSearchOnSelect: {
				type: Boolean,
				default: true
			},

			/**
			 * An optional callback function that is called each time the selected
			 * value(s) change. When integrating with Vuex, use this callback to trigger
			 * an action, rather than using :value.sync to retreive the selected value.
			 * @type {Function}
			 * @default {null}
			 */
			onChange: {
				type: Function,
				default: function(val) {
					this.$emit('input', val)
				}
			},

			/**
			 * Enable/disable creating options from searchInput.
			 * @type {Boolean}
			 */
			taggable: {
				type: Boolean,
				default: false
			},

			/**
			 * When true, newly created tags will be added to
			 * the options list.
			 * @type {Boolean}
			 */
			pushTags: {
				type: Boolean,
				default: false
			},

			/**
			 * When false, updating the options will not reset the select value
			 * @type {Boolean}
			 */
			resetOnOptionsChange: {
				type: Boolean,
				default: false
			},
		},

		data() {
			return {
				search: '',
				open: false,
				mutableValues: [],
				mutableOptions: [],
				mutableLoading: false
			}
		},

		watch: {
			/**
			 * When the value prop changes, update
			 * the internal mutableValues.
			 * @param  {mixed} val
			 * @return {void}
			 */
			values(val) {
				this.mutableValues = val
			},

			/**
			 * Maybe run the onChange callback.
			 * @param  {string|object} val
			 * @param  {string|object} old
			 * @return {void}
			 */
			mutableValues(val, old) {
				if (this.multiple) {
					this.onChange ? this.onChange(val) : null
				} else {
					this.onChange && val !== old ? this.onChange(val) : null
				}
			},

			/**
			 * When options change, update
			 * the internal mutableOptions.
			 * @param  {array} val
			 * @return {void}
			 */
			options(val) {
				this.mutableOptions = val
			},

			/**
			 * Maybe reset the mutableValues
		 	 * when mutableOptions change.
			 * @return {[type]} [description]
			 */
			mutableOptions() {
				if (!this.taggable && this.resetOnOptionsChange) {
					this.mutableValues = []
				}
			},

			/**
			 * Always reset the mutableValues when
			 * the multiple prop changes.
			 * @param  {Boolean} val
			 * @return {void}
			 */
			multiple(val) {
				this.mutableValues = []
 			},

			open(val) {
				if (val) {
					this.$refs.search.focus()
				} else {
					this.$refs.search.blur()
					this.onCloseDropdown()
				}
			}
		},

		created() {
			this.mutableValues = this.mutableValues
			this.mutableOptions = this.options.slice(0)
			this.mutableLoading = this.loading
		},

		methods: {

			/**
			 * Toggle a given option.
			 * @param  {Object} option
			 * @return {void}
			 */
			toggle(option) {
				if (this.isOptionSelected(option)) {
					this.deselect(option)
				} else {
					this.select(option)
				}
			},

			/**
			 * Select a given option
			 * @param  {Object} option
			 * @return {void}
			 */
			select(option) {
				if (this.multiple) {
					this.mutableValues.push(option)
				} else {
					this.mutableValues = [option]
				}
				this.onAfterSelect(option)
			},

			/**
			 * De-select a given option.
			 * @param  {Object} option
			 * @return {void}
			 */
			deselect(option) {
				if (this.multiple) {
					let ref = -1
					this.mutableValues.forEach(val => {
						if (val[this.valueField] === option[this.valueField]) {
							ref = val
						}
					})
					var index = this.mutableValues.indexOf(ref)
					this.mutableValues.splice(index, 1)
				} else {
					this.mutableValues = []
				}
			},

			/**
			 * Called from this.select after each selection.
			 * @param  {Object|String} option
			 * @return {void}
			 */
			onAfterSelect(option) {
				if (this.clearSearchOnSelect) {
					this.search = ''
				}
				if (!this.multiple) {
					this.open = false
				}
			},

			/**
			 * Handles dropdown scroll. Calls onScrollEnd when
			 * the dropdown is scrollable and scrolled to the
			 * bottom.
			 */
			scroll(event) {
        var elem = event.currentTarget;
        if (elem.scrollHeight - elem.scrollTop <= elem.offsetHeight) {
					this.onScrollEnd()
        }
			},

			/**
			 * Toggle the visibility of the dropdown menu.
			 * @param  {Event} e
			 * @return {void}
			 */
			toggleDropdown(e) {
				if (e.target === this.$refs.openIndicator || e.target === this.$refs.search || e.target === this.$refs.toggle || e.target === this.$el) {
					if (this.open) {
						this.open = false
					} else if (this.$refs.search === document.activeElement || e.target === this.$refs.openIndicator) {
						this.open = true
					} else {
						this.$refs.search.focus()
					}
				}
			},

			/**
			 * Check if the given option is currently selected.
			 * @param  {Object|String}  option
			 * @return {Boolean}        True when selected | False otherwise
			 */
			isOptionSelected(option) {
				if (this.mutableValues !== null && this.mutableValues !== undefined) {
					let selected = false
					this.mutableValues.forEach(opt => {
						if (opt[this.valueField] === option[this.valueField]) {
							selected = true
						}
					})
					return selected
				}
				return false
			},

			/**
			 * If there is any text in the search input, remove it.
			 * Otherwise, blur the search input to close the dropdown.
			 * @return {[type]} [description]
			 */
			onEscape() {
				if (!this.search.length) {
					this.open = false
				} else {
					this.search = ''
				}
			},

			/**
			 * Delete the value on Delete keypress when there is no
			 * text in the search input, & there's tags to delete
			 */
			maybeDeleteValue() {
				if (this.$refs.search.value.length === 0 && this.mutableValues.length > 0) {
					this.deselect(this.mutableValues[this.mutableValues.length-1])
				}
			},

			/**
			 * Determine if an option exists
			 * within this.mutableOptions array.
			 *
			 * @param  {Object || String} option
			 * @return {boolean}
			 */
			optionExists(option) {
				return this.mutableOptions
					.filter(opt => opt[this.valueField] === option.valueField)
					.length > 0
			}
		},

		computed: {

		/**
		 * Classes to be output on selected tags
		 * @return {Object}
		 */
			selectedTagClasses() {
				return {
					'selected-tag': true,
					multiple: this.multiple
				}
			},

			/**
			 * Classes to be output on .dropdown
			 * @return {Object}
			 */
			dropdownClasses() {
				return {
					open: this.open,
					searchable: this.searchable,
					loading: this.mutableLoading
				}
			},

			/**
			 * Return the placeholder string if it's set
			 * & there is no value selected.
			 * @return {String} Placeholder text
			 */
			searchPlaceholder() {
				if (this.isValueEmpty && this.placeholder) {
					return this.placeholder;
				}
			},

			/**
			 * The currently displayed options, filtered
			 * by the search elements value. If tagging
			 * true, the search text will be prepended
			 * if it doesn't already exist.
			 *
			 * @return {array}
			 */
			filteredOptions() {
				let search = this.search.toLowerCase()
				let options = this.mutableOptions.filter(option => {
					if (typeof option[this.filterField] !== 'string') {
						return true
					} else {
						return option[this.filterField].toLowerCase().indexOf(search) > -1
					}
				})
				if (this.taggable && search.length && !this.optionExists(search)) {
					options.unshift(search)
				}
				return options
			},

			selectedOptions() {
				return this.mutableOptions.filter(this.isOptionSelected, this)
			},

			/**
			 * Check if there aren't any options selected.
			 * @return {Boolean}
			 */
			isValueEmpty() {
				if (this.mutableValues.length === 0) {
					return true;
				}
				return this.mutableValues
					.filter(val => val[this.valueField] !== undefined)
					.length === 0
			},
		},

	}
</script>
