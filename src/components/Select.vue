<style>
	.v-select {
		position: relative;
		/* Fix behavior in tables */
		display: table;
		table-layout: fixed;
		width: 100%;
	}

	.v-select .disabled {
		cursor: not-allowed !important;
		background-color: rgb(238, 238, 238) !important;
	}

	.v-select .clear > span {
		position: absolute;
		top: 6px;
		right: 14px;
		width: 20px;
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
		background-color: white;
		border: 1px solid rgba(60, 60, 60, .26);
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
		border-radius: 4px;
		white-space: nowrap;
		overflow: hidden;
		transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
	}

	.v-select .dropdown-toggle.focused {
		border-color: #66afe9;
		outline: 0;
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
		transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
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
		width: auto;
		min-width: 100%;
		overflow-y: auto;
		border-top-left-radius: 0;
	}

	.v-select > .dropdown-menu > .dropdown-buttons {
		padding: 5px;
	}

	.v-select > .dropdown-menu > .dropdown-buttons > button:not(:first-child) {
		margin-left: 5px;
	}

	.v-select > .dropdown-menu-simple {
		margin: 0;
		width: 100%;
		overflow-y: auto;
		border-top: none;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}

	.v-select .no-data {
		padding: 0 0.25em;
	}

	.v-select .selected-tag {
		color: #333;
		margin: 3px 1px 0 3px;
		padding: 0 0.25em;
		float: left;
		line-height: 1.7em;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.v-select .selected-tag.single {
		max-width: calc(100% - 4px);
		text-align: left;
	}

	.v-select .selected-tag-content {
		display: block;
		text-overflow: ellipsis;
		overflow: hidden;
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
		padding: 0;
		width: 0;
		background: none;
		position: relative;
		box-shadow: none;
		float: left;
		clear: none;
		text-align: start;
	}

    .v-select input[type=search].focused {
        width: 100%;
        padding: 0 .5em;
    }

	.v-select input[type=search]:disabled {
		cursor: pointer;
	}

	.v-select li a {
		cursor: pointer;
		display: flex;
		align-items: center;
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

	.v-select li a > input[type="checkbox"] {
		flex-shrink: 0;
		flex-grow: 0;
		margin: 0 4px 2px 0;
	}

	.v-select .spinner {
		position: absolute;
		top: 1em;
    	right: 4em; /* 7em when selected a value and not multiple */
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

	.v-select .spinner.shifted-left {
		right: 7em;
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
		<div @mousedown.prevent.stop="toggleDropdown" ref="toggle" :class="['dropdown-toggle', 'clearfix', {'disabled': disabled}, {'focused': focused}]">

			<div :class="selectedTagClasses" v-if="!focused && !isValueEmpty">
				<div class="selected-tag-content">
					<slot name="selected" :data="mutableValues[0]" :values="mutableValues">
						{{ placeholder }}
					</slot>
				</div>
			</div>

			<input
				type="search"
				ref="search"
				autocomplete="off"
				v-model="search"
				@keydown.delete="maybeDeleteValue"
				@keydown.up.prevent="typeAheadUp"
				@keydown.down.prevent="typeAheadDown"
				@keyup.enter.prevent.stop="typeAheadSelect"
				@keydown.enter.prevent.stop
				@blur="onBlur"
				@focus="onFocus"
				@mousedown.prevent.stop="toggleDropdown"
				:name="name"
				:disabled="disabled"
                :class="[{'disabled': disabled}, {focused: focused}, 'form-control']"
				:maxlength="maxlength"
				:placeholder="focused ? placeholder : ''"
				:readonly="!searchable"
			/>

			<button v-if="!disabled && !isValueEmpty && allowClear" @mousedown.prevent.stop="clear" tabIndex="-1" type="button" class="close clear">
				<span aria-hidden="true">&times;</span>
			</button>

			<div ref="openIndicator" :class="[{'disabled': disabled}, 'open-indicator-container']">
				<slot name="open-indicator">
					<i role="presentation" class="open-indicator"></i>
				</slot>
			</div>

			<slot name="spinner">
				<div :class="spinnerClasses" v-show="mutableLoading"></div>
			</slot>
		</div>

		<ul ref="dropdownMenu" v-show="open && !disabled" :transition="transition" :class="dropdownMenuClasses" :style="dropdownMenuStyle" @mousewheel="scroll" @scroll="scroll" onresize="checkIfDropdownIsAsWideAsSelect">
			<li class="dropdown-buttons" v-if="multiple && filteredOptions.length > 0">
				<button type="button" class="btn btn-default" @mousedown.prevent.stop="onClickSelectAll">{{ translate('Select all') }}</button>
				<button type="button" class="btn btn-default" @mousedown.prevent.stop="clear">{{ translate('Clear') }}</button>
			</li>
			<li v-for="(option, index) in filteredOptions" v-bind:key="index" :class="{ active: !multiple && isOptionSelected(option), highlight: index === typeAheadPointer, divider: option.vselectOptionType === 'divider' }" @mouseover="onMouseOver(index, option)">
				<a v-if="!option.vselectOptionType" @click.prevent.stop="toggle(option)" @mousedown.prevent.stop>
					<input type="checkbox" :checked="isOptionSelected(option)" v-if="multiple">
					<span class="item-container">
						<slot name="item" :data="option">
							{{ option[valueField] }}
						</slot>
					</span>
				</a>
			</li>
			<transition name="fade">
				<li v-if="!filteredOptions.length && useSimpleDropdown" class="divider"></li>
			</transition>
			<transition name="fade">
				<li v-if="!filteredOptions.length" class="text-center no-data">
					<slot name="no-options">
						<span class="no-options">{{ translate('No data') }}</span>
					</slot>
				</li>
			</transition>
		</ul>
	</div>
</template>


<script type="text/babel">
	import Vue from 'vue'
	import pointerScroll from '../mixins/pointerScroll'
	import typeAheadPointer from '../mixins/typeAheadPointer'
	import ajax from '../mixins/ajax'

	export default {
		mixins: [pointerScroll, typeAheadPointer, ajax],

		props: {

			disabled: {
				type: Boolean,
				default: false
			},

			showSelectedOnTop: {
			    type: Boolean,
				default: true
			},

			name: {
				type: String,
				default: ''
			},

			translations: {
			  	type: Object,
				default() {
			  	    return {}
				}
			},

			allowClear: {
				type: Boolean,
				default: true
			},

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

			applySearchFilterToOption: {
			    type: Function,
				default: function(search, option, filterField){
                    let filter = search.toLowerCase()
					if (!filterField) return true;
                    if (typeof option[filterField] === 'string') {
                        return option[filterField].toLowerCase().indexOf(filter) > -1
					}
					return false;
				}
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
			 * Sets the min-width property on the dropdown list.
			 * @type {String}
			 */
			minWidth: {
				type: String,
				default: '100%'
			},

            /**
             * Sets the max-width property on the dropdown list. Empty string for no limit.
             * @type {String}
             */
            maxWidth: {
                type: String,
                default: ''
            },

            /**
             * if true, use a simpler dropdown. If false then use a larger dropdown
			 * better suited for longer strings.
             * @type {Boolean}
             */
            useSimpleDropdown: {
                type: Boolean,
                default: true
            },

			/**
			 * A callback function that will be
			 * run when the dropdown has a scrollbar and
			 * is scrolled to the bottom.
			 */
			onScrollEnd: {
				type: Function,
				default: function() {
					if (this.searchable) this.onSearch(this.search, this.toggleLoading, this.typeAheadPointer)
				}
			},

            onClickSelectAll: {
                type: Function,
                default: function() {
                    this.selectAll();
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
             * A callback function that will be
             * run when the dropdown is opening.
             */
            onOpenDropdown: {
                type: Function,
                default: function(){
                    this.onSearch(this.search, this.toggleLoading)
				}
            },

			/**
			 * Enable/disable filtering the options.
			 * @type {Boolean}
			 */
			searchable: {
				type: Boolean,
				default: true
			},

			buildPlaceholder: {
				type: Function,
				default: function(data){
				    if (Array.isArray(data)) {
				        if (data.length > 0) {
                            return data
                                .map(v => v[this.valueField])
                                .join(', ')
						} else {
				            return ''
						}
                    }
					return data ? '' + data[this.valueField] : ''
				}
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

			/**
			 * When true, everytime you click on a VSelect it's data will be reloaded
			 * @type {Boolean}
			 */
			alwaysReload: {
				type: Boolean,
				default: false
			},
		},

		data() {
			return {
				search: '',
				focused: false,
				open: false,
				optionsOnTop: [],
				mutableValues: [],
				mutableOptions: [],
				mutableLoading: false,
				dropdownAsWideAsSelect: true
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

			search(val) {
				if (val) this.open = true
			},

			/**
			 * Maybe run the onChange callback.
			 * @param  {string|object} val
			 * @param  {string|object} old
			 * @return {void}
			 */
			mutableValues(val, old) {
			    if (this.onChange) this.onChange(val, old)
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
					this.clear()
				}
				// Check right now
                this.checkIfDropdownIsAsWideAsSelect()
				// Check after render
				Vue.nextTick(() => this.checkIfDropdownIsAsWideAsSelect())
				// Check after some time (next render sometimes is not enough)
				setTimeout(() => this.checkIfDropdownIsAsWideAsSelect(), 100)
			},

			/**
			 * Always reset the mutableValues when
			 * the multiple prop changes.
			 * @param  {Boolean} val
			 * @return {void}
			 */
			multiple(val) {
				this.clear()
 			},

			open(val, old) {
			    if (this.open) this.focus()
				if (val != old) {
					if(this.open) {
						this.updateOptionsOnTop()
                        this.checkIfDropdownIsAsWideAsSelect()
                        Vue.nextTick(() => this.checkIfDropdownIsAsWideAsSelect())
						this.onOpenDropdown()
					} else {
						this.search = ''
						this.onCloseDropdown()
					}
				}
			}
		},

		created() {
			this.mutableValues = this.mutableValues
			this.mutableOptions = this.options.slice(0)
			this.mutableLoading = this.loading
		},

		methods: {

		    checkIfDropdownIsAsWideAsSelect() {
		        if (this.$refs.dropdownMenu && this.$refs.toggle) {
                    let horizontalScrollbarVisible = this.$refs.dropdownMenu.scrollWidth !== this.$refs.dropdownMenu.clientWidth
                    this.dropdownAsWideAsSelect = this.$refs.dropdownMenu.offsetWidth <= this.$refs.toggle.offsetWidth && !horizontalScrollbarVisible
                    // console.log('DropdownAsWideAsSelect', this.dropdownAsWideAsSelect, 'DropdownMenuClientWidth', this.$refs.dropdownMenu.clientWidth, 'DropdownMenuOffsetWidth', this.$refs.dropdownMenu.offsetWidth, 'DropdownMenuScrollWidth', this.$refs.dropdownMenu.scrollWidth, 'VSelectOffsetWidth', this.$refs.toggle.offsetWidth, 'HorizontalScrollbarVisible', horizontalScrollbarVisible)
                }
			},

		    updateOptionsOnTop() {
                this.optionsOnTop = this.mutableValues.map(val => val[this.valueField])
			},

		    onMouseOver(index, option){
                if (!option.vselectOptionType) this.typeAheadPointer = index
			},

		    translate(msg) {
		        return this.translations[msg] || msg
			},

			isOptionVisibleByFilter(option){
		      	let shouldFilter = (this.searchable || this.mutableLoading)
                if (shouldFilter) {
		      	    return this.applySearchFilterToOption(this.search, option, this.filterField)
                } else {
                    return true;
                }
			},

			onFocus() {
				this.focused = true
			},

			selectAll() {
			    return this.select(this.mutableOptions)
			},

			onBlur() {
				this.focused = false
				this.open = false
			},

			/**
			 * puts the focus on the input field.
			 */
			focus() {
				if (!this.disabled) {
                    this.focused = true
					if (this.$refs.search) {
                        this.$refs.search.focus()
					}
                    // safari workaround
                    setTimeout(() => {
                        if (this.$refs.search) this.$refs.search.focus()
					}, 50)
				}
			},

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

			clear() {
				this.mutableValues = []
			},

            /**
             * Select a given option or list of options
             * @param  {Object} option
             * @return {void}
             */
            select(option) {
                if (this.clearSearchOnSelect && !this.multiple) {
                    this.search = ''
                }
                let list = [].concat(option)
                    .filter(item => !item.vselectOptionType && (!this.isOptionSelected(item) || !this.multiple))
                if (this.multiple){
                    list = this.mutableValues.concat(list)
                } else {
                    if (list.length > 1) {
                        list = [list[0]]
                    }
                    this.open = false
                }
                this.mutableValues = list
				return list
            },

			/**
			 * De-select a given option or list of options.
			 * @param  {Object|Array} option
			 * @return {void}
			 */
			deselect(option) {
				if (this.multiple) {
					let list = []
						.concat(option)
						.forEach(opt => {
                            let ref = -1
                            this.mutableValues.forEach(val => {
                                if (val[this.valueField] === opt[this.valueField]) {
                                    ref = val
                                }
                            })
                            let index = this.mutableValues.indexOf(ref)
                            this.mutableValues.splice(index, 1)
						})
				} else if (this.allowClear) {
					this.clear()
				}
			},

			/**
			 * Handles dropdown scroll. Calls onScrollEnd when
			 * the dropdown is scrollable and scrolled to the
			 * bottom.
			 */
			scroll(event) {
        var elem = event.currentTarget;
				this.checkIfScrolledToEnd(elem);
			},

			handleMouseWheel(event) {
				// https://jsfiddle.net/tovic/6nFTC/
				var elem = event.currentTarget
				var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)))
				if (delta < 0) this.checkIfScrolledToEnd(elem)
			},

			checkIfScrolledToEnd(elem) {
				if (elem.scrollHeight - elem.scrollTop === elem.clientHeight) {
					this.onScrollEnd()
				}
			},

			/**
			 * Toggle the visibility of the dropdown menu.
			 * @param  {Event} e
			 * @return {void}
			 */
			toggleDropdown(e) {
				if (this.open || this.disabled) {
					this.open = false
				} else {
					this.open = true
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

            isOptionOnTop(option) {
                return this.optionsOnTop.indexOf(option[this.valueField]) > -1
            },

			/**
			 * Delete the value on Delete keypress when there is no
			 * text in the search input, & there's tags to delete
			 */
			maybeDeleteValue() {
				if (!this.multiple && this.allowClear && this.search.length === 0 && this.mutableValues.length > 0) {
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

		    preparedValues() {
		        if (this.multiple) {
		            return this.mutableValues
				} else if (this.mutableValues.length > 0) {
		            return this.mutableValues[0]
				}
			},

			placeholder() {
				return this.buildPlaceholder(this.mutableValues)
			},

			/**
			 * Classes to be output on selected tags
			 * @return {Object}
			 */
			selectedTagClasses() {
				return {
					'selected-tag': true,
					single: true
					// multiple: this.multiple,
					// single: !this.multiple
				}
			},

 			spinnerClasses() {
 				return {
 					'spinner': true,
 					'shifted-left': !this.isValueEmpty && this.allowClear,
 					single: !this.multiple
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
					loading: this.mutableLoading,
				  	focused: this.focused
				}
			},

			/**
			 * @return {Object}
			 */
			dropdownMenuClasses() {
				return {
					'dropdown-menu-simple': this.useSimpleDropdown || this.dropdownAsWideAsSelect,
					'dropdown-menu': true
				}
			},

			dropdownMenuStyle() {
                const style =  {
                    'max-height': this.maxHeight,
					'width:': this.useSimpleDropdown ? '100%' : 'auto'
                }
                if (!this.useSimpleDropdown) {
                    style['min-width'] = this.minWidth
                    style['max-width'] = this.maxWidth
				}
                return style
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
				let options = []
				if (this.multiple && this.showSelectedOnTop) {
				    options = options
						.concat(this.mutableValues.filter(opt => this.isOptionOnTop(opt)))
				}
                let additionalOptions = this.mutableOptions
				if (this.multiple && this.showSelectedOnTop) {
				    additionalOptions = this.mutableOptions.filter(opt => !this.isOptionOnTop(opt))
                }
                if (options.length > 0 && additionalOptions.length > 0) {
				    options = options.concat({
				        vselectOptionType: 'divider',
						vselectClientOnly: true
				    })
                }
				options = options.concat(additionalOptions)
				if (this.taggable && search.length && !this.optionExists(search)) {
					options.unshift(search)
				}
				return options.filter(this.isOptionVisibleByFilter, this)
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
