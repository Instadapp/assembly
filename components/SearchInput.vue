<template>
  <div class="relative flex items-center w-full">
    <input
      class="w-full pr-4"
      type="text"
      v-bind="$attrs"
      :class="{ 'pl-9 py-1': dense, 'pl-12': !dense }"
      v-on="inputListeners"
    />
    <SVGSearch class="absolute w-4 h-4 search-icon" :style="dense ? 'left:12px' : 'left:18px'" />
  </div>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
import SVGSearch from '~/assets/icons/search.svg?inline'

export default defineComponent({
  props: {
    dense: { type: Boolean, default: false },
  },
  inheritAttrs: false,
  components: {
    SVGSearch,
  },
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
