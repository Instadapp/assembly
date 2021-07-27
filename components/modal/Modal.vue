<template>
  <transition :duration="{ enter: 300, leave: 200 }">
    <div v-show="isShown" class="fixed inset-0 z-10 overflow-y-auto pointer-events-auto">
      <div
        class="flex flex-col items-center justify-end min-h-screen px-4 pt-4 pb-20 text-center sm:justify-center sm:p-0"
      >
        <transition
          enter-active-class="duration-300 ease-out"
          enter-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="duration-200 ease-in"
          leave-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isShown"
            class="fixed inset-0 z-20 bg-white dark:bg-dark-500 bg-opacity-70 dark:bg-opacity-70"
            @click="close"
          ></div>
        </transition>

        <transition
          enter-active-class="duration-300 ease-out transform"
          enter-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
          enter-to-class="translate-y-0 opacity-100 sm:scale-100"
          leave-active-class="duration-200 ease-in transform"
          leave-class="translate-y-0 opacity-100 sm:scale-100"
          leave-to-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
        >
          <div :is="modal" v-if="isShown" v-bind="props" class="z-30"></div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useModal } from '~/composables/useModal'

export default defineComponent({
  props: {
    show: { type: Boolean, default: false },
  },
  setup() {
    const { isShown, props, modal, close } = useModal()
    return { isShown, props, modal, close }
  },
})
</script>
