import { useBigNumber } from "./useBigNumber";

export function useValidators() {
  const { isZero, minus, eq, gt } = useBigNumber();

  function validateAmount(amountParsed, balance = null, options = null) {
    const mergedOptions = Object.assign(
      { msg: "Your amount exceeds your balance." },
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

  return {
    validateAmount,
    validateLiquidation,
    validateIsLoggedIn
  };
}
