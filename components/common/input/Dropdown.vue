<template>
  <div ref="menu" class="relative inline-block text-left">
    <slot name="trigger" :toggle="toggle" :is-shown="isShown" />
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <slot v-if="isShown" name="menu" :close="close" />
    </transition>
  </div>
</template>

<script>
import { defineComponent, onBeforeUnmount, onMounted, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const menu = ref(null)
    const isShown = ref(false)

    function toggle() {
      isShown.value = !isShown.value
    }

    function close() {
      isShown.value = false
    }

    function closeOnOutsideClick(event) {
      if (!isShown.value) return
      if (menu.value.contains(event.target)) return

      close()
    }

    onMounted(() => window.addEventListener('click', closeOnOutsideClick))
    onBeforeUnmount(() => window.removeEventListener('click', closeOnOutsideClick))

    return { toggle, isShown, menu, close }
  },
})
</script>
