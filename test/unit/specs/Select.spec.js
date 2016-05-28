/* global describe, it, expect */

import Vue from 'vue'
import vSelect from 'src/components/Select.vue'

/**
 * Simulate a DOM event.
 * @param target
 * @param event
 * @param process
 * @returns {Event}
 */
function trigger(target, event, process) {
  var e = document.createEvent('HTMLEvents')
  e.initEvent(event, true, true)
  if (process) process(e)
  target.dispatchEvent(e)
  return e
}

function triggerMouse(target, event, process) {
  var e = document.createEvent('MouseEvent')
  e.initEvent('event', true, true)
  if (process) process(e)
  target.dispatchEvent(e)
  return e
}

function triggerFocusEvent(target, event, process) {
  var e = document.createEvent('FocusEvent')
  e.initEvent('event', true, true)
  if (process) process(e)
  target.dispatchEvent(e)
  return e
}

/**
 * Optionally set the search term, then simulate a return keypress.
 * @param vm
 * @param search
 */
function searchSubmit(vm, search = false) {
  if (search) {
    vm.$children[0].search = search
  }

  trigger(vm.$children[0].$els.search, 'keyup', function (e) {
    e.keyCode = 13
  })
}

describe('Select.vue', () => {

  describe('Selecting values', () => {
    it('can accept an array with pre-selected values', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value"></v-select></div>',
        components: {vSelect},
        data: {
          value: ['one'],
          options: ['one', 'two', 'three']
        }
      }).$mount()
      expect(vm.$children[0].value).toEqual(vm.value)
    })

    it('can accept an array of objects and pre-selected value (single)', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value"></v-select></div>',
        components: {vSelect},
        data: {
          value: {label: 'This is Foo', value: 'foo'},
          options: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}]
        }
      }).$mount()
      expect(vm.$children[0].value).toEqual(vm.value)
    })

    it('can accept an array of objects and pre-selected values (multiple)', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value" :multiple="true"></v-select></div>',
        components: {vSelect},
        data: {
          value: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}],
          options: [{label: 'This is Foo', value: 'foo'}, {label: 'This is Bar', value: 'bar'}]
        }
      }).$mount()
      expect(vm.$children[0].value).toEqual(vm.value)
    })

    it('can determine if the value prop is empty', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value"></v-select></div>',
        components: {vSelect},
        data: {
          value: [],
          options: ['one', 'two', 'three']
        }
      }).$mount()
      var select = vm.$children[0]
      expect(select.isValueEmpty).toEqual(true)

      select.$set('value', ['one'])
      expect(select.isValueEmpty).toEqual(false)

      select.$set('value', [{l: 'f'}])
      expect(select.isValueEmpty).toEqual(false)

      select.$set('value', 'one')
      expect(select.isValueEmpty).toEqual(false)

      select.$set('value', {label: 'foo', value: 'foo'})
      expect(select.isValueEmpty).toEqual(false)

      select.$set('value', '')
      expect(select.isValueEmpty).toEqual(true)

      select.$set('value', null)
      expect(select.isValueEmpty).toEqual(true)
    })

    it('resets the selected values when the options property changes', (done) => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value" :multiple="true"></v-select></div>',
        components: {vSelect},
        data: {
          value: ['one'],
          options: ['one', 'two', 'three']
        }
      }).$mount()
      vm.$children[0].options = ['four', 'five', 'six']
      Vue.nextTick(() => {
        expect(vm.$children[0].value).toEqual([])
        done()
      })
    })

    it('resets the selected values when the multiple property changes', (done) => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value" :multiple="multiple"></v-select></div>',
        components: {vSelect},
        data: {
          value: ['one'],
          multiple: true,
          options: ['one', 'two', 'three']
        }
      }).$mount()

      vm.multiple = false

      Vue.nextTick(() => {
        expect(vm.$children[0].value).toEqual(null)
        vm.multiple = true
        Vue.nextTick(() => {
          expect(vm.$children[0].value).toEqual([])
          done()
        })
      })
    })

    it('can retain values present in a new array of options', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value"></v-select></div>',
        components: {vSelect},
        data: {
          value: ['one'],
          options: ['one', 'two', 'three']
        }
      }).$mount()
      vm.$children[0].$set('options', ['one', 'five', 'six'])
      expect(vm.$children[0].value).toEqual(['one'])
    })

    it('can determine if an object is already selected', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" multiple :value.sync="value"></v-select></div>',
        components: {vSelect},
        data: {
          value: [{label: 'one'}],
          options: [{label: 'one'}]
        }
      }).$mount()

      expect(vm.$children[0].isOptionSelected('one')).toEqual(true)
    })

    it('can run a callback when the selection changes', (done) => {
      const vm = new Vue({
        template: '<div><v-select :on-change="foo" value="bar" :options="options"></v-select></div>',
        components: {vSelect},
        data: {
          val: null,
          options: ['foo', 'bar', 'baz']
        },
        methods: {
          foo(value) {
            this.val = value
          }
        }
      }).$mount()

      vm.$children[0].select('foo')
      Vue.nextTick(function () {
        expect(vm.$get('val')).toEqual('foo')

        vm.$children[0].$set('value', 'baz')
        Vue.nextTick(function () {
          expect(vm.$get('val')).toEqual('baz')
          done()
        })
      })
    })
  })

  describe('Toggling Dropdown', () => {
    it('can open the dropdown when the el is clicked', (done) => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value"></v-select></div>',
        components: {vSelect},
        data: {
          value: [{label: 'one'}],
          options: [{label: 'one'}]
        }
      }).$mount()

      vm.$children[0].toggleDropdown({target: vm.$children[0].$els.search})
      Vue.nextTick(() => {
        Vue.nextTick(() => {
          expect(vm.$children[0].open).toEqual(true)
          done()
        })
      })
    })

    // it('can close the dropdown when the el is clicked', (done) => {
    //   const vm = new Vue({
    //     template: '<div><v-select :options="options" :value.sync="value"></v-select></div>',
    //     components: {vSelect},
    //     data: {
    //       value: [{label: 'one'}],
    //       options: [{label: 'one'}]
    //     }
    //   }).$mount()

    //   vm.$children[0].open = true

    //   Vue.nextTick(() => {
    //     vm.$children[0].toggleDropdown({ target: vm.$children[0].$el })
    //     Vue.nextTick( () => {
    //        expect(vm.$children[0].open).toEqual(false)
    //        done()
    //     })
    //   })
    // })

    it('will close the dropdown on search blur', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" multiple :value.sync="value"></v-select></div>',
        components: {vSelect},
        data: {
          value: [{label: 'one'}],
          options: [{label: 'one'}]
        }
      }).$mount()

      vm.$children[0].open = true
      triggerFocusEvent(vm.$children[0].$els.toggle, 'blur')
      expect(vm.$children[0].open).toEqual(true)
    })

    // it('will close the dropdown on escape, if search is empty', (done) => {
    //   const vm = new Vue({
    //     template: '<div><v-select :options="options" multiple :value.sync="value"></v-select></div>',
    //     components: {vSelect},
    //     data: {
    //       value: [{label: 'one'}],
    //       options: [{label: 'one'}]
    //     }
    //   }).$mount()

    //   vm.$children[0].open = true
    //   vm.$children[0].onEscape()

    //   Vue.nextTick(() => {
    //     Vue.nextTick(() => {
    //       expect(vm.$children[0].open).toEqual(false)
    //       done()
    //     })
    //   })
    // })

    it('will remove existing search text on escape keyup', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" multiple :value.sync="value"></v-select></div>',
        components: {vSelect},
        data: {
          value: [{label: 'one'}],
          options: [{label: 'one'}]
        }
      }).$mount()

      vm.$children[0].search = 'foo'
      vm.$children[0].onEscape()
      expect(vm.$children[0].search).toEqual('')
    })
  })

  describe('Moving the Typeahead Pointer', () => {
    it('will set the pointer to zero when the filteredOptions change', (done) => {
      const vm = new Vue({
        template: '<div><v-select :options="options"></v-select></div>',
        components: {vSelect},
        data: {
          options: ['one', 'two', 'three']
        }
      }).$mount()

      vm.$children[0].search = 'two'
      Vue.nextTick(() => {
        expect(vm.$children[0].typeAheadPointer).toEqual(0)
        done()
      })
    })

    it('will move the pointer visually up the list on up arrow keyup', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options"></v-select></div>',
        components: {vSelect},
        data: {
          options: ['one', 'two', 'three']
        }
      }).$mount()

      vm.$children[0].typeAheadPointer = 1

      trigger(vm.$children[0].$els.search, 'keyup', (e) => e.keyCode = 38)
      expect(vm.$children[0].typeAheadPointer).toEqual(0)
    })

    it('will move the pointer visually down the list on down arrow keyup', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options"></v-select></div>',
        components: {vSelect},
        data: {
          options: ['one', 'two', 'three']
        }
      }).$mount()

      vm.$children[0].typeAheadPointer = 1
      trigger(vm.$children[0].$els.search, 'keyup', (e) => e.keyCode = 40)
      expect(vm.$children[0].typeAheadPointer).toEqual(2)
    })

    it('will not move the pointer past the end of the list', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options"></v-select></div>',
        components: {vSelect},
        data: {
          options: ['one', 'two', 'three']
        }
      }).$mount()

      vm.$children[0].typeAheadPointer = 2
      vm.$children[0].typeAheadDown()
      expect(vm.$children[0].typeAheadPointer).toEqual(2)
    })
  })

  describe('Removing values', () => {
    it('removes the given tag when its close icon is clicked', (done) => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value" :multiple="true"></v-select></div>',
        components: {vSelect},
        data: {
          value: ['one'],
          options: ['one', 'two', 'three']
        }
      }).$mount()
      vm.$children[0].$els.toggle.querySelector('.close').click()
      Vue.nextTick(() => {
        expect(vm.$children[0].value).toEqual([])
        done()
      })
    })

    it('removes the last item in the value array on delete keypress when multiple is true', () => {

      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value" :multiple="true"></v-select></div>',
        components: {vSelect},
        data: {
          value: ['one', 'two'],
          options: ['one', 'two', 'three']
        }
      }).$mount()
      vm.$children[0].maybeDeleteValue()
      Vue.nextTick(() => {
        expect(vm.$children[0].value).toEqual(['one'])
      })
    })

    it('sets the value to null on delete keypress when multiple is false', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value"></v-select></div>',
        components: {vSelect},
        data: {
          value: 'one',
          options: ['one', 'two', 'three']
        }
      }).$mount()
      vm.$children[0].maybeDeleteValue()
      Vue.nextTick(() => {
        expect(vm.$children[0].value).toEqual(null)
      })
    })
  })

  describe('Labels', () => {
    it('can generate labels using a custom label key', () => {
      const vm = new Vue({
        template: '<div><v-select label="name" :options="options" :value.sync="value" :multiple="true"></v-select></div>',
        components: {vSelect},
        data: {
          value: [{name: 'Baz'}],
          options: [{name: 'Foo'}, {name: 'Baz'}]
        }
      }).$mount()
      expect(vm.$children[0].$els.toggle.querySelector('.selected-tag').textContent).toContain('Baz')
    })

    it('will display a placeholder if the value is empty', (done) => {
      const vm = new Vue({
        template: '<div><v-select :options="options" placeholder="foo"></v-select></div>',
        components: {vSelect},
        data: {
          options: [{label: 'one'}]
        }
      }).$mount()

      expect(vm.$children[0].searchPlaceholder).toEqual('foo')
      vm.$children[0].value = {label: 'one'}
      Vue.nextTick(() => {
        expect(vm.$children[0].searchPlaceholder).not.toBeDefined()
        done()
      })

      // expect(vm.$children[0].searchPlaceholder()).toEqual('foo')
    })
  })

  describe('When Tagging Is Enabled', () => {
    it('can determine if a given option string already exists', () => {
      const vm = new Vue({
        template: '<div><v-select v-ref:select :options="options" taggable></v-select></div>',
        components: {vSelect},
        data: {
          options: ['one', 'two']
        }
      }).$mount()

      expect(vm.$refs.select.optionExists('one')).toEqual(true)
      expect(vm.$refs.select.optionExists('three')).toEqual(false)
    })

    it('can determine if a given option object already exists', () => {
      const vm = new Vue({
        template: '<div><v-select v-ref:select :options="options" taggable></v-select></div>',
        components: {vSelect},
        data: {
          options: [{label: 'one'}, {label: 'two'}]
        }
      }).$mount()

      expect(vm.$refs.select.optionExists('one')).toEqual(true)
      expect(vm.$refs.select.optionExists('three')).toEqual(false)
    })

    it('can determine if a given option object already exists when using custom labels', () => {
      const vm = new Vue({
        template: '<div><v-select v-ref:select :options="options" label="foo" taggable></v-select></div>',
        components: {vSelect},
        data: {
          options: [{foo: 'one'}, {foo: 'two'}]
        }
      }).$mount()

      expect(vm.$refs.select.optionExists('one')).toEqual(true)
      expect(vm.$refs.select.optionExists('three')).toEqual(false)
    })

    it('can add the current search text as the first item in the options list', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value" :multiple="true" taggable></v-select></div>',
        components: {vSelect},
        data: {
          value: ['one'],
          options: ['one', 'two']
        }
      }).$mount()

      vm.$children[0].search = 'three'
      expect(vm.$children[0].filteredOptions).toEqual(['three'])
    })

    it('can select the current search text as a string', (done) => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value" :multiple="true" taggable></v-select></div>',
        components: {vSelect},
        data: {
          value: ['one'],
          options: ['one', 'two']
        }
      }).$mount()

      searchSubmit(vm, 'three')
      Vue.nextTick(() => {
        expect(vm.$children[0].value).toEqual(['one', 'three'])
        done()
      })
    })

    it('can select the current search text as an object', (done) => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value" :multiple="true" taggable></v-select></div>',
        components: {vSelect},
        data: {
          value: [{label: 'one'}],
          options: [{label: 'one'}]
        }
      }).$mount()

      searchSubmit(vm, 'two')
      Vue.nextTick(() => {
        expect(vm.$children[0].value).toEqual([{label: 'one'}, {label: 'two'}])
        done()
      })
    })

    it('will add a freshly created option/tag to the options list when pushTags is true', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" push-tags :value.sync="value" :multiple="true" taggable></v-select></div>',
        components: {vSelect},
        data: {
          value: ['one'],
          options: ['one', 'two']
        }
      }).$mount()

      searchSubmit(vm, 'three')
      expect(vm.$children[0].options).toEqual(['one', 'two', 'three'])
    })

    it('wont add a freshly created option/tag to the options list when pushTags is false', () => {
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value" :multiple="true" :taggable="true"></v-select></div>',
        components: {vSelect},
        data: {
          value: ['one'],
          options: ['one', 'two']
        }
      }).$mount()

      searchSubmit(vm, 'three')
      expect(vm.$children[0].options).toEqual(['one', 'two'])
    })

    it('will select an existing option if the search string matches a string from options', (done) => {
      let two = 'two'
      const vm = new Vue({
        template: '<div><v-select :options="options" :value.sync="value" :multiple="true" taggable></v-select></div>',
        components: {vSelect},
        data: {
          value: null,
          options: ['one', two]
        }
      }).$mount()
      vm.$children[0].search = 'two'

      searchSubmit(vm)

      Vue.nextTick(() => {
        expect(vm.$children[0].value[0]).toBe(two)
        done()
      })
    })

    it('will select an existing option if the search string matches an objects label from options', (done) => {
      let two = {label: 'two'}
      const vm = new Vue({
        template: '<div><v-select :options="options" taggable></v-select></div>',
        components: {vSelect},
        data: {
          options: [{label: 'one'}, two]
        }
      }).$mount()

      vm.$children[0].search = 'two'

      Vue.nextTick(() => {
        searchSubmit(vm)
        //  This needs to be wrapped in nextTick() twice so that filteredOptions can
        //  calculate after setting the search text, and move the typeAheadPointer index to 0.
        Vue.nextTick(() => {
          expect(vm.$children[0].value.label).toBe(two.label)
          done()
        })
      })
    })
  })
})

// also see example testing a component with mocks at
// https://github.com/vuejs/vueify-example/blob/master/test/unit/a.spec.js#L22-L43
