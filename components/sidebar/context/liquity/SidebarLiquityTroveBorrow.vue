<template>
  <SidebarContextRootContainer>
    <template #title>Borrow {{ debtToken.symbol }}</template>

    <div class="flex justify-around items-center w-full">
      <SidebarSectionValueWithIcon class="" label="Debt" center>
        <template #icon
          ><IconCurrency :currency="debtToken.key" class="w-16 h-16" noHeight
        /></template>
        <template #value
          >{{ formatDecimal(changedDebt) }} {{ debtToken.symbol }}</template
        >
      </SidebarSectionValueWithIcon>

      <SidebarSectionValueWithIcon class="" label="Token Balance" center>
        <template #icon
          ><IconCurrency :currency="debtToken.key" class="w-16 h-16" noHeight
        /></template>

        <template #value
          >{{ formatDecimal(changedBalance) }} {{ debtToken.symbol }}</template
        >
      </SidebarSectionValueWithIcon>
    </div>

    <div class="bg-[#C5CCE1] bg-opacity-[0.15] mt-10 p-8">
      <input-amount
        v-model="amount"
        :token-key="debtToken.key"
        :disabled="pending"
        class="mt-4"
        placeholder="Amount to borrow"
        :error="errors.amount.message"
      />

      <ValueDisplay
        label="Borrow Fee"
        tooltip="This amount is deducted from the borrowed amount as a one-time fee. There are no recurring fees for borrowing, which is thus interest-free."
        class="mt-4"
      >
        <div class="flex items-center">
          <div>
            {{ formatDecimal(borrowFeeAmount, 2) }} {{ debtToken.symbol }}
          </div>
          <div class="ml-1 text-sm">({{ formatPercent(borrowFee) }})</div>
        </div>
      </ValueDisplay>
      <ValueDisplay label="Debt with fee" class="mt-4">
        <div>
          {{ formatDecimal(inputAmountWithFee, 2) }} {{ debtToken.symbol }}
        </div>
      </ValueDisplay>

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
import { useBalances } from '~/composables/useBalances'
import { useNotification } from '~/composables/useNotification'
import { useBigNumber } from '~/composables/useBigNumber'
import { useFormatting } from '~/composables/useFormatting'
import { useValidators } from '~/composables/useValidators'
import { useValidation } from '~/composables/useValidation'
import { useToken } from '~/composables/useToken'
import { useParsing } from '~/composables/useParsing'
import { useWeb3 } from '@instadapp/vue-web3'
import ToggleButton from '~/components/common/input/ToggleButton.vue'
import { useDSA } from '~/composables/useDSA'
import ButtonCTA from '~/components/common/input/ButtonCTA.vue'
import Button from '~/components/Button.vue'
import { useSidebar } from '~/composables/useSidebar'
import { useLiquityPosition } from '~/composables/protocols/useLiquityPosition'
import InputAmount from '~/components/common/input/InputAmount.vue'
import ValueDisplay from '../components/ValueDisplay.vue'

export default defineComponent({
  components: { InputNumeric, ToggleButton, ButtonCTA, Button, InputAmount, ValueDisplay },
  setup() {
    const { account } = useWeb3()
    const { close } = useSidebar()
    const { formatPercent, formatNumber, formatDecimal, formatUsdMax, formatUsd } = useFormatting()
    const { plus, times, isZero, max, min } = useBigNumber()
    const { parseSafeFloat } = useParsing()
    const { getBalanceByKey, fetchBalances } = useBalances()
    const { valInt } = useToken()
    const { showPendingTransaction, showConfirmedTransaction, showWarning } = useNotification()
    const { dsa } = useDSA()

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
      maxFeePercentageInWei,
      getTrovePositionHints,
      borrowFee,
      fetchPosition,
    } = useLiquityPosition()

    const balance = computed(() => getBalanceByKey(debtToken.value.key))

    const changedBalance = computed(() => max(plus(balance.value, amountParsed.value), '0').toFixed())
    const changedDebt = computed(() => max(plus(debt.value, inputAmountWithFee.value), '0').toFixed())
    const { liquidationPrice, status } = useLiquityPosition(collateral, changedDebt)

    const borrowFeeAmount = computed(() => times(amountParsed.value, borrowFee.value).toFixed())
    const inputAmountWithFee = computed(() => plus(amountParsed.value, borrowFeeAmount.value).toFixed())

    const { validateAmount, validateLiquidation, validateIsLoggedIn, validateLiquityTroveExists } = useValidators()

    const errors = computed(() => {
      const hasAmountValue = !isZero(amount.value)

      return {
        troveExists: { message: validateLiquityTroveExists(), show: true },
        amount: { message: validateAmount(amountParsed.value), show: hasAmountValue },
        liquidation: { message: validateLiquidation(status.value, liquidation.value), show: hasAmountValue },
        auth: { message: validateIsLoggedIn(!!account.value), show: true },
      }
    })
    const { errorMessages, isValid } = useValidation(errors)

    const pending = ref(false)

    async function cast() {
      pending.value = true
      try {
        const inputAmountInWei = valInt(amountParsed.value, debtToken.value.decimals)
        const totalDebtAmountInWei = valInt(changedDebt.value, debtToken.value.decimals)

        const { upperHint, lowerHint } = await getTrovePositionHints(collateralInWei.value, totalDebtAmountInWei)

        const spells = dsa.value.Spell()

        const getId = 0
        const setId = 0


        spells.add({
          connector: 'LIQUITY-A',
          method: 'borrow',
          args: [maxFeePercentageInWei.value, inputAmountInWei, upperHint, lowerHint, getId, setId],
        })

        const txHash = await dsa.value.cast({
          spells,
          from: account.value,
          onReceipt: async receipt => {
            showConfirmedTransaction(receipt.transactionHash);

            await fetchBalances(true);
            await fetchPosition();
          }
        })

        showPendingTransaction(txHash)
      } catch (error) {
        console.log(error)
        showWarning(error.message)
      }

      pending.value = false

      close()
    }

    return {
      amount,
      status,
      liquidation,
      liquidationPrice,
      liquidationMaxPrice,
      formatUsd,
      formatUsdMax,
      formatDecimal,
      formatPercent,
      errors,
      errorMessages,
      isValid,
      cast,
      pending,
      debtToken,
      collateralToken,
      borrowFee,
      borrowFeeAmount,
      inputAmountWithFee,
      changedDebt,
      changedBalance,
    }
  },
})
</script>
