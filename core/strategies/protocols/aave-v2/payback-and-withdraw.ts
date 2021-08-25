import tokens from "~/constant/tokens";
import {
  defineStrategy,
  defineInput,
  StrategyInputType,
  StrategyProtocol
} from "../../helpers";

export default defineStrategy({
  protocol: StrategyProtocol.AAVE_V2,
  name: "Payback & Withdraw",
  description: "Payback debt & withdraw collateral in a single txn.",
  author: "Instadapp Team",

  details: `<p class="text-center">This strategy executes:</p>
  <ul>
    <li>Payback debt</li>
    <li>Withdraw collateral</li>
  </ul>`,

  inputs: [
    defineInput({
      type: StrategyInputType.INPUT_WITH_TOKEN,
      name: "Debt",
      placeholder: ({ input }) =>
        input.token ? `${input.token.symbol} to Payback` : "",
      validate: ({ input }) => {
        if (!input.token) {
          return "Token is required";
        }

        if (input.token.balance < input.value) {
          return "Your amount exceeds your maximum limit.";
        }
      },
      defaults: ({ getTokenByKey }) => ({
        token: getTokenByKey?.("dai")
      })
    }),
    defineInput({
      type: StrategyInputType.INPUT_WITH_TOKEN,
      name: "Collateral",
      placeholder: ({ input }) =>
        input.token ? `${input.token.symbol} to Withdraw` : "",
      defaults: ({ getTokenByKey }) => ({
        token: getTokenByKey?.("eth")
      })
    })
  ],

  spells: async ({ inputs, convertTokenAmountToBigNumber }) => {
    return [
      {
        connector: "aave_v2",
        method: "payback",
        args: [
          inputs[0].token.address,
          convertTokenAmountToBigNumber(
            inputs[0].value,
            inputs[0].token.decimals
          ),
          12,
          0,
          0
        ]
      },
      {
        connector: "aave_v2",
        method: "withdraw",
        args: [
          inputs[1].token.address,
          convertTokenAmountToBigNumber(
            inputs[1].value,
            inputs[1].token.decimals
          ),
          0,
          0
        ]
      }
    ];
  }
});
