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
  id: "depositAndBorrow",
  title: "Deposit & Borrow",
  card: {
    name: "Deposit & Borrow",
    description: "Deposit collateral & borrow asset in a single txn.",
    badge: null
  },
  protocols: ["aaveV2"]
};

export function use() {
  const { parseSafeFloat } = useParsing();
  const { account } = useWeb3();
  const { dsa } = useDSA();
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
    validateIsLoggedIn,
    validateLiquidity
  } = useValidators();
  const { isZero, plus, div, max } = useBigNumber();

  const description = computed(() => {
    return `
          <p>This strategy executes:</p>
  
          <ul>
            <li>Deposit collateral</li>
            <li>Borrow Debt</li>
          </ul>
        `;
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
      placeholder: `${collateralToken.value.symbol} to Deposit`,
      value: collateralAmount.value,
      tokenKey: collateralToken.value.key,
      onInput: value => (collateralAmount.value = value),
      errorKey: "collateralAmount"
    },
    {
      type: "input-amount",
      placeholder: `${debtToken.value.symbol} to Borrow`,
      value: debtAmount.value,
      tokenKey: debtToken.value.key,
      onInput: value => (debtAmount.value = value),
      errorKey: "debtAmount"
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
      label: "Deposit & Borrow",
      onSubmit: async () => {
        const collateralTokenAddr = collateralToken.value.address;
        const debtTokenAddr = debtToken.value.address;

        const collateralAmount = isCollateralMaxAmount.value
          ? dsa.value.maxValue
          : valInt(
              collateralAmountParsed.value,
              collateralToken.value.decimals
            );

        const debtAmount = valInt(
          debtAmountParsed.value,
          debtToken.value.decimals
        );

        const spells = dsa.value.Spell();

        const rateMode = rateType.value?.rateMode;

        spells.add({
          connector: "aave_v2",
          method: "deposit",
          args: [collateralTokenAddr, collateralAmount, 0, 0]
        });

        spells.add({
          connector: "aave_v2",
          method: "borrow",
          args: [debtTokenAddr, debtAmount, rateMode, 0, 0]
        });

        await dsa.value.cast({
          spells,
          from: account.value
        });
      }
    }
  ]);

  const { position } = useAaveV2Position();
  const { getBalanceByAddress } = useBalances();

  const collateralAmount = ref("");
  const debtAmount = ref("");
  const collateralAmountParsed = computed(() =>
    parseSafeFloat(collateralAmount.value)
  );
  const debtAmountParsed = computed(() => parseSafeFloat(debtAmount.value));
  const rateType = ref(null);

  const collateralTokens = computed(() =>
    position.value.data.map(token => token.key)
  );

  const collateralToken = ref(null);
  watch(
    collateralTokens,
    tokens => {
      if (tokens.includes(collateralToken.value)) return;

      collateralToken.value = getTokenByKey(collateralTokens.value[0] || "eth");
    },
    { immediate: true }
  );
  const borrowEnabled = position => position.borrowEnabled;
  const debtTokens = computed(() =>
    position.value.data.filter(borrowEnabled).map(token => token.key)
  );

  const debtToken = ref(null);
  watch(
    debtTokens,
    tokens => {
      if (tokens.includes(debtToken.value)) return;

      debtToken.value = getTokenByKey(debtTokens.value[1] || "dai");
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
    position.value.data.find(position => position.key === debtToken.value.key)
  );
  const debtBalance = computed(() => {
    if (rateType.value?.value === "stable") {
      return debtPosition.value?.borrowStable || "0";
    }
    return debtPosition.value?.borrow || "0";
  });
  const stableBorrowEnabled = computed(
    () =>
      debtPosition.value?.stableBorrowEnabled &&
      isZero(debtPosition.value?.supply)
  );
  const borrowStableRate = computed(
    () => debtPosition.value?.borrowStableRate || "0"
  );
  const availableLiquidity = computed(
    () => debtPosition.value?.availableLiquidity || "0"
  );

  const collateralDsaBalance = computed(() =>
    getBalanceByAddress(collateralToken.value.address)
  );

  const collateralValueBadge = computed(() => {
    if (isZero(collateralAmountParsed.value)) return null;
    return `${formatDecimal(
      max(
        plus(collateralBalance.value, collateralAmountParsed.value),
        "0"
      ).toFixed()
    )} ${collateralToken.value.symbol}`;
  });

  const debtValueBadge = computed(() => {
    if (isZero(debtAmountParsed.value)) return null;
    return `${formatDecimal(
      max(plus(debtBalance.value, debtAmountParsed.value), "0").toFixed()
    )} ${debtToken.value.symbol}`;
  });

  const { isMaxAmount: isCollateralMaxAmount } = useMaxAmountPassive(
    collateralAmount,
    collateralAmountParsed,
    collateralDsaBalance
  );

  const {
    stats,
    liquidation,
    liquidationPrice,
    liquidationMaxPrice,
    status: initialStatus,
    annualPercentageRateTypes
  } = useAaveV2Position({
    overridePosition: position => {
      const changedPosition = { ...position };
      if (debtToken.value.key === position.key) {
        changedPosition.borrow = max(
          plus(position.borrow, debtAmountParsed.value),
          "0"
        ).toFixed();
      }

      if (collateralToken.value.key === position.key) {
        changedPosition.supply = max(
          plus(position.supply, collateralAmountParsed.value),
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
    const hasCollateralAmountValue = !!collateralAmount.value.length;
    const hasDebtAmountValue = !!debtAmount.value.length;

    return {
      collateralAmount: {
        message: validateAmount(collateralAmountParsed.value),
        show: hasCollateralAmountValue
      },
      debtAmount: {
        message: validateAmount(debtAmountParsed.value),
        show: hasDebtAmountValue
      },
      liquidation: {
        message: validateLiquidation(status.value, liquidation.value),
        show: hasCollateralAmountValue && hasDebtAmountValue
      },
      auth: {
        message: validateIsLoggedIn(!!account.value),
        show: true
      },
      liquidity: {
        message: validateLiquidity(
          debtAmountParsed.value,
          availableLiquidity.value,
          debtToken.value.symbol
        ),
        show: hasDebtAmountValue
      }
    };
  });

  return { components, errors };
}
