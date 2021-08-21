<template>
  <button
    class="flex items-center justify-center px-4 font-semibold leading-none transition-colors duration-150 border border-dashed cursor-pointer  focus:outline-none rounded-[4px]"
    :class="{
      'w-full': fullWidth,
      'text-ocean-blue-pure dark:text-white border-ocean-blue-pure dark:border-grey-pure bg-ocean-blue-light border-opacity-25 bg-opacity-38 dark:bg-opacity-17 dark:hover:bg-opacity-25 hover:bg-opacity-75 active:bg-opacity-38 dark:active:bg-opacity-38 ':
        color === 'ocean-blue',
    }"
    :style="`height: ${height}`"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </button>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    color: { type: String, default: 'grey' },
    height: { type: String, default: '60px' },
    fullWidth: { type: Boolean, default: false },
  },
})
</script>

<style></style>
