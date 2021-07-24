<template>
  <SidebarContextRootContainer>
    <template #title>Supply SYMBOL</template>

    <SidebarSectionValueWithIcon class="mt-6" label="Token Balance">
      <template #icon><IconCurrency :currency="rootTokenKey"/></template>
      <template #value>BALANCE</template>
    </SidebarSectionValueWithIcon>

    <hr />

    <InputNumeric
      v-model="amount"
      :disabled="pending"
      class="mt-6"
      placeholder="Amount to supply"
      :error="'ERROR'"
    />

    <hr />

    <div class="flex items-center justify-between mt-6">
      <div class="font-semibold">Set Max</div>

      <ToggleButton :checked="isMaxAmount" @change="toggle" />
    </div>

    <SidebarContextHeading class="mt-6"
      >Projected Debt Position
    </SidebarContextHeading>

    <hr />

    <SidebarSectionStatus
      class="mt-6"
      :liquidation="maxLiquidation"
      :status="status"
    />

    <hr />

    <!-- prettier-ignore -->
    <SidebarSectionValueWithIcon class="mt-6" label="Liquidation Price (ETH)">
      <template #value>{{ formatUsdMax(liquidationPrice, liquidationMaxPrice) }} / {{ formatUsd(liquidationMaxPrice) }}</template>
    </SidebarSectionValueWithIcon>

    <hr />

    <div class="flex flex-shrink-0 mt-6">
      <ButtonCTA
        class="w-full"
        :disabled="!isValid || pending"
        :loading="pending"
        @click="cast"
        >Supply</ButtonCTA
      >
    </div>

    <ValidationErrors :error-messages="errorMessages" class="mt-6" />
  </SidebarContextRootContainer>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useAaveV2Position } from '~/composables/useAaveV2Position'
import { useFormatting } from '~/composables/useFormatting'

export default defineComponent({
  props: {
    tokenKey: { type: String, required: true },
  },
  setup(props) {
    const { status } = useAaveV2Position()
    const { formatUsd, formatUsdMax, formatNumber, formatDecimal } = useFormatting()


    return {
      status,

      formatUsd, formatUsdMax, formatNumber, formatDecimal,
    }
  },
})
</script>
