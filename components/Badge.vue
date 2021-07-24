<template>
  <div
    class="flex items-center justify-center flex-shrink-0 px-2 py-1 leading-none whitespace-no-wrap transition-colors duration-75 ease-out select-none xxl:font-semibold rounded-xs"
    :class="{
      'text-9': !large,
      'text-12': large,
      'bg-green-pure text-green-light dark:bg-opacity-17 dark:text-light': color === 'green-pure',
      'bg-grey-pure bg-opacity-17 text-grey-pure': color === 'grey',
      'bg-blue-pure bg-opacity-20 text-blue-pure': color === 'blue',
      'bg-green-pure bg-opacity-20 text-green-pure': color === 'green',
      'bg-yellow-pure bg-opacity-25 text-yellow-pure': color === 'yellow',
      'bg-orange-pure bg-opacity-25 text-orange-pure': color === 'orange',
      'bg-passion-orange-pure bg-opacity-25 text-passion-orange-pure': color === 'passion-orange',
      'bg-red-pure dark:bg-opacity-25 text-white dark:text-light': color === 'red',
      'bg-red-800 bg-opacity-25 text-red-800': color === 'red-dark',
    }"
  >
    <slot />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    color: { type: String, default: null },
    large: { type: Boolean, default: false },
  },
})
</script>
