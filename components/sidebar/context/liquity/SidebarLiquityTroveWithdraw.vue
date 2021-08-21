<template>
  <SidebarContextRootContainer>
    <template #title>Withdraw {{ collateralToken.symbol }}</template>

    <SidebarSectionValueWithIcon label="Supplied" center>
      <template #icon
        ><IconCurrency
          :currency="collateralToken.key"
          class="w-20 h-20"
          noHeight
      /></template>
      <template #value
        >{{ formatDecimal(changedCollateral) }}
        {{ collateralToken.symbol }}</template
      >
    </SidebarSectionValueWithIcon>

    <SidebarSectionValueWithIcon label="Token Balance" center>
      <template #icon
        ><IconCurrency
          :currency="collateralToken.key"
          class="w-20 h-20"
          noHeight
      /></template>
      <template #value
        >{{ formatDecimal(changedBalance) }}
        {{ collateralToken.symbol }}</template
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
    const { account } = useWeb3()
    const { dsa } = useDSA()
    const { valInt } = useToken()
    const { showPendingTransaction, showWarning } = useNotification()
    const { formatUsd, formatUsdMax, formatDecimal, formatNumber } = useFormatting()
    const { parseSafeFloat } = useParsing()
    const { isZero, minus, max, plus } = useBigNumber()

    const amount = ref('')
    const amountParsed = computed(() => parseSafeFloat(amount.value))

    const {
      collateralToken,
      debt,
      debtInWei,
      collateral,
      collateralInWei,
      liquidation,
      liquidationMaxPrice,
      getTrovePositionHints,
    } = useLiquityPosition()

    const changedCollateral = computed(() => max(minus(collateral.value, amountParsed.value), '0').toFixed())
    const changedBalance = computed(() => max(plus(balance.value, amountParsed.value), '0').toFixed())
    const { liquidationPrice, status } = useLiquityPosition(changedCollateral, debt)

    const { toggle, isMaxAmount } = useMaxAmountActive(amount, collateral)

    const { validateAmount, validateLiquidation, validateIsLoggedIn, validateLiquityTroveExists } = useValidators()

    const errors = computed(() => {
      const hasAmountValue = !isZero(amount.value)

      return {
        troveExists: { message: validateLiquityTroveExists(), show: true },
        amount: { message: validateAmount(amountParsed.value, collateral.value), show: hasAmountValue },
        liquidation: {
          message: validateLiquidation(status.value, liquidation.value, isZero(debt.value)),
          show: hasAmountValue,
        },
        auth: { message: validateIsLoggedIn(!!account.value), show: true },
      }
    })
    const { errorMessages, isValid } = useValidation(errors)

    const pending = ref(false)

    async function cast() {
      pending.value = true

      const inputAmountInWei = valInt(amountParsed.value,collateralToken.value.decimals)
      const totalDepositAmountInWei = minus(collateralInWei.value, inputAmountInWei).toFixed()
      const { upperHint, lowerHint } = await getTrovePositionHints(totalDepositAmountInWei, debtInWei.value)

      const getId = 0
      const setId = 0

      const spells = dsa.value.Spell()
      
      spells.add({
        connector: 'LIQUITY-A',
        method: 'withdraw',
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
      collateralToken,
      collateral,
      debt,
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
      changedBalance,
      changedCollateral,
    }
  },
})
</script>
