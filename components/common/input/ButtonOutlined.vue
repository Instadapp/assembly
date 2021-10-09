<template>
  <button
    class="flex items-center justify-center flex-shrink-0 font-semibold whitespace-no-wrap transition-colors duration-75 ease-out select-none disabled:opacity-50 focus:outline-none rounded text-sm px-2 bg-white border dark:bg-dark-500"
    :disabled="disabled"
    :class="{
      'text-ocean-blue-pure border-grey-light dark:text-ocean-blue-pale dark:hover:border-ocean-blue-pale hover:border-ocean-blue-pure hover:bg-ocean-blue-light hover:bg-opacity-38  dark:hover:bg-ocean-blue-pure dark:hover:bg-opacity-25 active:bg-opacity-100 dark:active:bg-opacity-38': !disabled,
      'border-grey-light dark:border-opacity-50 text-grey-pure': disabled,
      'h-8': size === 'md',
      'h-6': size === 'sm'
    }"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <SVGSpinner v-if="loading" class="h-3 animate-spin-loading" />
    <slot v-else />
  </button>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import SVGSpinner from '@/assets/img/icons/spinner.svg?inline'

export default defineComponent({
  components : {SVGSpinner},
  props: {
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    size: { type: String, default: 'md' },
  },
})
</script>
