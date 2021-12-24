import { useBigNumber } from "./useBigNumber";

const {
  toBN,
  isZero,
  times,
  pow,
  div,
  min,
  gt,
  lt,
  abs,
  intRoundFloor
} = useBigNumber();

const locale = "en-US";

export function useFormatting() {
  function getFractionDigits(value: any) {
    const absoluteValue = abs(value);

    if (isZero(absoluteValue)) {
      return 2;
    } else if (lt(absoluteValue, 0.01)) {
      return 6;
    } else if (lt(absoluteValue, 1)) {
      return 4;
    } else if (lt(absoluteValue, 10000)) {
      return 2;
    } else {
      return 0;
    }
  }

  function formatPercent(value: any, fractionDigits = 2, noLimit = false) {
    if (isZero(value)) return "0%";
    if (!noLimit && gt(value, 1)) return ">100%";

    const formatter = new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    });

    return formatter.format(value);
  }

  function formatNumber(value: any, power = getFractionDigits(value)) {
    let MUL_DIV = toBN("100");
    if (power || isZero(power)) {
      MUL_DIV = pow("10", power);
    } else {
      if (lt(value, "0.01")) MUL_DIV = pow("10", "6");
      if (lt(value, "1")) MUL_DIV = pow("10", "4");
    }

    return div(intRoundFloor(times(value, MUL_DIV)), MUL_DIV).toFixed();
  }

  function formatUsd(value: any, fractionDigits = getFractionDigits(value)) {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    });

    return formatter.format(value);
  }

  /**
   * Formats `value` to USD and adds a `>` char if `value` is greater then `max`.
   *
   * @param {string} value Value in USD.
   * @param {string} max Max value in USD.
   */
  function formatUsdMax(value: any, max: any) {
    const formatted = formatUsd(min(value, max).toFixed());

    if (gt(value, max)) {
      return `>${formatted}`;
    }

    return formatted;
  }

  function formatDecimal(
    value: any,
    fractionDigits = getFractionDigits(value)
  ) {
    let formatter;
    if (lt(value, "0.000001") && gt(value, "0")) {
      formatter = new Intl.NumberFormat(locale, {
        style: "decimal",
        notation: "scientific",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      formatter = new Intl.NumberFormat(locale, {
        style: "decimal",
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      });
    }

    return formatter.format(value);
  }

  function shortenHash(hash: any, size = 4) {
    if (!hash) return;

    if (hash.length < 12) return hash;

    const beginningChars = hash.startsWith("0x") ? size + 2 : size;

    const shortened = hash.substr(0, beginningChars) + "…" + hash.substr(-size);

    return shortened;
  }

  function toLocaleString(value: any) {
    return value.toLocaleString(locale);
  }

  function formatMillisecondsShort(milliseconds: any) {
    if (!milliseconds) return "";
    const ms = Number(milliseconds) || 0;

    const timeInSeconds = ms / 1000;
    const hours = Math.floor((timeInSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds - hours * 3600 - minutes * 60);

    const mDisplay = String(minutes).padStart(2, "0");
    const sDisplay = String(seconds).padStart(2, "0");

    return `${mDisplay}:${sDisplay}`;
  }

  return {
    getFractionDigits,
    formatUsd,
    formatNumber,
    formatUsdMax,
    formatPercent,
    formatDecimal,
    shortenHash,
    toLocaleString,
    formatMillisecondsShort
  };
}
