import { defineStrategy, StrategyInputType } from "../../helpers/strategy";

export default defineStrategy({
  name: "Deposit & Borrow",
  description: "Deposit collateral & borrow asset in a single txn.",
  author: "Instadapp Team",

  inputs: [
    {
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

        return true;
      }
    },
    {
      type: StrategyInputType.INPUT_WITH_TOKEN,
      name: "Collateral",
      placeholder: ({ input }) => `${input.token.symbol} to Withdraw`
    }
  ],

  spells: async ({ dsa, inputs }) => {
    const spells = dsa.Spells();

    spells.add({
      connector: "aave_v2",
      method: "deposit",
      args: [inputs[0].token.address, inputs[0].value, 0, 0]
    });

    spells.add({
      connector: "aave_v2",
      method: "borrow",
      args: [inputs[1].token.address, inputs[1].value, 0, 0, 0]
    });

    return spells;
  }
});
