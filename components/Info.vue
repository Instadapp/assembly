<template>
  <div
    v-tooltip="{
      content: text,
      classes: 'max-w-xs',
      trigger: 'hover click',
    }"
    class="flex items-center justify-center w-4 h-4 leading-none transition-colors duration-150 cursor-pointer  text-9 hover:text-ocean-blue-pure dark:hover:text-light text-grey-pure"
  >
    <SVGPrice v-if="icon === 'price'" />
    <SVGInfo v-else />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import SVGInfo from '@/assets/icons/info.svg?inline'
import SVGPrice from '@/assets/icons/price.svg?inline'

export default defineComponent({
  props: {
    text: {
      type: String,
      default: 'No "text" prop passed',
    },
    icon: {
      type: String,
      default: 'info',
    },
  },
  components: { SVGInfo, SVGPrice },
})
</script>

<style></style>
