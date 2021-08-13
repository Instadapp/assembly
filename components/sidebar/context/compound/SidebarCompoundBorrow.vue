<template>
  <SidebarContextRootContainer>
    <template #title>Borrow {{ symbol }}</template>

    <SidebarSectionValueWithIcon class="mt-6" label="Borrowed" center>
      <template #icon
        ><IconCurrency :currency="rootTokenKey" class="w-20 h-20" noHeight
      /></template>
      <template #value>{{ formatNumber(balance) }} {{ symbol }}</template>
    </SidebarSectionValueWithIcon>

    <div class="bg-[#C5CCE1] bg-opacity-[0.15] mt-10 p-8">
      <h3 class="text-primary-gray text-xs font-semibold mb-2.5">
        Amount to borrow
      </h3>

      <input-numeric
        v-model="amount"
        placeholder="Amount to borrow"
        :error="errors.amount.message"
      >
      </input-numeric>

      <SidebarContextHeading class="mt-5">
        Projected Debt Position
      </SidebarContextHeading>

      <SidebarSectionStatus
        class="mt-8"
        :liquidation="liquidation"
        :status="status"
      />

      <SidebarSectionValueWithIcon class="mt-8" label="Liquidation Price (ETH)">
        <template #value>
          {{ formatUsdMax(liquidationPrice, liquidationMaxPrice) }}
          <span class="text-primary-gray"
            >/ {{ formatUsd(liquidationMaxPrice) }}</span
          >
        </template>
      </SidebarSectionValueWithIcon>

      <div class="flex flex-shrink-0 mt-10">
        <ButtonCTA
          class="w-full"
          :disabled="!isValid || pending"
          :loading="pending"
          @click="cast"
        >
          Borrow
        </ButtonCTA>
      </div>

      <ValidationErrors :error-messages="errorMessages" class="mt-6" />
    </div>
  </SidebarContextRootContainer>
</template>

<script>
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import InputNumeric from '~/components/common/input/InputNumeric.vue'
import { useBigNumber } from '~/composables/useBigNumber'
import { useFormatting } from '~/composables/useFormatting'
import { useValidators } from '~/composables/useValidators'
import { useValidation } from '~/composables/useValidation'
import { useToken } from '~/composables/useToken'
import { useParsing } from '~/composables/useParsing'
import { useWeb3 } from '~/composables/useWeb3'
import ToggleButton from '~/components/common/input/ToggleButton.vue'
import { useDSA } from '~/composables/useDSA'
import ButtonCTA from '~/components/common/input/ButtonCTA.vue'
import { useNotification } from '~/composables/useNotification'
import Button from '~/components/Button.vue'
import { useSidebar } from '~/composables/useSidebar'
import { useCompoundPosition } from '~/composables/protocols/useCompoundPosition'
import ctokens from '~/constant/ctokens'
import tokenIdMapping from '~/constant/tokenIdMapping'

export default defineComponent({
  components: { InputNumeric, ToggleButton, ButtonCTA, Button },
  props: {
    tokenId: { type: String, required: true },
  },
  setup(props) {
    const { close } = useSidebar()
    const { networkName, account } = useWeb3()
    const { dsa } = useDSA()
    const { getTokenByKey, valInt } = useToken()
    const { formatNumber, formatUsdMax, formatUsd } = useFormatting()
    const { isZero, gt, div, plus } = useBigNumber()
    const { parseSafeFloat } = useParsing()
    const { showPendingTransaction, showWarning } = useNotification()

    const tokenId = computed(() => props.tokenId)
    const tokenKey = computed(() => tokenIdMapping.idToToken[tokenId.value])

    const rootTokenKey = computed(() => ctokens[networkName.value].rootTokens.includes(tokenKey.value) ? tokenKey.value : 'eth')

    const { stats, status: initialStatus, position, displayPositions, liquidation, liquidationPrice, liquidationMaxPrice } = useCompoundPosition({
      overridePosition: (position) => {
        if (tokenId.value !== position.cTokenId) return position

        return {
          ...position,
          borrow: plus(position.borrow, amountParsed.value).toFixed(),
        }
      },
    })

    const status = computed(() => {
      if (!amountParsed.value) return initialStatus.value

      return div(stats.value.totalBorrowInEth, stats.value.totalSupplyInEth).toFixed()
    })

    const amount = ref('')
    const amountParsed = computed(() => parseSafeFloat(amount.value))

    const currentPosition = computed(() =>
      position.value?.data.find((position) => position.cTokenId === tokenId.value)
    )

    const token = computed(() => getTokenByKey(rootTokenKey.value))
    const symbol = computed(() => token.value?.symbol)
    const decimals = computed(() => token.value?.decimals)
    const balance = computed(() => {
      return currentPosition.value?.borrow || '0'
    })

    const { validateAmount, validateLiquidation, validateLiquidity, validateIsLoggedIn } = useValidators()
    const errors = computed(() => {
      const hasAmountValue = !isZero(amount.value)

      return {
        amount: { message: validateAmount(amountParsed.value), show: hasAmountValue },
        liquidation: { message: validateLiquidation(status.value, liquidation.value), show: hasAmountValue },
        auth: { message: validateIsLoggedIn(!!account.value), show: true },
      }
    })
    const { errorMessages, isValid } = useValidation(errors)

    const pending = ref(false)

    async function cast() {
      pending.value = true

      const amount = valInt(amountParsed.value, decimals.value)

      const spells = dsa.value.Spell()

      spells.add({
        connector: 'compound',
        method: 'borrow',
        args: [tokenId.value, amount, 0, 0],
      })

      try {
        const txHash = await dsa.value.cast({
          spells,
          from: account.value,
        })

        showPendingTransaction(txHash)
      } catch (error) {
        showWarning(error.message)
      }

      pending.value = false

      close()
    }

    return {
      stats,
      pending,
      cast,
      errors,
      amount,
      status,
      liquidation,
      rootTokenKey,
      token,
      symbol,
      balance,
      formatNumber,
      formatUsdMax,
      formatUsd,
      liquidationPrice,
      liquidationMaxPrice,
      errorMessages,
      isValid,
    }
  },
})
</script>
