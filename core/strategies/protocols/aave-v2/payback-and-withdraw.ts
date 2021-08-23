import tokens from "~/constant/tokens";
import { defineStrategy, defineInput, StrategyInputType } from "../../helpers";

export default defineStrategy({
  name: "Payback & Withdraw",
  description: "Payback debt & withdraw collateral in a single txn.",
  author: "Instadapp Team",

  inputs: [
    defineInput({
      type: StrategyInputType.INPUT_WITH_TOKEN,
      name: "Debt",
      placeholder: ({ input }) => `${input.token.symbol} to Payback`,
      validate: ({ input }) => {
        if (!input.token) {
          return "Token is required";
        }

        if (input.token.balance < input.value) {
          return "Your amount exceeds your maximum limit.";
        }
      },
      token: tokens.mainnet.getTokenByKey("eth")
    }),
    defineInput({
      type: StrategyInputType.INPUT_WITH_TOKEN,
      name: "Collateral",
      placeholder: ({ input }) => `${input.token.symbol} to Withdraw`,
      token: tokens.mainnet.getTokenByKey("dai")
    })
  ],

  spells: async ({ inputs }) => {
    return [
      {
        connector: "aave_v2",
        method: "payback",
        args: [inputs[0].token.address, inputs[0].value, 1, 0, 0]
      },
      {
        connector: "aave_v2",
        method: "withdraw",
        args: [inputs[1].token.address, inputs[1].value, 0, 0]
      }
    ];
  }
});
