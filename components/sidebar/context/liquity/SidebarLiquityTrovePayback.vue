<template>
  <SidebarContextRootContainer>
    <template #title>Payback {{ debtToken.symbol }}</template>

    <div class="flex justify-around items-center w-full">
      <SidebarSectionValueWithIcon class="" label="Debt" center>
        <template #icon
          ><IconCurrency :currency="debtToken.key" class="w-16 h-16" noHeight
        /></template>
        <template #value>{{ formatDecimal(changedDebt) }} {{ debtToken.symbol }}</template>
      </SidebarSectionValueWithIcon>

      <SidebarSectionValueWithIcon class="" label="Token Balance" center>
        <template #icon
          ><IconCurrency :currency="debtToken.key" class="w-16 h-16" noHeight
        /></template>

        <template #value>{{ formatDecimal(changedBalance) }} {{ debtToken.symbol }}</template>
      </SidebarSectionValueWithIcon>
    </div>

    <div class="bg-[#C5CCE1] bg-opacity-[0.15] mt-10 p-8">
      <h3 class="text-primary-gray text-xs font-semibold mb-2.5">
        Amount to payback
      </h3>

      <input-numeric
        v-model="amount"
        placeholder="Amount to payback"
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
        :liquidation="liquidation"
        :status="status"
      />

      <SidebarSectionValueWithIcon
        class="mt-8"
        :label="`Liquidation Price (${collateralToken.symbol})`"
      >
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
          Payback
        </ButtonCTA>
      </div>

      <ValidationErrors :error-messages="errorMessages" class="mt-6" />
    </div>
  </SidebarContextRootContainer>
</template>

<script>
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import InputNumeric from '~/components/common/input/InputNumeric.vue'
import { useBalances } from '~/composables/useBalances'
import { useBigNumber } from '~/composables/useBigNumber'
import { useFormatting } from '~/composables/useFormatting'
import { useValidators } from '~/composables/useValidators'
import { useValidation } from '~/composables/useValidation'
import { useToken } from '~/composables/useToken'
import { useParsing } from '~/composables/useParsing'
import { useMaxAmountActive } from '~/composables/useMaxAmountActive'
import { useWeb3 } from '~/composables/useWeb3'
import ToggleButton from '~/components/common/input/ToggleButton.vue'
import { useDSA } from '~/composables/useDSA'
import ButtonCTA from '~/components/common/input/ButtonCTA.vue'
import { useNotification } from '~/composables/useNotification'
import Button from '~/components/Button.vue'
import { useSidebar } from '~/composables/useSidebar'
import { useLiquityPosition } from '~/composables/protocols/useLiquityPosition'

export default defineComponent({
  components: { InputNumeric, ToggleButton, ButtonCTA, Button },
  setup() {
    const { close } = useSidebar()
    const { networkName, account } = useWeb3()
    const { dsa } = useDSA()
    const { valInt } = useToken()
    const { getBalanceByKey } = useBalances()
    const { formatDecimal, formatUsdMax, formatUsd } = useFormatting()
    const { isZero, gte, plus, max, minus, min } = useBigNumber()
    const { parseSafeFloat } = useParsing()
    const { showPendingTransaction, showWarning } = useNotification()

    const amount = ref('')
    const amountParsed = computed(() => parseSafeFloat(amount.value))

    const {
      debt,
      collateral,
      collateralInWei,
      liquidation,
      liquidationMaxPrice,
      debtToken,
      collateralToken,
      getTrovePositionHints,
    } = useLiquityPosition()

    const balance = computed(() => getBalanceByKey(debtToken.value.key))

    const changedDebt = computed(() => max(minus(debt.value, amountParsed.value), '0').toFixed())
    const changedBalance = computed(() => max(minus(balance.value, amountParsed.value), '0').toFixed())

    const { liquidationPrice, status } = useLiquityPosition(collateral, changedDebt)
    const { validateAmount, validateIsLoggedIn, validateLiquityDebt, validateLiquityTroveExists } = useValidators()

    const maxBalance = computed(() => min(balance.value, debt.value).toFixed())
    const { toggle, isMaxAmount } = useMaxAmountActive(amount, maxBalance)

    const errors = computed(() => {
      const hasAmountValue = !isZero(amount.value)

      return {
        troveExists: { message: validateLiquityTroveExists(), show: true },
        amount: { message: validateAmount(amountParsed.value, maxBalance.value), show: hasAmountValue },
        minDebt: { message: validateLiquityDebt(changedDebt.value), show: hasAmountValue },
        auth: { message: validateIsLoggedIn(!!account.value), show: true },
      }
    })
    const { errorMessages, isValid } = useValidation(errors)

    const pending = ref(false)

    async function cast() {
      pending.value = true

      const inputAmountInWei = valInt(amountParsed.value, debtToken.value.decimals)
      const totalDebtAmountInWei = valInt(changedDebt.value, debtToken.value.decimals)
      const { upperHint, lowerHint } = await getTrovePositionHints(collateralInWei.value, totalDebtAmountInWei)

      const getId = 0
      const setId = 0

      const spells = dsa.value.Spell()

      spells.add({
        connector: 'LIQUITY-A',
        method: 'repay',
        args: [inputAmountInWei, upperHint, lowerHint, getId, setId],
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
      debt,
      balance,
      amount,
      status,
      liquidation,
      liquidationPrice,
      liquidationMaxPrice,
      formatUsd,
      formatUsdMax,
      formatDecimal,
      errors,
      errorMessages,
      isMaxAmount,
      isValid,
      cast,
      pending,
      toggle,
      debtToken,
      collateralToken,
      changedDebt,
      changedBalance,
    }
  },
})
</script>
