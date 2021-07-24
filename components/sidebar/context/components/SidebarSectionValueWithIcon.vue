<template>
  <div class="flex items-center justify-between flex-shrink-0">
    <ValueDisplay class="mr-3" :label="label">
      <slot name="value" />
    </ValueDisplay>

    <slot name="icon" />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    label: { type: String, required: true },
  },
})
</script>
