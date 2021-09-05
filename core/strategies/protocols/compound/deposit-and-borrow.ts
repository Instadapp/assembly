import BigNumber from "bignumber.js";
import {
  defineStrategy,
  defineStrategyComponent,
  StrategyComponentType,
  StrategyProtocol
} from "../../helpers";

export default defineStrategy({
  protocol: StrategyProtocol.COMPOUND,
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
    debtTokenKey: "dai"
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
      update: ({ position, component, components, toBN, tokenIdMapping }) => {
        if (
          toBN(components[0].value).isZero() &&
          toBN(components[1].value).isZero()
        ) {
          return;
        }

        if (!position) {
          return;
        }

        const newPositionData = changedPositionData(position, components, tokenIdMapping.tokenToId);
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
      update: ({
        position,
        component,
        components,
        toBN,
        formatting,
        tokenIdMapping
      }) => {
        if (!position) {
          return;
        }

        const newPositionData = changedPositionData(
          position,
          components,
          tokenIdMapping.tokenToId
        );
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
              .div(stats.totalMaxBorrowLimitInEth)
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

  validate: async ({ position, components: inputs, toBN, tokenIdMapping }) => {
    if (toBN(inputs[0].value).isZero() && toBN(inputs[1].value).isZero()) {
      return;
    }
    const { tokenToId } = tokenIdMapping;

    const newPositionData = position.data.map(position => {
      const changedPosition = { ...position };
      if (tokenToId.compound[inputs[1].token.key] === position.cTokenId) {
        changedPosition.borrow = BigNumber.max(
          toBN(position.borrow).plus(inputs[1].value),
          "0"
        ).toFixed();
      }

      if (tokenToId.compound[inputs[0].token.key] === position.cTokenId) {
        changedPosition.supply = BigNumber.max(
          toBN(position.supply).plus(inputs[0].value),
          "0"
        ).toFixed();
      }

      return changedPosition;
    });

    const stats = newPositionData.reduce(
      (stats, { key, supply, borrow, priceInEth, factor }) => {
        if (key === "eth") {
          stats.ethSupplied = supply;
        }

        stats.totalSupplyInEth = toBN(supply)
          .times(priceInEth)
          .plus(stats.totalSupplyInEth)
          .toFixed();
        stats.totalBorrowInEth = toBN(borrow)
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
        totalMaxBorrowLimitInEth: "0",
        ethSupplied: "0"
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

  spells: async ({
    components: inputs,
    convertTokenAmountToWei,
    tokenIdMapping
  }) => {
    const { tokenToId } = tokenIdMapping;

    const collateralTokenId = tokenToId.compound[inputs[0].token.key];
    const debtTokenId = tokenToId.compound[inputs[1].token.key];

    return [
      {
        connector: "compound",
        method: "deposit",
        args: [
          collateralTokenId,
          convertTokenAmountToWei(inputs[0].value, inputs[0].token.decimals),
          0,
          0
        ]
      },
      {
        connector: "compound",
        method: "borrow",
        args: [
          debtTokenId,
          convertTokenAmountToWei(inputs[1].value, inputs[1].token.decimals),
          0,
          0
        ]
      }
    ];
  }
});

const changedPositionData = (position, inputs, tokenToId) => {
  return position.data.map(position => {
    const changedPosition = { ...position };
    if (tokenToId.compound[inputs[1].token.key] === position.cTokenId) {
      changedPosition.borrow = BigNumber.max(
        new BigNumber(position.borrow).plus(inputs[1].value),
        "0"
      ).toFixed();
    }

    if (tokenToId.compound[inputs[0].token.key] === position.cTokenId) {
      changedPosition.supply = BigNumber.max(
        new BigNumber(position.supply).plus(inputs[0].value),
        "0"
      ).toFixed();
    }

    return changedPosition;
  });
};

const calculateStats = positionData => {
  return positionData.reduce(
    (stats, { key, supply, borrow, priceInEth, factor }) => {
      if (key === "eth") {
        stats.ethSupplied = supply;
      }

      stats.totalSupplyInEth = new BigNumber(supply)
        .times(priceInEth)
        .plus(stats.totalSupplyInEth)
        .toFixed();
      stats.totalBorrowInEth = new BigNumber(borrow)
        .times(priceInEth)
        .plus(stats.totalBorrowInEth)
        .toFixed();

      stats.totalMaxBorrowLimitInEth = new BigNumber(priceInEth)
        .times(factor)
        .times(supply)
        .plus(stats.totalMaxBorrowLimitInEth)
        .toFixed();

      return stats;
    },
    {
      totalSupplyInEth: "0",
      totalBorrowInEth: "0",
      totalMaxBorrowLimitInEth: "0",
      ethSupplied: "0"
    }
  );
};
