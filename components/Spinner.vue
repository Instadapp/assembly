<template>
  <SVGSpinner v-bind="$attrs" class="animate-spin-loading" v-on="$listeners" />
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import SVGSpinner from '@/assets/icons/spinner.svg?inline'

export default defineComponent({
  components: {
    SVGSpinner,
  },
})
</script>
