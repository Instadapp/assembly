import BigNumber from "bignumber.js";
import tokens from "~/constant/tokens";
import {
  defineStrategy,
  defineStrategyComponent,
  StrategyComponentType,
  StrategyProtocol
} from "../../helpers";

export default defineStrategy({
  protocol: StrategyProtocol.AAVE_V2,
  name: "Payback & Withdraw",
  description: "Payback debt & withdraw collateral in a single txn.",
  author: "Instadapp Team",

  submitText: "Payback & Withdraw",

  details: `<p class="text-center">This strategy executes:</p>
  <ul>
    <li>Payback debt</li>
    <li>Withdraw collateral</li>
  </ul>`,

  components: [
    defineStrategyComponent({
      type: StrategyComponentType.INPUT_WITH_TOKEN,
      name: "Debt",
      placeholder: ({ component: input }) =>
        input.token ? `${input.token.symbol} to Payback` : "",
      validate: ({ component: input, toBN, dsaBalances }) => {
        if (!input.token) {
          return "Debt token is required";
        }

        const balance = toBN(dsaBalances[input.token.address]?.balance);

        if (toBN(balance).lt(input.value)) {
          return "You don't have enough balance to payback.";
        }
      },
      defaults: ({ getTokenByKey }) => ({
        token: getTokenByKey?.("dai")
      })
    }),
    defineStrategyComponent({
      type: StrategyComponentType.INPUT_WITH_TOKEN,
      name: "Collateral",
      placeholder: ({ component: input }) =>
        input.token ? `${input.token.symbol} to Withdraw` : "",
      validate: ({ component: input, position, toBN }) => {
        if (!input.token) {
          return "Collateral token is required";
        }

        if (!input.value) {
          return "Collateral amount is required";
        }

        if (position) {
          const collateralPosition = position.data.find(
            item => item.key === input.token.key
          );
          if (collateralPosition) {
            const collateralBalance = toBN(collateralPosition.supply);
            if (collateralBalance.lt(input.value)) {
              const collateralBalanceFormatted = collateralBalance.toFixed(2);
              return `Your amount exceeds your maximum limit of ${collateralBalanceFormatted} ${input.token.symbol}`;
            }
          }
        }
      },
      defaults: ({ getTokenByKey }) => ({
        token: getTokenByKey?.("eth")
      })
    })
  ],

  validate: async ({ position, components: inputs, toBN }) => {
    if (toBN(inputs[0].value).isZero() && toBN(inputs[1].value).isZero()) {
      return;
    }

    const newPositionData = position.data.map(position => {
      const changedPosition = { ...position };
      if (inputs[0].token.key === position.key) {
        changedPosition.borrow = BigNumber.max(
          toBN(position.borrow).minus(inputs[0].value),
          "0"
        ).toFixed();
      }

      if (inputs[1].token.key === position.key) {
        changedPosition.supply = BigNumber.max(
          toBN(position.supply).minus(inputs[1].value),
          "0"
        ).toFixed();
      }

      return changedPosition;
    });

    const stats = newPositionData.reduce(
      (
        stats,
        { key, supply, borrow, borrowStable, priceInEth, factor, liquidation }
      ) => {
        if (key === "eth") {
          stats.ethSupplied = supply;
        }

        const borrowTotal = toBN(borrow).plus(borrowStable);

        stats.totalSupplyInEth = toBN(supply)
          .times(priceInEth)
          .plus(stats.totalSupplyInEth)
          .toFixed();
        stats.totalBorrowInEth = toBN(borrowTotal)
          .times(priceInEth)
          .plus(stats.totalBorrowInEth)
          .toFixed();

        stats.totalMaxBorrowLimitInEth = toBN(priceInEth)
          .times(factor)
          .times(supply)
          .plus(stats.totalMaxBorrowLimitInEth)
          .toFixed();

        stats.totalMaxLiquidationLimitInEth = toBN(priceInEth)
          .times(liquidation)
          .times(supply)
          .plus(stats.totalMaxLiquidationLimitInEth)
          .toFixed();

        return stats;
      },
      {
        totalSupplyInEth: "0",
        totalBorrowInEth: "0",
        totalMaxBorrowLimitInEth: "0",
        totalMaxLiquidationLimitInEth: "0"
      }
    );

    let maxLiquidation = "0";

    if (!toBN(stats.totalSupplyInEth).isZero()) {
      maxLiquidation = BigNumber.max(
        toBN(stats.totalMaxLiquidationLimitInEth).div(stats.totalSupplyInEth),
        "0"
      ).toFixed();
    }

    const status = BigNumber.max(
      toBN(stats.totalBorrowInEth).div(stats.totalSupplyInEth),
      "0"
    );

    if (status.gt(toBN(maxLiquidation).minus("0.0001"))) {
      return "Position will liquidate.";
    }
  },

  spells: async ({ components: inputs, convertTokenAmountToWei }) => {
    return [
      {
        connector: "aave_v2",
        method: "payback",
        args: [
          inputs[0].token.address,
          convertTokenAmountToWei(inputs[0].value, inputs[0].token.decimals),
          2,
          0,
          0
        ]
      },
      {
        connector: "aave_v2",
        method: "withdraw",
        args: [
          inputs[1].token.address,
          convertTokenAmountToWei(inputs[1].value, inputs[1].token.decimals),
          0,
          0
        ]
      }
    ];
  }
});
