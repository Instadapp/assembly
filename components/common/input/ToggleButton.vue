<template>
  <div
    class="relative flex items-center group"
    :class="{
      'cursor-pointer': !disabled && !loading,
      'pointer-events-none': disabled || loading
    }"
    v-bind="$attrs"
    role="checkbox"
    :aria-checked="checked"
    @click="toggle"
  >
    <div
      class="box-content flex w-10 h-5 transition-colors duration-75 rounded-full p-0.5"
      :class="{
        'bg-primary-blue-dark': checked,
        'bg-grey-light  group-hover:bg-grey-pure group-hover:bg-opacity-20 focus:bg-grey-pure focus:bg-opacity-20 dark:group-hover:bg-opacity-38 dark:bg-opacity-20 ': !checked
      }"
    />
    <div
      class="absolute shadow flex items-center justify-center w-4 h-4 transition-transform duration-300 ease-out transform bg-white rounded-full"
      style="top: calc(50% - 0.5rem)"
      :style="{ transform }"
    >
      <spinner v-if="loading" class="text-primary-blue-dark" />
    </div>
    <span v-if="label" class="ml-2 font-semibold text-primary-gray">{{ label }}</span>
  </div>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
import Spinner from '~/components/Spinner.vue'

export default defineComponent({
  components: { Spinner },
  inheritAttrs: false,
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    label: { type: String, default: '' },
  },
  setup(props, context) {
    function toggle() {
      if (props.disabled || props.loading) return

      context.emit('change', !props.checked)
    }

    const transform = computed(() => (props.checked ? 'translateX(calc(2px + 2.5rem - 1.25rem))' : 'translateX(2px)'))

    return { toggle, transform }
  },
})
</script>
