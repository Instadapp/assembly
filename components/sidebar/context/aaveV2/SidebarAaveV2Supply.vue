<template>
  <SidebarContextRootContainer>
    <template #title>Supply {{ symbol }}</template>

    <SidebarSectionValueWithIcon class="mt-2" label="Token Balance">
      <template #icon
        ><IconCurrency :currency="rootTokenKey" class="w-20 h-20" noHeight
      /></template>
      <template #value>{{ balance }} {{ symbol }}</template>
    </SidebarSectionValueWithIcon>

    <div class="bg-background mt-6 p-8">
      <input-numeric v-model="amount" placeholder="Amount to supply" />
    </div>
  </SidebarContextRootContainer>
</template>

<script>
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import InputNumeric from '~/components/common/input/InputNumeric.vue'
import { useAaveV2Position } from '~/composables/useAaveV2Position'
import { useFormatting } from '~/composables/useFormatting'
import { useToken } from '~/composables/useToken'

export default defineComponent({
  components: { InputNumeric },
  props: {
    tokenKey: { type: String, required: true },
  },
  setup(props) {
    const { status, displayPositions } = useAaveV2Position()
    // const { formatUsd, formatUsdMax, formatNumber, formatDecimal } = useFormatting()

    const amount = ref('')

    const rootTokenKey = computed(() => 'eth')

    const { getTokenByKey } = useToken()

    const token = computed(() => getTokenByKey(props.tokenKey))
    const symbol = computed(() => token.value?.symbol)


    const balance = computed(() => "0")

    return {
      amount,
      status,
      rootTokenKey,
      token,
      symbol,
      balance,
    }
  },
})
</script>
