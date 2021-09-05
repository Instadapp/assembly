import BigNumber from "bignumber.js";
import abis from "~/constant/abis";
import addresses from "~/constant/addresses";
import {
  defineStrategy,
  defineStrategyComponent,
  StrategyComponentType,
  StrategyProtocol
} from "../../helpers";

export default defineStrategy({
  protocol: StrategyProtocol.LIQUITY,
  name: "Payback & Withdraw",
  description: "Payback debt & withdraw collateral in a single txn.",
  author: "Instadapp Team",

  submitText: "Payback & Withdraw",

  details: `<p class="text-center">This strategy executes:</p>
  <ul>
    <li>Payback debt</li>
    <li>Withdraw collateral</li>
  </ul>`,

  components: [
    defineStrategyComponent({
      type: StrategyComponentType.INPUT_WITH_TOKEN,
      name: "Debt",
      placeholder: ({ component: input }) =>
        input.token ? `${input.token.symbol} to Payback` : "",
      validate: ({ component: input, toBN, position, positionExtra }) => {
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
      defaults: ({ getTokenByKey }) => ({
        token: getTokenByKey?.("lusd")
      })
    }),
    defineStrategyComponent({
      type: StrategyComponentType.INPUT_WITH_TOKEN,
      name: "Collateral",
      placeholder: ({ component: input }) =>
        input.token ? `${input.token.symbol} to Withdraw` : "",
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
      defaults: ({ getTokenByKey }) => ({
        token: getTokenByKey?.("eth")
      })
    }),
    defineStrategyComponent({
      type: StrategyComponentType.HEADING,
      name: "Projected Debt Position"
    }),
    defineStrategyComponent({
      type: StrategyComponentType.STATUS,
      name: "Status",
      update: ({ position, positionExtra, component, components, toBN }) => {
        if (!position && !positionExtra) {
          return;
        }
        const troveOverallDetails = positionExtra["troveOverallDetails"];
        component.liquidation = troveOverallDetails.liquidation;

        if (
          toBN(components[1].value).isZero() ||
          !components[1].value ||
          toBN(components[0].value).isZero() ||
          !components[0].value
        ) {
          component.status = position.ratio;
        } else {
          const changedDebt = BigNumber.max(toBN(position.debt).minus(components[0].value), '0')
          const changedCollateral = toBN(position.collateral).minus(components[1].value);
          
          component.status = changedDebt
            .div(toBN(changedCollateral).times(position.price))
            .toFixed();
        }
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
        positionExtra
      }) => {
        if (!position && !positionExtra) {
          return;
        }

        const troveOverallDetails = positionExtra["troveOverallDetails"];

        let liquidationPrice = "0";
        if (
          toBN(components[1].value).isZero() ||
          !components[1].value ||
          toBN(components[0].value).isZero() ||
          !components[0].value
        ) {
          liquidationPrice = BigNumber.max(
            toBN(position.debt)
              .div(position.collateral)
              .div(troveOverallDetails.liquidation),
            "0"
          ).toFixed();
        } else {

          const changedDebt = BigNumber.max(toBN(position.debt).minus(components[0].value), '0')
          const changedCollateral = toBN(position.collateral).minus(components[1].value);

          liquidationPrice = BigNumber.max(
            toBN(changedDebt)
              .div(changedCollateral)
              .div(troveOverallDetails.liquidation),
            "0"
          ).toFixed();
        }

        component.value = `${formatting.formatUsdMax(
          isNaN(parseInt(liquidationPrice)) ? "0" : liquidationPrice,
          position.price
        )} / ${formatting.formatUsd(position.price)}`;
      }
    })
  ],

  validate: async ({ position, components: inputs, toBN }) => {
    if (toBN(inputs[0].value).isZero() && toBN(inputs[1].value).isZero()) {
      return;
    }
    const troveOpened =
      !toBN(position.collateral).isZero() && !toBN(position.debt).isZero();

    if (!troveOpened) {
      return "You should open new trove first";
    }
  },

  spells: async ({
    components: inputs,
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

    const withdrawAmountInWei = convertTokenAmountToWei(
      inputs[0].value,
      inputs[0].token.decimals
    );
    const totalDepositAmountInWei = toBN(withdrawAmountInWei)
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
    const paybackAmountInWei = convertTokenAmountToWei(
      inputs[1].value,
      inputs[1].value.decimals
    );
    const totalBorrowAmountInWei = convertTokenAmountToWei(
      changedDebt,
      inputs[1].value.decimals
    );

    const depositAmountInWei = "0";
    const borrowAmountInWei = "0";

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
