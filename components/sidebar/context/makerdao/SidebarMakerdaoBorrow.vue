<template>
  <SidebarContextRootContainer>
    <template #title>Borrow {{ symbol }}</template>

    <SidebarSectionValueWithIcon class="mt-6" label="Borrowed" center>
      <template #icon
        ><IconCurrency :currency="daiTokenKey" class="w-20 h-20" noHeight
      /></template>
      <template #value>{{ formatNumber(debt) }} {{ symbol }}</template>
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

      <SidebarSectionValueWithIcon
        class="mt-8"
        :label="`Liquidation Price (${tokenSymbol})`"
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
import { useMaxAmountActive } from '~/composables/useMaxAmountActive'
import { useWeb3 } from '~/composables/useWeb3'
import ToggleButton from '~/components/common/input/ToggleButton.vue'
import { useDSA } from '~/composables/useDSA'
import ButtonCTA from '~/components/common/input/ButtonCTA.vue'
import { useNotification } from '~/composables/useNotification'
import Button from '~/components/Button.vue'
import { useSidebar } from '~/composables/useSidebar'
import ctokens from '~/constant/ctokens'
import { useMakerdaoPosition } from '~/composables/useMakerdaoPosition'

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
    const { isZero, gt, div, plus } = useBigNumber()
    const { parseSafeFloat } = useParsing()
    const { showPendingTransaction, showWarning } = useNotification()

    const amount = ref('')
    const amountParsed = computed(() => parseSafeFloat(amount.value))


    const { debt, collateral, liquidation, liquidationMaxPrice, vault, vaultId, symbol: tokenSymbol } = useMakerdaoPosition({
      overridePosition: (position) => {
        return position;
      },
    })

    const changedDebt = computed(() => plus(debt.value, amountParsed.value).toFixed())
    const { liquidationPrice, status } = useMakerdaoPosition(collateral, changedDebt)

    const daiTokenKey = ref('dai')
    const daiToken = computed(() => getTokenByKey(daiTokenKey.value))
    const symbol = computed(() => daiToken.value?.symbol)
    const decimals = computed(() => daiToken.value?.decimals)

    const {
      validateAmount,
      validateLiquidation,
      validateIsLoggedIn,
      validateMakerDebt,
      validateMakerDebtCeiling,
    } = useValidators()

    const errors = computed(() => {
      const hasAmountValue = !isZero(amount.value)

      return {
        amount: { message: validateAmount(amountParsed.value), show: hasAmountValue },
        liquidation: { message: validateLiquidation(status.value, liquidation.value), show: hasAmountValue },
        auth: { message: validateIsLoggedIn(!!account.value), show: true },
        minDebt: { message: validateMakerDebt(changedDebt.value), show: hasAmountValue },
        debtCeiling: { message: validateMakerDebtCeiling(vault.value.type, amountParsed.value), show: true },
      }
    })
    const { errorMessages, isValid } = useValidation(errors)

    const pending = ref(false)

    async function cast() {
      pending.value = true

      const amount = valInt(amountParsed.value, decimals.value)

      const spells = dsa.value.Spell()

      spells.add({
        connector: 'maker',
        method: 'borrow',
        args: [vaultId.value, amount, 0, 0],
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
      daiTokenKey,
      symbol,
      debt,
      amount,
      status,
      liquidation,
      liquidationPrice,
      liquidationMaxPrice,
      formatUsd,
      formatUsdMax,
      formatNumber,
      errors,
      errorMessages,
      isValid,
      cast,
      pending,
      tokenSymbol,
    }
  },
})
</script>
