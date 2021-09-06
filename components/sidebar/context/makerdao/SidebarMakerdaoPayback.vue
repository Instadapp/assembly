<template>
  <SidebarContextRootContainer>
    <template #title>Payback {{ symbol }}</template>

    <div class="mt-6 flex justify-around items-center  w-full">
      <SidebarSectionValueWithIcon class="" label="Borrowed" center>
        <template #icon
          ><IconCurrency :currency="daiTokenKey" class="w-20 h-20" noHeight
        /></template>
        <template #value>{{ formatNumber(debt) }} {{ symbol }}</template>
      </SidebarSectionValueWithIcon>

      <SidebarSectionValueWithIcon class="" label="Token Balance" center>
        <template #icon
          ><IconCurrency :currency="daiTokenKey" class="w-20 h-20" noHeight
        /></template>

        <template #value>{{ formatNumber(balance) }} {{ symbol }}</template>
      </SidebarSectionValueWithIcon>
    </div>

    <div class="bg-[#C5CCE1] bg-opacity-[0.15] mt-10 p-8">
      <h3 class="text-primary-gray text-xs font-semibold mb-2.5">
        Amount to supply
      </h3>

      <input-numeric
        v-model="amount"
        placeholder="Amount to supply"
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
import { useWeb3 } from '@instadapp/vue-web3'
import ToggleButton from '~/components/common/input/ToggleButton.vue'
import { useDSA } from '~/composables/useDSA'
import ButtonCTA from '~/components/common/input/ButtonCTA.vue'
import { useNotification } from '~/composables/useNotification'
import Button from '~/components/Button.vue'
import { useSidebar } from '~/composables/useSidebar'
import { useMakerdaoPosition } from '~/composables/protocols/useMakerdaoPosition'

export default defineComponent({
  components: { InputNumeric, ToggleButton, ButtonCTA, Button },
  props: {
    tokenKey: { type: String, required: true },
  },
  setup(props) {
    const { close } = useSidebar()
    const { account } = useWeb3()
    const { dsa } = useDSA()
    const { getTokenByKey, valInt } = useToken()
    const { getBalanceByKey, getBalanceRawByKey, fetchBalances } = useBalances()
    const { formatNumber, formatUsdMax, formatUsd } = useFormatting()
    const { isZero, gte, plus, max, minus, min } = useBigNumber()
    const { parseSafeFloat } = useParsing()
    const { showPendingTransaction, showConfirmedTransaction, showWarning } = useNotification()

    const { debt, collateral, liquidation, liquidationMaxPrice, vaultId, symbol: tokenSymbol, fetchPosition, minDebt } = useMakerdaoPosition()

    const amount = ref('')
    const amountParsed = computed(() => parseSafeFloat(amount.value))

    const daiTokenKey = ref('dai')
    const tokenKey = computed(() => props.tokenKey)
    const token = computed(() => getTokenByKey(tokenKey.value))
    const symbol = computed(() => token.value?.symbol)
    const decimals = computed(() => token.value?.decimals)

    const balance = computed(() => getBalanceByKey(tokenKey.value))
    const balanceRaw = computed(() => getBalanceRawByKey(tokenKey.value))

    const changedDebt = computed(() => max(minus(debt.value, amountParsed.value), '0').toFixed())
    const { liquidationPrice, status } = useMakerdaoPosition(collateral, changedDebt)

    const maxBalance = computed(() => min(balance.value, debt.value).toFixed())
    const { toggle, isMaxAmount } = useMaxAmountActive(amount, maxBalance)

    const { validateAmount, validateLiquidation, validateIsLoggedIn, validateMakerDebt } = useValidators()
    const errors = computed(() => {
      const hasAmountValue = !isZero(amount.value)

      return {

        amount: { message: validateAmount(amountParsed.value, maxBalance.value), show: hasAmountValue },
        liquidation: { message: validateLiquidation(status.value, liquidation.value), show: hasAmountValue },
        auth: { message: validateIsLoggedIn(!!account.value), show: true },
        minDebt: { message: validateMakerDebt(changedDebt.value), show: hasAmountValue },
      }
    })
    const { errorMessages, isValid } = useValidation(errors)

    const pending = ref(false)

    async function cast() {
      pending.value = true

      const amount = isMaxAmount.value
        ? gte(balance.value, debt.value)
          ? dsa.value.maxValue
          : balanceRaw.value
        : valInt(amountParsed.value, decimals.value)

      const spells = dsa.value.Spell()

      spells.add({
        connector: 'maker',
        method: 'payback',
        args: [vaultId.value, amount, 0, 0],
      })

      try {
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
        console.log(error);
        showWarning(error.message)
      }

      pending.value = false

      close()
    }

    return {
      daiTokenKey,
      symbol,
      debt,
      balance,
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
      isMaxAmount,
      isValid,
      cast,
      pending,
      toggle,
      tokenSymbol,
      minDebt,
    }
  },
})
</script>
