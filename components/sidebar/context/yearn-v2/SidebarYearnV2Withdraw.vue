<template>
  <SidebarContextRootContainer>
    <template #title>Withdraw {{ symbol }}</template>

    <SidebarSectionValueWithIcon label="Token Balance" center>
      <template #icon
        ><IconCurrency :currency="token.key" class="w-20 h-20" noHeight
      /></template>
      <template #value>{{ formatNumber(balance) }} {{ symbol }}</template>
    </SidebarSectionValueWithIcon>

    <div class="bg-[#C5CCE1] bg-opacity-[0.15] mt-10 p-8  h-full">
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
import { useYearnV2Position } from '~/composables/protocols/useYearnV2Position'

export default defineComponent({
  components: { InputNumeric, ToggleButton, ButtonCTA, Button },
  props: {
    vault: { type: String, required: true }
  },
  setup(props) {
    const { close } = useSidebar()
    const { account } = useWeb3()
    const { dsa } = useDSA()
    const { getTokenByKey, valInt } = useToken()
    const { formatNumber, formatUsdMax, formatUsd } = useFormatting()
    const { isZero, gt, plus, max, minus } = useBigNumber()
    const { parseSafeFloat } = useParsing()
    const { showPendingTransaction, showConfirmedTransaction, showWarning } = useNotification()
    const { fetchBalances } = useBalances();

    const { vaults, refreshPosition } = useYearnV2Position();
    const selectedVault = computed(() =>
      vaults.value.find(v => v.address === props.vault)
    );

    const balance = computed(
      () => selectedVault.value ? selectedVault.value.position.supply : '0'
    )

    const amount = ref('')
    const amountParsed = computed(() => parseSafeFloat(amount.value))


    const token = computed(() =>
      selectedVault.value
        ? getTokenByKey(selectedVault.value.token.display_name.toLowerCase())
        : null
    );
    const symbol = computed(() => token.value?.symbol)
    const decimals = computed(() => token.value?.decimals)


    const { toggle, isMaxAmount } = useMaxAmountActive(amount, balance)

    const { validateAmount, validateIsLoggedIn } = useValidators()

    const errors = computed(() => {
      const hasAmountValue = !isZero(amount.value)

      return {
        amount: { message: validateAmount(amountParsed.value, balance.value), show: hasAmountValue },
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
        //@ts-ignore
        connector: "YEARN-VAULT-A",
        method: 'withdraw',
        args: [props.vault, amount, 0, 0],
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
