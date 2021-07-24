<template>
  <!-- prettier-ignore -->
  <button
    class="flex items-center justify-center flex-shrink-0 font-semibold whitespace-no-wrap transition-colors duration-75 ease-out select-none disabled:opacity-50 focus:outline-none rounded-xs text-11 xxl:text-12"
    :class="{
      'py-1': !large && !noPadding,
      'py-2': large && !noPadding,
      'rounded-full': round,
      'pointer-events-none bg-grey-pure bg-opacity-10 dark:bg-grey-pure dark:bg-opacity-10 text-grey-pure':disabled || loading,
      'bg-white bg-opacity-100 text-brand active:bg-grey-light dark:active:bg-white hover:text-ocean-blue-pure hover:bg-opacity-50 dark:active:bg-opacity-38 dark:hover:bg-opacity-25 dark:text-light  dark:bg-opacity-10': color === 'white' && !disabled && !loading,
      'bg-grey-light bg-opacity-25 hover:bg-opacity-50 focus:bg-opacity-50 active:bg-opacity-75 text-ocean-blue-pure dark:text-white': color === 'grey-light',
      'bg-grey-pure bg-opacity-10 hover:bg-opacity-17 focus:bg-opacity-17': color === 'grey',
      'bg-purple-pure bg-opacity-10 dark:bg-opacity-20 hover:bg-opacity-25 focus:bg-opacity-25 dark:hover:bg-opacity-38 dark:focus:bg-opacity-38 text-purple-pure': color === 'purple',
      'bg-ocean-blue-pure bg-opacity-10 dark:bg-opacity-17 hover:bg-opacity-25 focus:bg-opacity-25 active:bg-opacity-38 dark:active:bg-opacity-38 dark:hover:bg-opacity-25 dark:focus:bg-opacity-25 text-ocean-blue-pure': color === 'ocean-blue',
      'bg-blue-pure bg-opacity-10 dark:bg-opacity-10 hover:bg-opacity-25 focus:bg-opacity-25 dark:hover:bg-opacity-25 dark:focus:bg-opacity-25 text-blue-pure': color === 'blue',
      'bg-green-pure bg-opacity-10 hover:bg-opacity-20 focus:bg-opacity-20 text-green-pure': color === 'green',
      'bg-yellow-pure bg-opacity-10 hover:bg-opacity-25 focus:bg-opacity-25 text-yellow-pure': color === 'yellow',
      'bg-orange-pure bg-opacity-10 hover:bg-opacity-25 focus:bg-opacity-25 text-orange-pure': color === 'orange',
      'bg-passion-orange-pure bg-opacity-10 hover:bg-opacity-25 focus:bg-opacity-25 text-passion-orange-pure': color === 'passion-orange',
      'bg-red-600 bg-opacity-10 hover:bg-opacity-25 focus:bg-opacity-25 text-red-600': color === 'red',
      'bg-red-800 bg-opacity-10 hover:bg-opacity-25 focus:bg-opacity-25 text-red-800': color === 'red-dark',
    }"
    v-bind="$attrs"
    :disabled="disabled || loading"
    v-on="$listeners"
  >
    <SVGSpinner v-if="loading" class="h-3 animate-spin-loading" />
    <slot v-else/>
  </button>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import SVGSpinner from '@/assets/icons/spinner.svg'

export default defineComponent({
  components: {
    SVGSpinner,
  },
  props: {
    disabled: { type: Boolean, default: false },
    color: { type: String, default: null },
    large: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    noPadding: { type: Boolean, default: false },
  },
})
</script>
