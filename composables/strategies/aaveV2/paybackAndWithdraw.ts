import { computed, ref, watch } from "@nuxtjs/composition-api";
import { useAaveV2Position } from "~/composables/protocols/useAaveV2Position";
import { useBalances } from "~/composables/useBalances";
import { useBigNumber } from "~/composables/useBigNumber";
import { useDSA } from "~/composables/useDSA";
import { useFormatting } from "~/composables/useFormatting";
import { useMaxAmountPassive } from "~/composables/useMaxAmountPassive";
import { useParsing } from "~/composables/useParsing";
import { useToken } from "~/composables/useToken";
import { useValidators } from "~/composables/useValidators";
import { useWeb3 } from "~/composables/useWeb3";

export const meta = {
  id: "paybackAndWithdraw",
  title: "Payback & Withdraw",
  card: {
    name: "Payback & Withdraw",
    description: "Payback debt & withdraw collateral in a single txn.",
    badge: null
  },
  protocols: ["aaveV2"]
};

export function use() {
  const description = computed(() => {
    return `
        <p>This strategy executes:</p>

        <ul>
          <li>Payback ${debtToken.value?.symbol} debt</li>
          <li>Withdraw ${collateralToken.value?.symbol} as collateral</li>
        </ul>

      `;
  });

  const { account } = useWeb3();
  const { dsa } = useDSA();

  const { position } = useAaveV2Position();
  const { getBalanceByAddress } = useBalances();

  const { parseSafeFloat } = useParsing();
  const {
    formatUsdMax,
    formatUsd,
    formatNumber,
    formatDecimal
  } = useFormatting();
  const { valInt, getTokenByKey } = useToken();

  const {
    validateAmount,
    validateLiquidation,
    validateIsLoggedIn
  } = useValidators();
  const { isZero, minus, div, max, gt } = useBigNumber();

  const debtAmount = ref("");
  const collateralAmount = ref("");
  const debtAmountParsed = computed(() => parseSafeFloat(debtAmount.value));
  const collateralAmountParsed = computed(() =>
    parseSafeFloat(collateralAmount.value)
  );
  const rateType = ref(null);

  const borrowEnabled = position => position.borrowEnabled;
  const debtTokens = computed(() =>
    position.value.data
      .filter(borrowEnabled)
      .filter(position => gt(position.borrow, 0))
      .map(token => token.key)
  );

  const debtToken = ref(null);
  watch(
    debtTokens,
    tokens => {
      if (tokens.includes(debtToken.value)) return;

      debtToken.value = getTokenByKey(debtTokens.value[0] || "dai");
    },
    { immediate: true }
  );

  const collateralTokens = computed(() =>
    position.value.data
      .filter(position => gt(position.supply, 0))
      .map(token => token.key)
  );

  const collateralToken = ref(null);
  watch(
    collateralTokens,
    tokens => {
      if (tokens.includes(collateralToken.value)) return;

      collateralToken.value = getTokenByKey(collateralTokens.value[0] || "dai");
    },
    { immediate: true }
  );

  const collateralBalance = computed(
    () =>
      position.value.data.find(
        position => position.key === collateralToken.value.key
      )?.supply || "0"
  );

  const debtPosition = computed(() =>
    position.value.data.find(
      position => position.key === debtToken.value.key
    )
  );
  const debtBalance = computed(() => {
    if (rateType.value?.value === "stable") {
      return debtPosition.value?.borrowStable || "0";
    }
    return debtPosition.value?.borrow || "0";
  });

  const stableBorrowEnabled = computed(
    () => debtPosition.value?.stableBorrowEnabled
  );
  const borrowStableRate = computed(
    () => debtPosition.value?.borrowStableRate || "0"
  );

  const debtTokenBalance = computed(() =>
    getBalanceByAddress(debtToken.value?.address)
  );

  const debtValueBadge = computed(() => {
    if (isZero(debtAmountParsed.value)) return null;
    return `${formatDecimal(
      max(minus(debtBalance.value, debtAmountParsed.value), "0").toFixed()
    )} ${debtToken.value.symbol}`;
  });

  const collateralValueBadge = computed(() => {
    if (isZero(collateralAmountParsed.value)) return null;
    return `${formatDecimal(
      max(
        minus(collateralBalance.value, collateralAmountParsed.value),
        "0"
      ).toFixed()
    )} ${collateralToken.value.symbol}`;
  });

  const components = computed(() => [
    {
      type: "html",
      minHeight: "96px",
      html: description.value
    },
    {
      type: "rate-selection-aave",
      onChange: type => (rateType.value = type),
      value: rateType.value,
      items: annualPercentageRateTypes.value,
      borrowStableRate: borrowStableRate.value,
      stableBorrowEnabled: stableBorrowEnabled.value
    },
    {
      type: "input-amount",
      placeholder: `${debtToken.value.symbol} to Payback`,
      value: debtAmount.value,
      tokenKey: debtToken.value.key,
      onInput: value => (debtAmount.value = value),
      errorKey: "debtAmount"
    },
    {
      type: "input-amount",
      placeholder: `${collateralToken.value.symbol} to Withdraw`,
      value: collateralAmount.value,
      tokenKey: collateralToken.value.key,
      onInput: value => (collateralAmount.value = value),
      errorKey: "collateralAmount"
    },
    {
      type: "heading",
      text: "Projected Debt Position"
    },
    {
      type: "value-with-token-select",
      label: "Collateral",
      value: formatNumber(collateralBalance.value),
      valueBadge: collateralValueBadge.value,
      tokens: collateralTokens.value,
      tokenKey: collateralToken.value.key,
      onChange: tokenKey => (collateralToken.value = getTokenByKey(tokenKey))
    },
    {
      type: "value-with-token-select",
      label: "Debt",
      value: formatNumber(debtBalance.value),
      valueBadge: debtValueBadge.value,
      tokens: debtTokens.value,
      tokenKey: debtToken.value.key,
      onChange: tokenKey => (debtToken.value = getTokenByKey(tokenKey))
    },
    {
      type: "status",
      liquidation: liquidation.value,
      status: status.value
    },
    {
      type: "value",
      label: "LIQUIDATION PRICE (IN ETH)",
      value: `${formatUsdMax(
        liquidationPrice.value,
        liquidationMaxPrice.value
      )} / ${formatUsd(liquidationMaxPrice.value)}`
    },
    {
      type: "button-submit",
      label: "Payback & Withdraw",
      onSubmit: async () => {
        const debtTokenAddr = debtToken.value.address;
        const collateralTokenAddr = collateralToken.value.address;

        const debtAmount = isDebtMaxAmount.value
          ? dsa.value.maxValue
          : valInt(debtAmountParsed.value, debtToken.value.decimals);
        const collateralAmount = isCollateralMaxAmount.value
          ? dsa.value.maxValue
          : valInt(
              collateralAmountParsed.value,
              collateralToken.value.decimals
            );

        const spells = dsa.value.Spell();

        const rateMode = rateType.value?.rateMode;

        spells.add({
          connector: "aave_v2",
          method: "payback",
          args: [debtTokenAddr, debtAmount, rateMode, 0, 0]
        });

        spells.add({
          connector: "aave_v2",
          method: "withdraw",
          args: [collateralTokenAddr, collateralAmount, 0, 0]
        });

        await dsa.value.cast({
          spells,
          from: account.value
        });
      }
    }
  ]);

  const { isMaxAmount: isDebtMaxAmount } = useMaxAmountPassive(
    debtAmount,
    debtAmountParsed,
    debtBalance
  );

  const { isMaxAmount: isCollateralMaxAmount } = useMaxAmountPassive(
    collateralAmount,
    collateralAmountParsed,
    collateralBalance
  );

  const {
    stats,
    maxLiquidation: liquidation,
    liquidationPrice,
    liquidationMaxPrice,
    status: initialStatus,
    annualPercentageRateTypes
  } = useAaveV2Position({
    overridePosition: position => {
      const changedPosition = { ...position };
      if (debtToken.value.key === position.key) {
        changedPosition.borrow = max(
          minus(position.borrow, debtAmountParsed.value),
          "0"
        ).toFixed();
      }

      if (collateralToken.value.key === position.key) {
        changedPosition.supply = max(
          minus(position.supply, collateralAmountParsed.value),
          "0"
        ).toFixed();
      }

      return changedPosition;
    }
  });

  const status = computed(() => {
    if (isZero(debtAmountParsed.value) && isZero(collateralAmountParsed.value))
      return initialStatus.value;
    return max(
      div(stats.value.totalBorrowInEth, stats.value.totalSupplyInEth),
      "0"
    ).toFixed();
  });

  const errors = computed(() => {
    const hasDebtAmountValue = !!debtAmount.value.length;
    const hasCollateralAmountValue = !!collateralAmount.value.length;
    // prettier-ignore
    return {
      debtAmount: { message: validateAmount(debtAmountParsed.value, debtTokenBalance.value, {msg: "You don't have enough balance to payback"}), show: hasDebtAmountValue },
      collateralAmount: { message: validateAmount(collateralAmountParsed.value, collateralBalance.value, {msg: "Your amount exceeds your supplied balance."}), show: hasCollateralAmountValue },
      liquidation: { message: validateLiquidation(status.value, liquidation.value), show: hasCollateralAmountValue && hasDebtAmountValue },
      auth: { message: validateIsLoggedIn(!!account.value), show: true },
    }
  });

  return { components, errors };
}
