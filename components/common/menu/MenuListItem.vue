<template>
  <div
    class="flex items-center px-4 py-3 font-semibold transition-colors duration-150 text-12 dark:bg-opacity-17"
    :class="{
      'pointer-events-none text-grey-pure': disabled,
      'cursor-pointer text-ocean-blue-pure hover:bg-ocean-blue-light dark:text-light': !disabled,
    }"
    v-on="$listeners"
  >
    <div :is="icon" v-if="icon" class="mr-2" :class="{ 'w-5 h-5': largeIcon, 'w-3 h-3': !largeIcon }"></div>
    <div class="leading-none">
      {{ item }}
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    item: { type: String, required: true },
    icon: { type: Object },
    disabled: { type: Boolean, default: false },
    largeIcon: { type: Boolean, default: false },
  },
})
</script>
<style></style>
