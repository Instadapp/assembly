<template>
  <SidebarContextRootContainer class="bg-[#C5CCE1] bg-opacity-[0.15]">
    <template #title>Withdraw from Stability Pool</template>

    <div class="flex justify-around items-center w-full">
      <SidebarSectionValueWithIcon class="" label="Stability Pool Balance" center>
        <template #icon
          ><IconCurrency :currency="poolToken.key" class="w-16 h-16" noHeight
        /></template>
        <template #value
          >{{ formatDecimal(changedPoolDeposit, 2) }} USD</template
        >
      
      </SidebarSectionValueWithIcon>

            <SidebarSectionValueWithIcon class="" label="Wallet Balance" center>
        <template #icon
          ><IconCurrency :currency="poolToken.key" class="w-16 h-16" noHeight
        /></template>

        <template #value
          >{{ formatDecimal(changedBalance) }} {{ poolToken.symbol }}</template
        >
      </SidebarSectionValueWithIcon>
    </div>

    <div class="mt-10 p-8">
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

      <div v-if="parseFloat(ethUserBalance) > 0.0001">

        <div class="flex items-center w-full px-4 mb-2 mt-4">
          <div class="flex items-center justify-between w-full">
            <div
              class="flex items-center font-medium leading-none whitespace-no-wrap text-14"
            >
              <span>Receive</span>
            </div>
          </div>
        </div>

        <div class="flex items-center w-full px-4 mb-2 mt-4">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center font-medium leading-none text-14">
              <div class="flex items-center mr-1">
                <IconCurrency currency="lusd" no-height class="w-5 h-5" />
              </div>
              <div class="mr-1">{{ formatDecimal(lusdWithdrawAmount) }}</div>
              <div>LUSD</div>
            </div>
          </div>
        </div>

        <div  class="flex items-center w-full px-4">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center font-medium leading-none text-14">
              <div class="flex items-center mr-1">
                <IconCurrency currency="eth" no-height class="w-5 h-5" />
              </div>
              <div class="mr-1">{{ formatDecimal(ethWithdrawAmount) }}</div>
              <div>ETH</div>
            </div>
          </div>
        </div>

      </div>

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
import { computed, ref, defineComponent } from '@nuxtjs/composition-api'
import { useFormatting } from '~/composables/useFormatting'
import { useMaxAmountActive } from '~/composables/useMaxAmountActive'
import { useValidators } from '~/composables/useValidators'
import { useValidation } from '~/composables/useValidation'
import { useParsing } from '~/composables/useParsing'
import { useBigNumber } from '~/composables/useBigNumber'
import { useLiquityPosition } from '~/composables/protocols/useLiquityPosition'
import { useBalances } from '~/composables/useBalances'
import { useWeb3 } from '@instadapp/vue-web3'
import { useNotification } from '~/composables/useNotification'
import ButtonCTA from '~/components/common/input/ButtonCTA.vue'
import InputNumeric from '~/components/common/input/InputNumeric.vue'
import { useToken } from '~/composables/useToken'
import { useDSA } from '~/composables/useDSA'
import { useSidebar } from '~/composables/useSidebar'
import { useBprotocolPosition } from '~/composables/protocols/useBprotocolPositions'

export default defineComponent({
  components: { ButtonCTA, InputNumeric },
  setup() {
    const { userBammInUsd, fetchUserData, userBamm, lusdWithdrawAmountToBamm, absolutlWithdrawAmountInLusd, absolutlWithdrawAmountInEth, ethUserBalance } = useBprotocolPosition()
    const { account } = useWeb3()
    const { dsa } = useDSA()
    const { formatUsd, formatUsdMax, formatDecimal } = useFormatting()
    const { parseSafeFloat } = useParsing()
    const { isZero, minus, max, plus } = useBigNumber()
    const { getBalanceByKey, fetchBalances } = useBalances()
    const { valInt } = useToken()
    const { close } = useSidebar()
    const { showPendingTransaction, showConfirmedTransaction, showWarning } = useNotification()

    const amount = ref('')
    const amountParsed = computed(() => parseSafeFloat(amount.value))

    const { poolToken, stabilityAmount, fetchPosition } = useLiquityPosition()
    const balance = computed(() => getBalanceByKey(poolToken.value.key))

    const changedPoolDeposit = computed(() => max(minus(userBammInUsd.value, amountParsed.value), '0').toFixed())
    const ethWithdrawAmount = computed(() => absolutlWithdrawAmountInEth(amountParsed.value))
    const lusdWithdrawAmount = computed(() => absolutlWithdrawAmountInLusd(amountParsed.value))
    const changedBalance = computed(() => plus(balance.value, amountParsed.value).toFixed())

    const { toggle, isMaxAmount } = useMaxAmountActive(amount, userBammInUsd)

    const { validateAmount, validateIsLoggedIn } = useValidators()

    const errors = computed(() => {
      const hasAmountValue = !isZero(amount.value)

      return {
        amount: { message: validateAmount(amountParsed.value, userBammInUsd.value), show: hasAmountValue },
        auth: { message: validateIsLoggedIn(!!account.value), show: true },
      }
    })
    const { errorMessages, isValid } = useValidation(errors)

    const pending = ref(false)
    async function cast() {
      pending.value = true
      try {
        const supplyAmountInWei = valInt(lusdWithdrawAmountToBamm(amountParsed.value), 18)
        debugger
        const getDepositId = 0
        const setDepositId = 0
        const setEthGainId = 0
        const setLqtyGainId = 0

        const spells = dsa.value.Spell()
        spells.add({
          connector: 'B-LIQUITY-A',
          method: 'withdraw',
          args: [supplyAmountInWei, 0, setDepositId, setEthGainId],
        })


        const txHash = await dsa.value.cast({
          spells,
          from: account.value,
          onReceipt: async receipt => {
            showConfirmedTransaction(receipt.transactionHash);

            await fetchBalances(true);
            await fetchUserData();
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
      symbol: computed(() => poolToken.value.symbol),
      amount,
      status,
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
      poolToken,
      changedPoolDeposit,
      amountParsed,
      isZero,
      ethWithdrawAmount,
      lusdWithdrawAmount,
      ethUserBalance,
      changedBalance
    }
  },
})
</script>
