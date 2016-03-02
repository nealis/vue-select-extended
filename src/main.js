import Vue from 'vue'
import App from './App.vue'

Vue.transition('bounce', {
    enterClass: 'bounceInLeft',
    leaveClass: 'bounceOutRight'
})

Vue.transition('zoom', {
    enterClass: 'zoomIn',
    leaveClass: 'zoomOut'
})

Vue.transition('fade', {
    enterClass: 'fadeIn',
    leaveClass: 'fadeOut'
})

Vue.transition('fadeInDownBig', {
    enterClass: 'fadeInDownBig',
    leaveClass: 'fadeOutDownBig'
})

Vue.transition('slideInDown', {
    enterClass: 'slideInDown',
    leaveClass: 'slideOutDown'
})

Vue.transition('slideUp', {
    enterClass: 'fadeInDown',
    leaveClass: 'fadeOutUp'
})

Vue.transition('lightSpeed', {
    enterClass: 'lightSpeedIn',
    leaveClass: 'lightSpeedOut'
})

Vue.transition('flipX', {
    enterClass: 'flipInX',
    leaveClass: 'flipOutX'
})

Vue.transition('flipY', {
    enterClass: 'flipInY',
    leaveClass: 'flipOutY'
})

Vue.transition('rotate', {
    enterClass: 'rotateIn',
    leaveClass: 'rotateOut'
})

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
