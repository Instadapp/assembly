<template>
  <div v-if="filteredAssets.length" class="pb-6">
    <CardCurrency
      v-for="token in filteredAssets"
      :key="token.address"
      class="mt-2 sm:mt-4 first:mt-0"
      :token-key="token.key"
      :balance="token.balance"
      :net-worth="token.netWorth"
      :symbol="token.symbol"
      :action-label="actionLabel"
      @action="$emit('action', token.key)"
    />
  </div>
  <div v-else>
    <NoSearchResults :search="search" />
    <slot name="no-items" />
  </div>
</template>

<script>
import { computed, defineComponent, watchEffect } from '@nuxtjs/composition-api'
import { useSearchFilter } from '~/composables/useSearchFilter'
import { useToken } from '~/composables/useToken'

export default defineComponent({
  props: {
    search: { type: String, default: null },
    type: { type: String },
    actionLabel: { type: String, required: true },
  },
  setup(props) {
    const { assets } = useToken()

    const typedAssets = computed(() => assets.value(props.type))

    const { filtered: filteredAssets, search } = useSearchFilter(typedAssets, 'name', 'symbol')
    watchEffect(() => (search.value = props.search))

    return { filteredAssets }
  },
})
</script>
