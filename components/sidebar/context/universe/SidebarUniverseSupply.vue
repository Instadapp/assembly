<template>
  <SidebarContextRootContainer>
    <template #title>Supply {{ symbol }}</template>

    <SidebarSectionValueWithIcon label="Token Balance" center>
      <template #icon
        ><IconCurrency :currency="token.key" class="w-20 h-20" noHeight
      /></template>
      <template #value>{{ formatNumber(balance) }} {{ symbol }}</template>
    </SidebarSectionValueWithIcon>

    <div class="bg-[#C5CCE1] bg-opacity-[0.15] mt-10 p-8 h-full">
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

      <div class="flex flex-shrink-0 mt-10">
        <ButtonCTA
          class="w-full"
          :disabled="!isValid || pending"
          :loading="pending"
          @click="cast"
        >
          Supply
        </ButtonCTA>
      </div>

      <ValidationErrors :error-messages="errorMessages" class="mt-6" />
    </div>
  </SidebarContextRootContainer>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@nuxtjs/composition-api";
import InputNumeric from "~/components/common/input/InputNumeric.vue";
import { useBalances } from "~/composables/useBalances";
import { useNotification } from "~/composables/useNotification";
import { useBigNumber } from "~/composables/useBigNumber";
import { useFormatting } from "~/composables/useFormatting";
import { useValidators } from "~/composables/useValidators";
import { useValidation } from "~/composables/useValidation";
import { useToken } from "~/composables/useToken";
import { useParsing } from "~/composables/useParsing";
import { useMaxAmountActive } from "~/composables/useMaxAmountActive";
import { useWeb3 } from "@instadapp/vue-web3";
import ToggleButton from "~/components/common/input/ToggleButton.vue";
import { useDSA } from "~/composables/useDSA";
import ButtonCTA from "~/components/common/input/ButtonCTA.vue";
import Button from "~/components/Button.vue";
import { useSidebar } from "~/composables/useSidebar";
import DSA from "dsa-connect";
import { useUniversePosition } from "~/composables/protocols/useUniversePosition";

export default defineComponent({
  components: { InputNumeric, ToggleButton, ButtonCTA, Button },
  props: {
    vault: { type: String, required: true },
    tokenIndex: { type: String, required: true },
  },
  setup(props) {
    const { close } = useSidebar();
    const { account } = useWeb3();
    const { dsa } = useDSA();
    const { getTokenByKey, valInt } = useToken();
    const { getBalanceByKey, fetchBalances } = useBalances();
    const { formatNumber, formatUsdMax, formatUsd } = useFormatting();
    const { isZero } = useBigNumber();
    const { parseSafeFloat } = useParsing();
    const {
      showPendingTransaction,
      showWarning,
      showConfirmedTransaction
    } = useNotification();

    const { vaults, refreshPosition } = useUniversePosition();
    const selectedVault = computed(() =>
      vaults.value.find(v => v.vaultAddress === props.vault && v.tokenIndex == Number(props.tokenIndex))
    );

    const amount = ref("");
    const amountParsed = computed(() => parseSafeFloat(amount.value));

    const token = computed(() =>
      selectedVault.value
        ? getTokenByKey(selectedVault.value.tokenSymbol.toLowerCase())
        : null
    );
    const symbol = computed(() => token.value?.symbol);
    const decimals = computed(() => token.value?.decimals);
    const balance = computed(() => getBalanceByKey(token.value?.key));

    const { toggle, isMaxAmount } = useMaxAmountActive(amount, balance);

    const { validateAmount, validateIsLoggedIn } = useValidators();
    const errors = computed(() => {
      const hasAmountValue = !isZero(amount.value);

      return {
        amount: {
          message: validateAmount(amountParsed.value, balance.value),
          show: hasAmountValue
        },
        auth: { message: validateIsLoggedIn(!!account.value), show: true }
      };
    });
    const { errorMessages, isValid } = useValidation(errors);

    const pending = ref(false);

    async function cast() {
      pending.value = true;

      const amount = isMaxAmount.value
        ? dsa.value.maxValue
        : valInt(amountParsed.value, decimals.value);

      const spells = dsa.value.Spell();
      const amounts = Number(props.tokenIndex) == 0 ? [amount, 0] : [0, amount];

      spells.add({
        //@ts-ignore
        connector: "UNIVERSE-A",
        method: "deposit",
        args: [props.vault, ...amounts, [0, 0], [0, 0]]
      });

      try {
        const txHash = await (dsa.value as DSA).cast({
          spells,
          from: account.value,
          onReceipt: async receipt => {
            showConfirmedTransaction(receipt.transactionHash);

            await fetchBalances(true);
            await refreshPosition();
          }
        });

        showPendingTransaction(txHash);
      } catch (error) {
        showWarning(error.message);
      }

      pending.value = false;

      close();
    }

    return {
      selectedVault,
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
    };
  }
});
</script>
