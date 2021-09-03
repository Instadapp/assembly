<template>
  <SidebarContextRootContainer>
    <template #title>Payback {{ symbol }}</template>

    <div class="mt-6 flex justify-around items-center  w-full">
      <SidebarSectionValueWithIcon class="" label="Borrowed" center>
        <template #icon
          ><IconCurrency :currency="rootTokenKey" class="w-20 h-20" noHeight
        /></template>
        <template #value>{{ formatNumber(balance) }} {{ symbol }}</template>
      </SidebarSectionValueWithIcon>

      <SidebarSectionValueWithIcon class="" label="Token Balance" center>
        <template #icon
          ><IconCurrency :currency="rootTokenKey" class="w-20 h-20" noHeight
        /></template>

        <template #value
          >{{ formatNumber(tokenMaxBalance) }} {{ symbol }}</template
        >
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
import { useCompoundPosition } from '~/composables/protocols/useCompoundPosition'
import ctokens from '~/constant/ctokens'
import tokenIdMapping from '~/constant/tokenIdMapping'
import { useNetwork } from '~/composables/useNetwork'

export default defineComponent({
  components: { InputNumeric, ToggleButton, ButtonCTA, Button },
  props: {
    tokenId: { type: String, required: true },
  },
  setup(props) {
    const { close } = useSidebar()
    const { account } = useWeb3()
    const { activeNetworkId } = useNetwork()
    const { dsa } = useDSA()
    const { getTokenByKey, valInt } = useToken()
    const { getBalanceByKey, getBalanceRawByKey, fetchBalances } = useBalances()
    const { formatNumber, formatUsdMax, formatUsd } = useFormatting()
    const { isZero, gte, plus, max, minus, min } = useBigNumber()
    const { parseSafeFloat } = useParsing()
    const { showPendingTransaction, showConfirmedTransaction, showWarning } = useNotification()
    const tokenId = computed(() => props.tokenId)
    const tokenKey = computed(() => tokenIdMapping.idToToken[tokenId.value])

    const rootTokenKey = computed(() => ctokens[activeNetworkId.value].rootTokens.includes(tokenKey.value) ? tokenKey.value : 'eth')


    const { status, position, displayPositions, liquidation, liquidationPrice, liquidationMaxPrice, refreshPosition } = useCompoundPosition({
      overridePosition: (position) => {
        if (tokenId.value !== position.cTokenId) return position

        return {
          ...position,
          borrow: max(minus(position.borrow, amountParsed.value), '0').toFixed(),
        }
      },
    })

    const amount = ref('')
    const amountParsed = computed(() => parseSafeFloat(amount.value))

    const currentPosition = computed(() =>
      position.value.data.find((position) => position.cTokenId === tokenId.value)
    )

    const token = computed(() => getTokenByKey(rootTokenKey.value))
    const symbol = computed(() => token.value?.symbol)
    const decimals = computed(() => token.value?.decimals)
    const balance = computed(() => {
      return currentPosition.value?.borrow || '0'
    })

    const tokenMaxBalance = computed(() => getBalanceByKey(rootTokenKey.value))
    const tokenMaxBalanceRaw = computed(() => getBalanceRawByKey(rootTokenKey.value))

    const address = computed(() => token.value?.address)


    const maxBalance = computed(() => min(balance.value, tokenMaxBalance.value).toFixed())
    const { toggle, isMaxAmount } = useMaxAmountActive(amount, maxBalance)

    const { validateAmount, validateLiquidation, validateIsLoggedIn } = useValidators()
    const errors = computed(() => {
      const hasAmountValue = !isZero(amount.value)

      return {

        amount: { message: validateAmount(amountParsed.value, maxBalance.value), show: hasAmountValue },
        liquidation: { message: validateLiquidation(status.value, liquidation.value), show: hasAmountValue },
        auth: { message: validateIsLoggedIn(!!account.value), show: true },
      }
    })
    const { errorMessages, isValid } = useValidation(errors)

    const pending = ref(false)

    async function cast() {
      pending.value = true

      const amount = isMaxAmount.value
        ? gte(tokenMaxBalance.value, balance.value)
          ? $dsa().maxValue
          : tokenMaxBalanceRaw.value
        : valInt(amountParsed.value, decimals.value)

      const spells = dsa.value.Spell()

      spells.add({
        connector: 'compound',
        method: 'payback',
        args: [tokenId.value, amount, 0, 0],
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
      balance,
      formatNumber,
      formatUsdMax,
      formatUsd,
      toggle,
      displayPositions,
      currentPosition,
      isMaxAmount,
      liquidation,
      liquidationPrice,
      liquidationMaxPrice,
      errorMessages,
      isValid,
      tokenMaxBalance,
    }
  },
})
</script>
