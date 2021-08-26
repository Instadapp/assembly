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

  inputs: [
    defineInput({
      type: StrategyInputType.INPUT_WITH_TOKEN,
      name: "Debt",
      placeholder: ({ input }) =>
        input.token ? `${input.token.symbol} to Payback` : "",
      validate: ({ input }) => {
        if (!input.token) {
          return "Debt token is required";
        }

        if (!input.value) {
          return "Debt amount is required";
        }

        // if (input.token.balance < input.value) {
        //   return "Your amount exceeds your maximum limit.";
        // }
      },
      defaults: ({ getTokenByKey }) => ({
        token: getTokenByKey?.("eth")
      })
    }),
    defineInput({
      type: StrategyInputType.INPUT_WITH_TOKEN,
      name: "Collateral",
      placeholder: ({ input }) =>
        input.token ? `${input.token.symbol} to Withdraw` : "",
      validate: ({ input }) => {
        if (!input.token) {
          return "Collateral token is required";
        }

        if (!input.value) {
          return "Collateral amount is required";
        }
      },
      defaults: ({ getTokenByKey }) => ({
        token: getTokenByKey?.("dai")
      })
    })
  ],

  spells: async ({ inputs, convertTokenAmountToBigNumber }) => {
    return [
      {
        connector: "aave_v2",
        method: "deposit",
        args: [
          inputs[0].token.address,
          convertTokenAmountToBigNumber(
            inputs[0].value,
            inputs[0].token.decimals
          ),
          0,
          0
        ]
      },
      {
        connector: "aave_v2",
        method: "borrow",
        args: [
          inputs[1].token.address,
          convertTokenAmountToBigNumber(
            inputs[1].value,
            inputs[1].token.decimals
          ),
          2,
          0,
          0
        ]
      }
    ];
  }
});
