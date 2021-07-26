<template>
  <div class="flex flex-col items-center">
    <div class="h-6 font-medium text-24">
      <Spinner v-if="loading" class="w-5 h-5" />
      <slot v-else name="default" />
    </div>

    <value-display-label class="flex mb-2 mt-3"
      >{{ label }} <Info v-if="tooltip" :text="tooltip" class="ml-1" />
    </value-display-label>

    <transition
      enter-active-class="duration-200 ease-out"
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="!!$slots.badge">
        <Badge color="blue" class="mt-1">
          <slot name="badge" />
        </Badge>
      </div>
    </transition>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import ValueDisplayLabel from './ValueDisplayLabel.vue'

export default defineComponent({
  components: { ValueDisplayLabel },
  props: {
    label: { type: String, default: null },
    loading: { type: Boolean, default: false },
    tooltip: { type: String, default: null },
  },
})
</script>
