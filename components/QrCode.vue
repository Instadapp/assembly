<template>
  <div
    class="flex items-center justify-center"
    :style="{
      width: width + 'px',
      height: width + 'px',
    }"
  >
    <transition
      enter-active-class="duration-300 ease-out"
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
      @leave="show = false"
      @after-leave="show = true"
    >
      <img
        v-if="show && !!src"
        :width="width"
        :height="width"
        :src="src"
        alt="QR Code"
        class="w-full h-full overflow-hidden rounded-xs"
      />
    </transition>
  </div>
</template>

<script>
import { defineComponent, watch, ref, useContext, onUnmounted } from '@nuxtjs/composition-api'
import { toDataURL } from 'qrcode'

export default defineComponent({
  props: {
    value: { type: String, required: true },
    width: { type: Number, default: 220 },
  },
  setup(props, context) {
    const src = ref(null)
    const show = ref(true)

    watch(
      () => [props.value],
      async ([value]) => {
        URL.revokeObjectURL(src.value)

        src.value = null

        if (!value) return

        src.value = await toDataURL(value, {
          width: props.width,
          margin: 0,
          color: {
            light: '#00000000',
            dark: '#131E40ff',
          },
        })
      },
      { immediate: true }
    )

    onUnmounted(() => URL.revokeObjectURL(src.value))

    return { src, show }
  },
})
</script>
