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

  author: "Instadapp Team",

  variables: {
    collateralTokenKey: "eth",
    debtTokenKey: "dai",
    debtRateMode: 2,
  },

  inputs: [
    defineInput({
      type: StrategyInputType.INPUT_WITH_TOKEN,
      name: "Collateral",
      placeholder: ({ input }) =>
        input.token ? `${input.token.symbol} to Deposit` : "",
      validate: ({ input, dsaBalances }) => {
        if (!input.token) {
          return "Collateral token is required";
        }

        if (!input.value) {
          return "Collateral amount is required";
        }

        const collateralBalance = new BigNumber(
          dsaBalances[input.token.address]?.balance
        );

        if (new BigNumber(collateralBalance).lt(input.value)) {
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
