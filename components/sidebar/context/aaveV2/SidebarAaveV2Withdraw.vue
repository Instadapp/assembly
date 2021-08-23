<template>
  <SidebarContextRootContainer>
    <template #title>Withdraw {{ symbol }}</template>

    <SidebarSectionValueWithIcon label="Token Balance" center>
      <template #icon
        ><IconCurrency :currency="rootTokenKey" class="w-20 h-20" noHeight
      /></template>
      <template #value
        >{{ formatNumber(originalBalance) }} {{ symbol }}</template
      >
    </SidebarSectionValueWithIcon>

    <div class="bg-[#C5CCE1] bg-opacity-[0.15] mt-10 p-8">
      <h3 class="text-primary-gray text-xs font-semibold mb-2.5">
        Amount to withdraw
      </h3>

      <input-numeric
        v-model="amount"
        placeholder="Amount to withdraw"
        :error="errors.amount.message"
      >
        <template v-if="!isMaxAmount" #suffix>
          <div class="absolute mt-2 top-0 right-0 mr-4">
            <button
              type="button"
              class="text-primary-blue-dark font-semibold text-sm hover:text-primary-blue-hover"
              @click="toggle"
            >
              Max
            </button>
          </div>
        </template>
      </input-numeric>

      <SidebarContextHeading class="mt-5">
        Projected Debt Position
      </SidebarContextHeading>

      <SidebarSectionStatus
        class="mt-8"
        :liquidation="maxLiquidation"
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
          Withdraw
        </ButtonCTA>
      </div>

      <ValidationErrors :error-messages="errorMessages" class="mt-6" />
    </div>
  </SidebarContextRootContainer>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import InputNumeric from '~/components/common/input/InputNumeric.vue'
import { useAaveV2Position } from '~/composables/protocols/useAaveV2Position'
import { useBalances } from '~/composables/useBalances'
import { useBigNumber } from '~/composables/useBigNumber'
import { useFormatting } from '~/composables/useFormatting'
import { useValidators } from '~/composables/useValidators'
import { useValidation } from '~/composables/useValidation'
import { useToken } from '~/composables/useToken'
import { useParsing } from '~/composables/useParsing'
import { useMaxAmountActive } from '~/composables/useMaxAmountActive'
import { useWeb3 } from '~/composables/useWeb3'
import atokens from '~/constant/atokens'
import ToggleButton from '~/components/common/input/ToggleButton.vue'
import { useDSA } from '~/composables/useDSA'
import ButtonCTA from '~/components/common/input/ButtonCTA.vue'
import { useNotification } from '~/composables/useNotification'
import Button from '~/components/Button.vue'
import { useSidebar } from '~/composables/useSidebar'

export default defineComponent({
  components: { InputNumeric, ToggleButton, ButtonCTA, Button },
  props: {
    tokenKey: { type: String, required: true },
  },
  setup(props) {
    const { close } = useSidebar()
    const { networkName, account } = useWeb3()
    const { dsa } = useDSA()
    const { getTokenByKey, valInt } = useToken()
    const { formatNumber, formatUsdMax, formatUsd } = useFormatting()
    const { isZero, gt, plus, max, minus } = useBigNumber()
    const { parseSafeFloat } = useParsing()
    const { showPendingTransaction, showConfirmedTransaction, showWarning } = useNotification()
    const { fetchBalances } = useBalances();

    const originalBalance = ref('0')
    const { stats, status, displayPositions, maxLiquidation, liquidationPrice, liquidationMaxPrice, refreshPosition } = useAaveV2Position({
      overridePosition: (position) => {
        if (rootTokenKey.value !== position.key) return position

        originalBalance.value = position.supply

        return {
          ...position,
          supply: max(minus(position.supply, amountParsed.value), '0').toFixed(),
        }
      },
    })

    const availableLiquidity = computed(
      () => displayPositions.value.find((position) => position.key === rootTokenKey.value)?.availableLiquidity || '0'
    )

    const balance = computed(
      () => displayPositions.value.find((position) => position.key === rootTokenKey.value)?.supply || '0'
    )


    const amount = ref('')
    const amountParsed = computed(() => parseSafeFloat(amount.value))

    const rootTokenKey = computed(() => atokens[networkName.value].rootTokens.includes(props.tokenKey) ? props.tokenKey : 'eth')

    const token = computed(() => getTokenByKey(rootTokenKey.value))
    const symbol = computed(() => token.value?.symbol)
    const decimals = computed(() => token.value?.decimals)
    const address = computed(() => token.value?.address)

    const factor = computed(
      () => displayPositions.value?.find((position) => rootTokenKey.value === position.key)?.factor
    )

    const { toggle, isMaxAmount } = useMaxAmountActive(amount, balance)

    const { validateAmount, validateLiquidation, validateIsLoggedIn, validateLiquidity } = useValidators()

    const errors = computed(() => {
      const hasAmountValue = !isZero(amount.value)
      const liqValid = gt(factor.value, '0')
        ? validateLiquidation(status.value, maxLiquidation.value, isZero(stats.value.totalBorrowInEth))
        : null

      return {
        amount: { message: validateAmount(amountParsed.value, originalBalance.value), show: hasAmountValue },
        liquidation: { message: liqValid, show: hasAmountValue },
        auth: { message: validateIsLoggedIn(!!account.value), show: true },
        liquidity: {
          message: validateLiquidity(amountParsed.value, availableLiquidity.value, symbol.value, true),
          show: hasAmountValue,
        },
      }
    })
    const { errorMessages, isValid } = useValidation(errors)

    const pending = ref(false)

    async function cast() {
      pending.value = true

      const amount = isMaxAmount.value ? dsa.value.maxValue : valInt(amountParsed.value, decimals.value)

      const spells = dsa.value.Spell()

      spells.add({
        connector: 'aave_v2',
        method: 'withdraw',
        args: [address.value, amount, 0, 0],
      })

      try {
        const txHash = await dsa.value.cast({
          spells,
          from: account.value,
          onReceipt: async receipt => {
            showConfirmedTransaction(receipt.transactionHash);

            await fetchBalances(true);
            await refreshPosition();
          }
        })

        showPendingTransaction(txHash)
      } catch (error) {
        showWarning(error.message)
      }

      pending.value = false

      close()
    }

    return {
      pending,
      cast,
      errors,
      amount,
      status,
      rootTokenKey,
      token,
      symbol,
      originalBalance,
      balance,
      formatNumber,
      formatUsdMax,
      formatUsd,
      toggle,
      isMaxAmount,
      maxLiquidation,
      liquidationPrice,
      liquidationMaxPrice,
      errorMessages,
      isValid
    }
  },
})
</script>
