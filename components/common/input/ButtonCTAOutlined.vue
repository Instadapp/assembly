<template>
  <button
    class="flex items-center justify-center flex-shrink-0 py-2 font-semibold whitespace-no-wrap duration-75 ease-out transform rounded-[4px] select-none border border-ocean-blue-pure text-ocean-blue-pure shadow-cta focus:outline-none dark:shadow-none"
    :class="{
      'bg-opacity-50 pointer-events-none': disabled && !loading,
      'hover:-translate-y-px': !disabled && !loading,
      'active:translate-y-px': !disabled && !loading
    }"
    :disabled="disabled || loading"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot v-if="!loading" />
    <CustomTransition
      enter-active-class="duration-200 ease-out"
      enter-class="w-0 ml-0 opacity-0"
      enter-to-class="w-4 opacity-100"
      after-enter-class="w-4 "
      leave-active-class="duration-100 ease-in"
      leave-class="w-4 opacity-100"
      leave-to-class="w-0 ml-0 opacity-0"
    >
      <SVGSpinner v-if="loading" class="h-4 animate-spin-loading" />
    </CustomTransition>
  </button>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import SVGSpinner from '@/assets/icons/spinner.svg?inline'

export default defineComponent({
  components: {
    SVGSpinner,
  },
  props: {
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
})
</script>
