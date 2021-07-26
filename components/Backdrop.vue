<template>
  <transition
    enter-active-class="duration-300 ease-out"
    enter-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-10 bg-primary-black bg-opacity-20"
      v-on="$listeners"
    ></div>
  </transition>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    show: { type: Boolean, default: false },
  },
  setup() {
    return {}
  },
})
</script>
