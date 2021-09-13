import { useBigNumber } from "./useBigNumber";
import { useFormatting } from "./useFormatting";
import { useMakerdaoPosition } from "~/composables/protocols/useMakerdaoPosition";
import { useLiquityPosition } from "./protocols/useLiquityPosition";
import { useReflexerPosition } from "./protocols/useReflexerPosition";

export function useValidators() {
  const { formatNumber } = useFormatting();
  const { isZero, minus, eq, gt, lt, gte, plus } = useBigNumber();
  const { minDebt: makerMinDebt, vaultTypes } = useMakerdaoPosition();
  const { minDebt: reflexerMinDebt, safeTypes } = useReflexerPosition();
  const {
    minDebt: liquityMinDebt,
    liquidationReserve: liquityLiquidationReserve,
    troveOpened: liquityTroveOpened
  } = useLiquityPosition();

  function validateAmount(amountParsed, balance = null, options = null) {
    const mergedOptions = Object.assign(
      { msg: "Your amount exceeds your maximum limit." },
      options
    );

    if (isZero(amountParsed)) {
      return "Please provide a valid amount.";
    } else if (balance !== null && gt(amountParsed, balance)) {
      return mergedOptions.msg;
    }

    return null;
  }

  function validateLiquidation(status, liquidation, isWithdraw = false) {
    if (eq(status, liquidation) && isZero(status) && isWithdraw) {
      return null;
    }
    if (gt(status, minus(liquidation, "0.0001"))) {
      return "Position will liquidate.";
    }

    return null;
  }

  function validateIsLoggedIn(isLoggedIn) {
    if (!isLoggedIn) {
      return "Please connect to a web3 wallet.";
    }

    return null;
  }

  function validateLiquidity(
    borrow,
    availableLiquidity,
    tokenSymbol,
    withdraw = false
  ) {
    if (gt(borrow, availableLiquidity)) {
      let action = "borrow";
      if (withdraw) {
        action = "withdraw";
      }
      return `Not enough liquidity to ${action} ${formatNumber(
        borrow,
        2
      )} ${tokenSymbol}`;
    }
    return null;
  }

  function validateMakerDebt(
    debtParsed,
    minDebt = makerMinDebt.value,
    vaultId
  ) {
    if (lt(debtParsed, minDebt) && gt(debtParsed, "0")) {
      const vaultText = vaultId
        ? vaultId !== "0"
          ? `on vault #${vaultId}`
          : `on new vault`
        : "";
      return `Minimum debt requirement is ${minDebt} DAI ${vaultText}`;
    }

    return null;
  }

  function validateMakerDebtCeiling(vaultType, debtParsed = 0) {
    const vault = vaultTypes.value.find(v => v.type === vaultType);
    const { debtCeiling, totalDebt } = vault || {};

    if (!isZero(debtCeiling) && !isZero(totalDebt)) {
      const total = plus(totalDebt, debtParsed);
      return gte(total, debtCeiling)
        ? `${vaultType} Collateral reached debt ceiling`
        : null;
    }
    return null;
  }

  function validateReflexerDebtCeiling(safeType, debtParsed = 0) {
    const safe = safeTypes.value.find(v => v.type === safeType);
    const { debtCeiling, totalDebt } = safe || {};

    if (!isZero(debtCeiling) && !isZero(totalDebt)) {
      const total = plus(totalDebt, debtParsed);
      return gte(total, debtCeiling)
        ? `${safeType} Collateral reached debt ceiling`
        : null;
    }
    return null;
  }

  function validateReflexerDebt(
    debtParsed,
    minDebt = reflexerMinDebt.value,
    vaultId,
  ) {
    if (lt(debtParsed, minDebt) && gt(debtParsed, "0")) {
      const vaultText = vaultId
        ? vaultId !== "0"
          ? `on vault #${vaultId}`
          : `on new vault`
        : "";

      return `Minimum debt requirement is ${minDebt} RAI ${vaultText}` ;
    }

    return null;
  }

  function validateReflexerPaybackDebt(
    debtParsed,
    minDebt = reflexerMinDebt.value,
    vaultId,
  ) {
    
    if (lt(debtParsed, minDebt) && gt(debtParsed, "0")) {
      return `Min debt requirement is ${minDebt} RAI. Payback additional ${debtParsed} RAI`;
    }

    return null;
  }

  function validateLiquityDebt(
    debtParsed,
    minDebt = liquityMinDebt.value,
    liquidationReserve = liquityLiquidationReserve.value
  ) {
    const totalDebt = plus(debtParsed, liquidationReserve);

    if (isZero(totalDebt))
      return `Minimum total debt requirement is ${minDebt} LUSD`;

    if (lt(totalDebt, minDebt) && gt(totalDebt, "0")) {
      return `Minimum total debt requirement is ${minDebt} LUSD`;
    }

    return null;
  }

  function validateLiquityTroveExists() {
    if (!liquityTroveOpened.value) {
      return "You should open new trove first";
    }

    return null;
  }

  return {
    validateAmount,
    validateLiquidation,
    validateIsLoggedIn,
    validateLiquidity,
    validateMakerDebt,
    validateMakerDebtCeiling,
    validateLiquityDebt,
    validateLiquityTroveExists,
    validateReflexerDebtCeiling,
    validateReflexerDebt,
    validateReflexerPaybackDebt,
  };
}
