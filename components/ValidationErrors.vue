<template>
  <transition
    enter-active-class="duration-75 ease-out"
    enter-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-75 ease-in"
    leave-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <Alert v-if="!!errorMessages.length" v-bind="$attrs">
      <!-- <h3 class="font-medium leading-5 text-red-500 text-12">There are errors with your submission</h3> -->
      <div class="mb-1 font-medium leading-5 text-red-700 last:mb-0 text-12">
        <ul class="pl-4 list-disc">
          <li v-for="(errorMessage, index) in errorMessages" :key="index">
            {{ errorMessage }}
          </li>
        </ul>
      </div>
    </Alert>
  </transition>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  inheritAttrs: false,
  props: {
    errorMessages: { type: Array, required: true },
  },
})
</script>
