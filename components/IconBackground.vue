<template>
  <div
    class="flex items-center justify-center flex-shrink-0 rounded-full"
    :class="{
      'bg-opacity-10': !noOpacity,
      'w-12 h-12': large,
      'w-10 h-10': !large,
    }"
  >
    <Icon
      :type="type"
      :name="name"
      :class="{
        'h-6': !iconClass,
        [iconClass]: !!iconClass,
      }"
    />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    name: { type: String, required: true },
    type: { type: String, default: 'outline' },
    noOpacity: { type: Boolean, default: false },
    large: { type: Boolean, default: true },
    iconClass: { type: String },
  },
})
</script>
