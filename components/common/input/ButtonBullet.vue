<template>
  <div
    class="flex items-center cursor-pointer group"
    @click="$emit('change', value)"
  >
    <div
      class="flex items-center justify-center w-5 h-5 duration-150 border rounded-full transition-color group-hover:border-ocean-blue-pure dark:group-hover:border-light"
      :class="{
        'border-ocean-blue-pure dark:border-light': checked,
        'border-grey-pure': !checked
      }"
    >
      <div
        v-if="checked"
        class="w-2 h-2 rounded-full bg-ocean-blue-pure dark:bg-light"
      ></div>
    </div>
    <div v-if="label" :class="labelClasses">{{ label }}</div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {},
    checked: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    labelClasses: {
      type: String,
      default: 'ml-2 font-medium',
    },
  },
})
</script>

<style></style>
