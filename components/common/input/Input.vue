<template>
  <input class="w-full px-4 py-2 rounded-[6px] border border-grey-dark border-opacity-[0.15]" v-bind="$attrs" v-on="inputListeners" />
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  inheritAttrs: false,
  setup(props, context) {
    // Source: https://vuejs.org/v2/guide/components-custom-events.html#Binding-Native-Events-to-Components
    const inputListeners = computed(() =>
      Object.assign({}, context.listeners, {
        input(event) {
          context.emit('input', event.target.value)
        },
      })
    )

    return { inputListeners }
  },
})
</script>
