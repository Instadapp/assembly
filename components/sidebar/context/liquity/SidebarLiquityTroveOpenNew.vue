<template>
  <SidebarContextRootContainer>
    <template #title>Open Trove</template>

    <SidebarSectionValueWithIcon label="Collateral Balance" center>
      <template #icon
        ><IconCurrency
          :currency="collateralToken.key"
          class="w-16 h-16"
          noHeight
      /></template>
      <template #value
        >{{ formatNumber(balance) }} {{ collateralToken.symbol }}</template
      >
    </SidebarSectionValueWithIcon>

    <div class="bg-[#C5CCE1] bg-opacity-[0.15] mt-10 p-8">
      <input-amount
        v-model="collateralAmount"
        :token-key="collateralToken.key"
        :disabled="pending"
        class="mt-4"
        placeholder="Collateral amount"
        :error="errors.collateralAmount.message"
      />

      <input-amount
        v-model="debtAmount"
        :token-key="debtToken.key"
        :disabled="pending"
        class="mt-4"
        placeholder="Borrow amount"
        :error="errors.debtAmount.message"
      />

      <ValueDisplay
        label="Liquidation Reserve"
        tooltip="An amount set aside to cover the liquidator’s gas costs if your Trove needs to be liquidated. The amount increases your debt and is refunded if you close your Trove by fully paying off its net debt."
        class="mt-4"
      >
        {{ liquidationReserve }} LUSD
      </ValueDisplay>
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
      <ValueDisplay
        label="Total debt"
        tooltip="The total amount of LUSD your Trove will hold."
        class="mt-4"
      >
        <div>{{ formatDecimal(totalDebt, 2) }} {{ debtToken.symbol }}</div>
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
          Open Trove
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
import { useMaxAmountActive } from '~/composables/useMaxAmountActive'
import { useWeb3 } from '~/composables/useWeb3'
import atokens from '~/constant/atokens'
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
    const { plus, times, isZero } = useBigNumber()
    const { parseSafeFloat } = useParsing()
    const { getBalanceByKey } = useBalances()
    const { valInt } = useToken()
    const { showPendingTransaction, showWarning } = useNotification()
    const { dsa } = useDSA()

    const {
      collateralToken,
      debtToken,
      liquidation,
      liquidationReserve,
      liquidationMaxPrice,
      borrowFee,
      maxFeePercentageInWei,
      getTrovePositionHints,
    } = useLiquityPosition()

    const collateralAmount = ref('')
    const debtAmount = ref('')


    const balance = computed(() => getBalanceByKey(collateralToken.value.key))

    const collateralAmountParsed = computed(() => parseSafeFloat(collateralAmount.value))
    const debtAmountParsed = computed(() => parseSafeFloat(debtAmount.value))

    const borrowFeeAmount = computed(() => times(debtAmountParsed.value, borrowFee.value).toFixed())
    const totalDebt = computed(() => {
      if (isZero(debtAmountParsed.value)) return '0'
      return plus(plus(debtAmountParsed.value, borrowFeeAmount.value), liquidationReserve.value).toFixed()
    })

    const { liquidationPrice, status } = useLiquityPosition(collateralAmountParsed, totalDebt)

    const { validateAmount, validateLiquidation, validateIsLoggedIn, validateLiquityDebt } = useValidators()

    const errors = computed(() => {
      const hasCollateralAmountValue = !isZero(collateralAmount.value)
      const hasDebtAmountValue = !isZero(debtAmount.value)

      return {
        collateralAmount: {
          message: validateAmount(collateralAmountParsed.value, balance.value),
          show: hasCollateralAmountValue,
        },
        debtAmount: { message: validateAmount(debtAmountParsed.value), show: hasDebtAmountValue },
        minDebt: { message: validateLiquityDebt(totalDebt.value, undefined, '0'), show: hasDebtAmountValue },
        liquidation: {
          message: validateLiquidation(status.value, liquidation.value),
          show: hasCollateralAmountValue && hasDebtAmountValue,
        },
        auth: { message: validateIsLoggedIn(!!account.value), show: true },
      }
    })
    const { errorMessages, isValid } = useValidation(errors)

    const pending = ref(false)

    async function cast() {
      pending.value = true
      try {
        const depositAmountInWei = valInt(collateralAmountParsed.value, collateralToken.value.decimals)
        const borrowAmountInWei = valInt(debtAmountParsed.value, debtToken.value.decimals)
        const totalBorrowAmountInWei = valInt(totalDebt.value, debtToken.value.decimals)

        const { upperHint, lowerHint } = await getTrovePositionHints(depositAmountInWei, totalBorrowAmountInWei)

        const spells = dsa.value.Spell()

        const getIds = [0, 0]
        const setIds = [0, 0]

        spells.add({
          connector: 'LIQUITY-A',
          method: 'open',
          args: [
            depositAmountInWei,
            maxFeePercentageInWei.value,
            borrowAmountInWei,
            upperHint,
            lowerHint,
            getIds,
            setIds,
          ],
        })

        const txHash = await dsa.value.cast({
          spells,
          from: account.value,
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
      formatPercent, formatNumber, formatDecimal, formatUsdMax, formatUsd,
      balance,
      liquidationPrice,
      liquidationMaxPrice,
      status,
      liquidation,
      totalDebt,
      liquidationReserve,
      collateralToken,
      debtToken,
      borrowFee,
      borrowFeeAmount,
      collateralAmount,
      debtAmount,
      errors,
      errorMessages,
      isValid,
      pending,
      cast,
    }
  },
})
</script>
