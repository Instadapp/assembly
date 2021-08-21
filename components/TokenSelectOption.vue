<template>
  <div class="flex items-center">
    <IconCurrency :currency="tokenKey" no-height class="w-8 h-8" />
    <div
      class="ml-2 font-semibold text-center text-ocean-blue-pure text-12 dark:text-light"
    >
      {{ symbol }}
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useToken } from '~/composables/useToken'

export default defineComponent({
  props: {
    tokenKey: { type: String, required: true },
  },
  setup(props) {
    const { getTokenByKey } = useToken()
    return { symbol: computed(() => getTokenByKey(props.tokenKey)?.symbol) }
  },
})
</script>
