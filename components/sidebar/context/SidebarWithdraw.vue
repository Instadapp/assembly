<template>
  <SidebarContextRootContainer>
    <template #title>Withdraw {{ symbol }}</template>

    <SidebarSectionValueWithIcon label="Token Balance" center>
      <template #icon
        ><IconCurrency :currency="rootTokenKey" class="w-20 h-20" noHeight
      /></template>
      <template #value>{{ formatNumber(balance) }} {{ symbol }}</template>
    </SidebarSectionValueWithIcon>

    <div class="bg-[#C5CCE1] bg-opacity-[0.15] mt-10 px-4 py-8">
      <div>
        <h3 class="text-primary-gray text-xs font-semibold mb-2.5">
          Withdrawal Address
        </h3>

        <Input
          readonly
          v-model="accountAddress"
          placeholder="Paste account address"
          :error="errors.accountAddress.message"
        ></Input>
        <p class="text-sm text-center text-primary-gray mt-2">
          You can only withdraw tokens to owner's address
        </p>
      </div>

      <div class="mt-6">
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
      </div>

      <div class="flex flex-shrink-0 mt-16">
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
import Input from '~/components/common/input/Input.vue'
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
  components: { InputNumeric, Input, ToggleButton, ButtonCTA, Button },
  props: {
    tokenKey: { type: String, required: true },
  },
  setup(props) {
    const { close } = useSidebar()
    const { networkName, account, web3 } = useWeb3()
    const { dsa } = useDSA()
    const { getTokenByKey, valInt } = useToken()
    const { formatNumber, formatUsdMax, formatUsd } = useFormatting()
    const { isZero, gt, plus, max, minus } = useBigNumber()
    const { parseSafeFloat } = useParsing()
    const { showPendingTransaction } = useNotification()
    const { getBalanceByKey } = useBalances()


    const accountAddress = ref(account.value)
    const amount = ref('')
    const amountParsed = computed(() => parseSafeFloat(amount.value))

    const rootTokenKey = computed(() => atokens[networkName.value].rootTokens.includes(props.tokenKey) ? props.tokenKey : 'eth')

    const token = computed(() => getTokenByKey(rootTokenKey.value))
    const symbol = computed(() => token.value?.symbol)
    const decimals = computed(() => token.value?.decimals)
    const address = computed(() => token.value?.address)
    const balance = computed(() => getBalanceByKey(rootTokenKey.value))

    const { toggle, isMaxAmount } = useMaxAmountActive(amount, balance)

    const { validateAmount, validateIsLoggedIn } = useValidators()

    const errors = computed(() => {
      const hasAmountValue = !isZero(amount.value)

      return {
        amount: { message: validateAmount(amountParsed.value, balance.value), show: hasAmountValue },
        accountAddress: { message: web3.value && !web3.value.utils.isAddress(accountAddress.value) ? 'Enter valid address!' : null, show: accountAddress.value.length > 0 },
        auth: { message: validateIsLoggedIn(!!account.value), show: true },
      }
    })
    const { errorMessages, isValid } = useValidation(errors)

    const pending = ref(false)

    async function cast() {
      pending.value = true

      const amount = isMaxAmount.value ? dsa.value.maxValue : valInt(amountParsed.value, decimals.value)

      const spells = dsa.value.Spell()

      spells.add({
        connector: 'basic',
        method: 'withdraw',
        args: [address.value, amount, accountAddress.value, 0, 0],
      })

      const txHash = await dsa.value.cast({
        spells,
        from: account.value,
      })

      showPendingTransaction(txHash)

      pending.value = false

      close()
    }

    return {
      accountAddress,
      pending,
      cast,
      errors,
      amount,
      rootTokenKey,
      token,
      symbol,
      balance,
      formatNumber,
      formatUsdMax,
      formatUsd,
      toggle,
      isMaxAmount,
      errorMessages,
      isValid
    }
  },
})
</script>
