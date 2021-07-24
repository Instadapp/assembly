import Vue from 'vue'
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip'
import './v-tooltip.css'

VTooltip.options.defaultOffset = 4
VTooltip.options.defaultDelay = 150
VTooltip.options.autoHide = false
VTooltip.options.defaultTrigger = 'hover focus click'

Vue.directive('tooltip', VTooltip)
Vue.directive('close-popover', VClosePopover)
Vue.component('VPopover', VPopover)
