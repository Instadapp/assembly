import { defineStrategy, defineInput, StrategyInputType } from "../../helpers";

export default defineStrategy({
  name: "Deposit & Borrow",
  description: "Deposit collateral & borrow asset in a single txn.",
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
      tokenKeys: ["eth", "dai"],
      tokens: [{ key: "eth", symbol: "ETH" }],
      token: { key: "eth", symbol: "ETH", address : "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" }
    }),
    defineInput({
      type: StrategyInputType.INPUT_WITH_TOKEN,
      name: "Collateral",
      placeholder: ({ input }) => `${input.token.symbol} to Withdraw`,
      tokenKeys: ["eth", "dai"],
      tokens: [{ key: "eth", symbol: "ETH" }],
      token: { key: "dai", symbol: "DAI", address : "0x6B175474E89094C44Da98b954EedeAC495271d0F" }
    })
  ],

  spells: async ({ inputs }) => {
    return [
      {
        connector: "aave_v2",
        method: "deposit",
        args: [inputs[0].token.address, inputs[0].value, 0, 0]
      },
      {
        connector: "aave_v2",
        method: "borrow",
        args: [inputs[1].token.address, inputs[1].value, 1, 0, 0]
      }
    ];
  }
});
