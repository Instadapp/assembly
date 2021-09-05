import { defineStrategy, StrategyProtocol } from "../../helpers";

export default defineStrategy({
  protocol: StrategyProtocol.LIQUITY,
  name: "Close Trove",
  description:
    "Close trove: Payback debt, withdraw Collateral & Liquidation Reserve.",
  author: "Instadapp Team",

  submitText: "Close Trove",

  details: `<p class="text-center">This strategy executes:</p>
  <ul>
    <li>Close Trove</li>
  </ul>`,

  inputs: [],

  validate: async ({
    position,
    positionExtra,
    toBN,
    getTokenByKey,
    dsaBalances
  }) => {
    const troveOpened =
      !toBN(position.collateral).isZero() && !toBN(position.debt).isZero();

    if (!troveOpened) {
      return "You should open new trove first";
    }

    const troveOverallDetails = positionExtra["troveOverallDetails"];

    const netDebt = toBN(position.debt).minus(
      troveOverallDetails.liquidationReserve
    );

    const debtToken = getTokenByKey("lusd");
    const debtTokenBalance = dsaBalances[debtToken.address].balance;

    if (toBN(position.debt).gt(debtTokenBalance)) {
      const lackOfBalance = netDebt.minus(debtTokenBalance).toPrecision(6, 0);
      return `You need ${lackOfBalance} ${debtToken.symbol} more to close your Trove.`;
    }
  },

  spells: async () => {
    const setId = 0;

    return [
      {
        connector: "LIQUITY-A",
        method: "close",
        args: [setId]
      }
    ];
  }
});
