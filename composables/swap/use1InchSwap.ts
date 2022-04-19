import { Spell } from "dsa-connect";
import { useBigNumber } from "../useBigNumber";
import { useDSA } from "../useDSA";
import { useFormatting } from "../useFormatting";
import { useMath } from "../useMath";
import { Network, useNetwork } from "../useNetwork";

export const use1InchSwap = () => {
  const { divWithDec } = useMath();
  const { activeNetworkId } = useNetwork();
  const { dsa, activeAccount } = useDSA();
  const { isZero, ensureValue, gt, minus, times, plus, toBN } = useBigNumber();
  const { formatPercent, getFractionDigits } = useFormatting();

  /**
   * @dev Get different sell spell, based on simulation mode on/offand account network .
   * Shared params:
   * @param {string} params.buyAddr - buying token address.(For ETH: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE)
   * @param {string} params.sellAddr - selling token amount.(For ETH: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE)
   * @param {number} params.sellAmt - selling token amount.
   * @param {number} params.unitAmt - unit amount of buyAmt/sellAmt with slippage.
   * @param {number} params.setId - set token amount at this ID in `InstaMemory` Contract.
   *
   * 1Inch related params:
   * @param {string} params.calldata - data from 1inch API.
   *
   * 1Split related params(using in simulation mode):
   * @param {number[]} params.distribution - distribution of swap across different dex.
   * @param {number} params.disableDexes - disable a dex. (To disable none: 0)
   * @param {number} params.getId - get token amount at this ID from `InstaMemory` Contract.
   */
  function getSellSpell({
    buyAddr,
    sellAddr,
    sellAmt,
    unitAmt,
    calldata,
    setId
  }): Spell {
    if (
      activeNetworkId.value === Network.Polygon ||
      activeAccount.value.version == 2
    ) {
      return {
        connector: "1INCH-V4-A",
        method: "sell",
        args: [buyAddr, sellAddr, sellAmt, unitAmt, calldata, setId]
      };
    }

    return {
      connector: "oneInch",
      method: "sellThree",
      args: [buyAddr, sellAddr, sellAmt, unitAmt, calldata, setId]
    };
  }

  return {
    getSellSpell
  };
};
