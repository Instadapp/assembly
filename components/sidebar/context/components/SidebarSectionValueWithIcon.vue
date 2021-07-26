<template>
  <div class="flex flex-col items-center justify-center text-center flex-shrink-0">
    <slot name="icon" />

    <value-display class="mt-4" :label="label">
      <slot name="value" />
    </value-display>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import ValueDisplay from './ValueDisplay.vue'

export default defineComponent({
  components: { ValueDisplay },
  props: {
    label: { type: String, required: true },
  },
})
</script>
