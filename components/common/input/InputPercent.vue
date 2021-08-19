<template>
  <div class="flex flex-col flex-shrink-0 w-full">
    <div class="relative rounded-sm">
      <input
        autocomplete="off"
        class="w-full pl-4 pr-6 py-2 rounded-[6px] border border-grey-dark border-opacity-[0.15]"
        :class="{ 'text-right': right, 'bg-primary-gray/[.15] text-primary-gray': $attrs.disabled }"
        type="text"
        inputmode="decimal"
        :value="value"
        v-bind="$attrs"
        v-on="inputListeners"
      />

      <div
        v-if="!$attrs.disabled"
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none select-none"
      >
        <span
          class="font-semibold text-ocean-blue-pure text-11 dark:text-light"
        >
          %
        </span>
      </div>
    </div>

    <div class="h-0">
      <transition
        enter-active-class="duration-75 ease-out"
        enter-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-75 ease-in"
        leave-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <p
          v-if="touched && showError && error"
          class="mt-1 text-red-600 text-11"
        >
          {{ error }}
        </p>
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
    value: { type: String, default: '0' },
    showError: { type: Boolean, default: false },
    error: { type: String, default: null },
    max: {
      type: String,
      default: '100',
    },
    right: { type: Boolean, default: false },
  },

  setup(props, context) {
    const { amountPattern } = usePattern()
    const amountFilter = (value) => amountPattern.test(value)

    const params = { max: props.max }

    const { inputListeners } = useInputListeners(props, context, amountFilter, params)

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
