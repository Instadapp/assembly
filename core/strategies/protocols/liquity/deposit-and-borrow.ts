import abis from "~/constant/abis";
import addresses from "~/constant/addresses";
import {
  defineStrategy,
  defineInput,
  StrategyInputType,
  StrategyProtocol
} from "../../helpers";

export default defineStrategy({
  protocol: StrategyProtocol.LIQUITY,
  name: "Deposit & Borrow",
  description: "Deposit collateral & borrow asset in a single txn.",

  details: `<p class="text-center">This strategy executes:</p>
  <ul>
    <li>Deposit ETH as collateral</li>
    <li>Borrow LUSD as Debt</li>
  </ul>`,

  submitText: "Deposit & Borrow",

  author: "Instadapp Team",

  variables: {
    collateralTokenKey: "eth",
    debtTokenKey: "lusd"
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
      validate: ({ input, toBN, position, positionExtra }) => {
        if (!input.token) {
          return "Debt token is required";
        }

        if (!input.value) {
          return "Debt amount is required";
        }

        const troveOverallDetails = positionExtra["troveOverallDetails"];

        const borrowFeeAmount = toBN(input.value)
          .times(troveOverallDetails.borrowFee)
          .toFixed();

        const debtInputAmountWithFee = toBN(input.value)
          .plus(borrowFeeAmount)
          .toFixed();

        const changedDebt = toBN(position.debt).plus(debtInputAmountWithFee);

        const totalDebt = toBN(changedDebt).plus(
          troveOverallDetails.liquidationReserve
        );

        if (totalDebt.isZero())
          return `Minimum total debt requirement is ${troveOverallDetails.minDebt} LUSD`;

        if (totalDebt.lt(troveOverallDetails.minDebt) && totalDebt.gt("0")) {
          return `Minimum total debt requirement is ${troveOverallDetails.minDebt} LUSD`;
        }
      },
      defaults: ({ getTokenByKey, variables }) => ({
        token: getTokenByKey?.(variables.debtTokenKey)
      })
    })
  ],

  validate: async ({ position, positionExtra, inputs, toBN }) => {
    if (toBN(inputs[0].value).isZero() && toBN(inputs[1].value).isZero()) {
      return;
    }
    const troveOpened =
      !toBN(position.collateral).isZero() && !toBN(position.debt).isZero();

    if (!troveOpened) {
      return "You should open new trove first";
    }

    // const troveOverallDetails = positionExtra["troveOverallDetails"];

    // const status =
    //   toBN(inputs[0].value).isZero() && !toBN(inputs[1].value).isZero()
    //     ? toBN("1.1")
    //     : toBN(inputs[0].value)
    //         .times(position.price)
    //         .div(inputs[1].value);

    // console.log(status.toFixed(), troveOverallDetails.liquidation);

    // if (status.gt(toBN(troveOverallDetails.liquidation).minus("0.0001"))) {
    //   return "Position will liquidate.";
    // }
  },

  spells: async ({
    inputs,
    position,
    positionExtra,
    getTokenByKey,
    convertTokenAmountToWei,
    web3,
    toBN
  }) => {
    const troveOverallDetails = positionExtra["troveOverallDetails"];
    const collateralToken = getTokenByKey("eth");
    const collateralInWei = convertTokenAmountToWei(
      position.collateral,
      collateralToken.decimals
    );

    const depositAmountInWei = convertTokenAmountToWei(
      inputs[0].value,
      inputs[0].token.decimals
    );
    const totalDepositAmountInWei = toBN(depositAmountInWei)
      .plus(collateralInWei)
      .toFixed();

    const borrowFeeAmount = toBN(inputs[1].value)
      .times(troveOverallDetails.borrowFee)
      .toFixed();
    const debtInputAmountWithFee = toBN(inputs[1].value)
      .plus(borrowFeeAmount)
      .toFixed();
    const changedDebt = toBN(position.debt)
      .plus(debtInputAmountWithFee)
      .toFixed();
    const borrowAmountInWei = convertTokenAmountToWei(
      inputs[1].value,
      inputs[1].value.decimals
    );
    const totalBorrowAmountInWei = convertTokenAmountToWei(
      changedDebt,
      inputs[1].value.decimals
    );

    const withdrawAmountInWei = "0";
    const paybackAmountInWei = "0";

    const liquityInstance = new web3.eth.Contract(
      abis.resolver.liquity as any,
      addresses.mainnet.resolver.liquity
    );

    const {
      upperHint,
      lowerHint
    } = await liquityInstance.methods
      .getTrovePositionHints(
        totalDepositAmountInWei.toString(),
        totalBorrowAmountInWei.toString(),
        0,
        0
      )
      .call();

    const getIds = [0, 0, 0, 0];
    const setIds = [0, 0, 0, 0];

    return [
      {
        connector: "LIQUITY-A",
        method: "adjust",
        args: [
          toBN(troveOverallDetails.borrowFee)
            .times("100")
            .times("1e18")
            .toFixed(),
          depositAmountInWei,
          withdrawAmountInWei,
          borrowAmountInWei,
          paybackAmountInWei,
          upperHint,
          lowerHint,
          getIds,
          setIds
        ]
      }
    ];
  }
});
