import VueSelect from './components/Select.vue'
import scroll from './mixins/pointerScroll.js'
import pointer from './mixins/typeAheadPointer.js'

module.exports = {
	component: VueSelect,
	mixins: {
		scroll, pointer
	}
}