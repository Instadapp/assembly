<template>
  <div class="flex flex-col flex-shrink-0 w-full">
    <input
      autocomplete="off"
      class="w-full pl-8 pr-8 rounded-[6px] border border-grey-dark border-opacity-[0.15]"
      type="text"
      inputmode="decimal"
      :value="value"
      v-bind="$attrs"
      v-on="inputListeners"
    />

    <div class="h-0">
      <transition
        enter-active-class="duration-75 ease-out"
        enter-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-75 ease-in"
        leave-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <p v-if="touched && showError && error" class="mt-1 text-red-600 text-11">{{ error }}</p>
      </transition>
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, ref } from '@nuxtjs/composition-api'
import { useInputListeners } from '@/composables/useInputListeners'
import { usePattern } from '@/composables/usePattern'

export default defineComponent({
  inheritAttrs: false,
  props: {
    value: { type: String, default: '' },
    showError: { type: Boolean, default: false },
    error: { type: String, default: null },
  },

  setup(props, context) {
    const { amountPattern } = usePattern()
    const amountFilter = (value) => amountPattern.test(value)

    const { inputListeners } = useInputListeners(props, context, amountFilter)

    const touched = ref(false)
    const stopTouchedWatcher = watch(
      () => props.value,
      () => {
        touched.value = true
        stopTouchedWatcher()
      }
    )

    return { inputListeners, touched }
  },
})
</script>
