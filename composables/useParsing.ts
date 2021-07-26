import { useBigNumber } from "./useBigNumber";

export function useParsing() {
  const { toBN } = useBigNumber();

  function parseSafeFloat(value) {
    if (value === null) return "0";
    if (value === undefined) return "0";

    const normalizedAmount = String(value).replace(",", ".");

    return toBN(normalizedAmount).toFixed();
  }

  return { parseSafeFloat };
}
