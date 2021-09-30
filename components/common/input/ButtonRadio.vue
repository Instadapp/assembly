<template>
  <button
    :disabled="disabled"
    class="flex items-center justify-center flex-shrink-0 font-semibold whitespace-no-wrap transition-colors duration-75 ease-out select-none disabled:opacity-50 focus:outline-none rounded text-sm bg-white border"
    :class="{
      'text-ocean-blue-pure border-ocean-blue-pure dark:text-ocean-blue-pale dark:border-ocean-blue-pale':
        active && !disabled,
      'border-grey-light text-navi hover:text-ocean-blue-pure hover:border-ocean-blue-pure focus:text-ocean-blue-pure focus:border-ocean-blue-pure':
        !active && !disabled,
      'border-grey-pure text-grey-pure': disabled,
    }"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    active: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
})
</script>
