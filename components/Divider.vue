<template>
  <div v-if="vertical" class="w-px bg-grey-light dark:bg-opacity-38"></div>
  <div v-else class="flex items-center justify-center w-full">
    <hr class="w-full mt-0" />
    <div v-if="$slots.default" class="flex items-center justify-center">
      <span class="px-4 font-medium leading-none text-14 text-grey-pure">
        <slot></slot>
      </span>
    </div>
    <hr class="w-full mt-0" />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    vertical: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
