<template>
  <div class="relative overflow-hidden rounded-[5px] border border-primary-gray border-opacity-[0.15]">
    <div class="w-full h-2 bg-white"></div>
    <div
      class="absolute inset-0 transition-transform duration-200 ease-out"
      :style="{ transform }"
      :class="{
        'bg-red-800': color === 'red-dark',
        'bg-red-pure': color === 'red',
        'bg-passion-orange-pure': color === 'passion-orange',
        'bg-orange-pure': color === 'orange',
        'bg-yellow-pure': color === 'yellow',
        'bg-green-pure': color === 'green-pure',
        'bg-ocean-blue-pure': color === 'ocean-blue',
        'bg-grey-pure': color === 'grey',
      }"
    ></div>
  </div>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useBigNumber } from '~/composables/useBigNumber'

export default defineComponent({
  props: {
    // Range: 0.0 - 1.0
    progress: { type: String, default: '0' },
    color: { type: String, default: 'ocean-blue' },
  },
  setup(props) {
    const { min, minus, times } = useBigNumber()
    const transform = computed(() => `translateX(-${minus('100', times(min(props.progress, 1), '100')).toFixed()}%)`)
    return { transform }
  },
})
</script>
