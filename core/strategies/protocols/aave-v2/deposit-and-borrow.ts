import BigNumber from "bignumber.js";
import {
  defineStrategy,
  defineInput,
  StrategyInputType,
  StrategyProtocol
} from "../../helpers";

export default defineStrategy({
  protocol: StrategyProtocol.AAVE_V2,
  name: "Deposit & Borrow",
  description: "Deposit collateral & borrow asset in a single txn.",

  details: `<p class="text-center">This strategy executes:</p>
  <ul>
    <li>Deposit collateral</li>
    <li>Borrow Debt</li>
  </ul>`,

  submitText: 'Deposit & Borrow',

  author: "Instadapp Team",

  variables: {
    collateralTokenKey: "eth",
    debtTokenKey: "dai",
    debtRateMode: 2
  },

  inputs: [
    defineInput({
      type: StrategyInputType.INPUT_WITH_TOKEN,
      name: "Collateral",
      placeholder: ({ input }) =>
        input.token ? `${input.token.symbol} to Deposit` : "",
      validate: ({ input, dsaBalances, toBN }) => {
        if (!input.token) {
          return "Collateral token is required";
        }

        if (!input.value) {
          return "Collateral amount is required";
        }

        const collateralBalance = toBN(
          dsaBalances[input.token.address]?.balance
        );

        if (toBN(collateralBalance).lt(input.value)) {
          const collateralBalanceFormatted = collateralBalance.toFixed(2);
          return `Your amount exceeds your maximum limit of ${collateralBalanceFormatted} ${input.token.symbol}`;
        }
      },
      defaults: ({ getTokenByKey, variables }) => ({
        token: getTokenByKey?.(variables.collateralTokenKey)
      })
    }),

    defineInput({
      type: StrategyInputType.INPUT_WITH_TOKEN,
      name: "Debt",
      placeholder: ({ input }) =>
        input.token ? `${input.token.symbol} to Borrow` : "",
      validate: ({ input }) => {
        if (!input.token) {
          return "Debt token is required";
        }

        if (!input.value) {
          return "Debt amount is required";
        }
      },
      defaults: ({ getTokenByKey, variables }) => ({
        token: getTokenByKey?.(variables.debtTokenKey)
      })
    })
  ],

  validate: async ({ position, inputs, toBN }) => {
    if (toBN(inputs[0].value).isZero() && toBN(inputs[1].value).isZero()) {
      return;
    }

    const newPositionData = position.data.map(position => {
      const changedPosition = { ...position };
      if (inputs[1].token.key === position.key) {
        changedPosition.borrow = BigNumber.max(
          toBN(position.borrow).plus(inputs[1].value),
          "0"
        ).toFixed();
      }

      if (inputs[0].token.key === position.key) {
        changedPosition.supply = BigNumber.max(
          toBN(position.supply).plus(inputs[0].value),
          "0"
        ).toFixed();
      }

      return changedPosition;
    });

    const stats = newPositionData.reduce(
      (stats, { key, supply, borrow, borrowStable, priceInEth, factor }) => {
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

        return stats;
      },
      {
        totalSupplyInEth: "0",
        totalBorrowInEth: "0",
        totalMaxBorrowLimitInEth: "0"
      }
    );

    let liquidation = "0";
    if (!toBN(stats.totalSupplyInEth).isZero()) {
      liquidation = BigNumber.max(
        toBN(stats.totalMaxBorrowLimitInEth).div(stats.totalSupplyInEth),
        "0"
      ).toFixed();
    }

    const status = BigNumber.max(
      toBN(stats.totalBorrowInEth).div(stats.totalSupplyInEth),
      "0"
    );

    if (status.gt(toBN(liquidation).minus("0.0001"))) {
      return "Position will liquidate.";
    }
  },

  spells: async ({ inputs, convertTokenAmountToWei, variables }) => {
    return [
      {
        connector: "aave_v2",
        method: "deposit",
        args: [
          inputs[0].token.address,
          convertTokenAmountToWei(inputs[0].value, inputs[0].token.decimals),
          0,
          0
        ]
      },
      {
        connector: "aave_v2",
        method: "borrow",
        args: [
          inputs[1].token.address,
          convertTokenAmountToWei(inputs[1].value, inputs[1].token.decimals),
          variables.debtRateMode,
          0,
          0
        ]
      }
    ];
  }
});
