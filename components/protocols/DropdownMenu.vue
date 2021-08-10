<template>
  <div
    class="rounded-lg flex-shrink-0 bg-white absolute z-10 flex flex-col py-2 mt-1 overflow-hidden border border-opacity-25 select-none shadow-notification dark:bg-dark-400 dark:border-opacity-20 border-ocean-blue-pure"
    :class="{
      'right-0 origin-top-right': align === 'right',
      'left-0 origin-top-left': align === 'left',
    }"
  >
    <slot />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    align: { type: String, default: 'right' },
  },
})
</script>
