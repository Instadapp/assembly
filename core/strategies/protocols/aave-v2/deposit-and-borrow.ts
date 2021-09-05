import BigNumber from "bignumber.js";
import {
  defineStrategy,
  defineStrategyComponent,
  StrategyComponentType,
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

  submitText: "Deposit & Borrow",

  author: "Instadapp Team",

  variables: {
    collateralTokenKey: "eth",
    debtTokenKey: "dai",
    debtRateMode: 2
  },

  components: [
    defineStrategyComponent({
      type: StrategyComponentType.INPUT_WITH_TOKEN,
      name: "Collateral",
      placeholder: ({ component: input }) =>
        input.token ? `${input.token.symbol} to Deposit` : "",
      validate: ({ component: input, dsaBalances, toBN }) => {
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

    defineStrategyComponent({
      type: StrategyComponentType.INPUT_WITH_TOKEN,
      name: "Debt",
      placeholder: ({ component: input }) =>
        input.token ? `${input.token.symbol} to Borrow` : "",
      validate: ({ component: input }) => {
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
    }),
    defineStrategyComponent({
      type: StrategyComponentType.HEADING,
      name: "Projected Debt Position"
    }),
    defineStrategyComponent({
      type: StrategyComponentType.STATUS,
      name: "Status",
      update: ({ position, component, components, toBN }) => {
        if (
          toBN(components[0].value).isZero() &&
          toBN(components[1].value).isZero()
        ) {
          return;
        }

        if (!position) {
          return;
        }

        const newPositionData = changedPositionData(position, components);
        const stats = calculateStats(newPositionData);

        component.liquidation = BigNumber.max(
          toBN(stats.totalMaxBorrowLimitInEth).div(stats.totalSupplyInEth),
          "0"
        ).toFixed();
        component.status = BigNumber.max(
          toBN(stats.totalBorrowInEth).div(stats.totalSupplyInEth),
          "0"
        ).toFixed();
      }
    }),
    defineStrategyComponent({
      type: StrategyComponentType.VALUE,
      name: "LIQUIDATION PRICE (IN ETH)",
      value: "-",
      update: ({ position, component, components, toBN, formatting }) => {
        if (!position) {
          return;
        }

        const newPositionData = changedPositionData(position, components);
        const initialStats = calculateStats(position.data);
        const newStats = calculateStats(newPositionData);

        const stats =
          toBN(components[0].value).isZero() &&
          toBN(components[1].value).isZero()
            ? initialStats
            : newStats;

        let liquidationPrice = "0";
        if (!toBN(stats.ethSupplied).isZero()) {
          liquidationPrice = BigNumber.max(
            toBN(stats.totalBorrowInEth)
              .div(stats.totalMaxLiquidationLimitInEth)
              .times(position.ethPriceInUsd),
            "0"
          ).toFixed();
        }

        component.value = `${formatting.formatUsdMax(
          liquidationPrice,
          position.ethPriceInUsd
        )} / ${formatting.formatUsd(position.ethPriceInUsd)}`;
      }
    })
  ],

  validate: async ({ position, components: inputs, toBN }) => {
    if (toBN(inputs[0].value).isZero() && toBN(inputs[1].value).isZero()) {
      return;
    }

    const newPositionData = changedPositionData(position, inputs);
    const stats = calculateStats(newPositionData);

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

  spells: async ({
    components: inputs,
    convertTokenAmountToWei,
    variables
  }) => {
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

const changedPositionData = (position, inputs) => {
  return position.data.map(position => {
    const changedPosition = { ...position };
    if (inputs[1].token.key === position.key) {
      changedPosition.borrow = BigNumber.max(
        new BigNumber(position.borrow).plus(inputs[1].value || "0"),
        "0"
      ).toFixed();
    }

    if (inputs[0].token.key === position.key) {
      changedPosition.supply = BigNumber.max(
        new BigNumber(position.supply).plus(inputs[0].value || "0"),
        "0"
      ).toFixed();
    }

    return changedPosition;
  });
};

const calculateStats = positionData => {
  return positionData.reduce(
    (
      stats,
      { key, supply, borrow, borrowStable, priceInEth, factor, liquidation }
    ) => {
      if (key === "eth") {
        stats.ethSupplied = supply;
      }

      const borrowTotal = new BigNumber(borrow).plus(borrowStable);

      stats.totalSupplyInEth = new BigNumber(supply)
        .times(priceInEth)
        .plus(stats.totalSupplyInEth)
        .toFixed();
      stats.totalBorrowInEth = new BigNumber(borrowTotal)
        .times(priceInEth)
        .plus(stats.totalBorrowInEth)
        .toFixed();

      stats.totalMaxBorrowLimitInEth = new BigNumber(priceInEth)
        .times(factor)
        .times(supply)
        .plus(stats.totalMaxBorrowLimitInEth)
        .toFixed();

      stats.totalMaxLiquidationLimitInEth = new BigNumber(priceInEth)
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
};
