import { computed, Ref, ref, watch } from "@nuxtjs/composition-api";
import { useBalances } from "../useBalances";
import { useBigNumber } from "../useBigNumber";
import { useToken } from "../useToken";
import { useWeb3 } from "~/composables/useWeb3";
import { AbiItem } from "web3-utils";
import BigNumber from "bignumber.js";
BigNumber.config({ POW_PRECISION: 200 });
import abis from "~/constant/abis";
import addresses from "~/constant/addresses";
import { useDSA } from "../useDSA";
import useEventBus from "../useEventBus";

export const trove = ref<any>({
  collateral: "0",
  debt: "0",
  stabilityAmount: "0",
  stabilityEthGain: "0",
  stabilityLqtyGain: "0",
  stakeAmount: "0",
  stakeEthGain: "0",
  stakeLqtyGain: "0",
  price: "0",
  ratio: "0",
  tokenKey: "eth",
  token: "ETH",
  liquidation: "0"
});

const troveTypes = ref([
  {
    totalCollateral: "0",
    price: "0",
    totalRatio: "0",
    tokenKey: "eth",
    token: "ETH",
    isRecoveryMode: false,
    borrowFee: "0",
    liquidation: "0",
    minDebt: "2000",
    liquidationReserve: "200"
  }
]);

const troveOverallDetails = computed(() =>
  troveTypes.value.find(t => t.tokenKey === trove.value.tokenKey)
);

export function useLiquityPosition(
  collateralAmountRef: Ref = null,
  debtAmountRef: Ref = null
) {
  const { onEvent } = useEventBus()
  const { web3 } = useWeb3();
  const { activeAccount } = useDSA();

  const { isZero, times, div, max, minus, plus } = useBigNumber();
  const { getTokenByKey, valInt } = useToken();
  const { prices } = useBalances();

  const collateralToken = computed(() => getTokenByKey("eth"));
  const debtToken = computed(() => getTokenByKey("lusd"));
  const stakingToken = computed(() => getTokenByKey("lqty"));

  const collateral = computed(() => trove.value.collateral);
  const collateralInWei = computed(() =>
    valInt(collateral.value, collateralToken.value?.decimals)
  );
  const priceInUsd = computed(() => trove.value.price);
  const ratio = computed(() => trove.value.ratio);
  const debt = computed(() => trove.value.debt);
  const debtInWei = computed(() => valInt(debt.value, debtToken.value?.decimals))
  const collateralUsd = computed(() =>
    times(collateral.value, priceInUsd.value).toFixed()
  );
  const stabilityAmount = computed(() => trove.value.stabilityAmount);
  const debtUsd = computed(() => times(debt.value, "1").toFixed());
  const stabilityAmountUsd = computed(() =>
    times(stabilityAmount.value, "1").toFixed()
  );

  const stakingTokenPrice = computed(() =>
    stakingToken.value ? prices.mainnet[stakingToken.value.address] : "0"
  );
  const stakeAmount = computed(() => trove.value.stakeAmount);
  const stakeEthGain = computed(() => trove.value.stakeEthGain);
  const stakeLqtyGain = computed(() => trove.value.stakeLqtyGain);
  const stakingAmountUsd = computed(() =>
    times(stakeAmount.value, stakingTokenPrice.value).toFixed()
  );
  const netValue = computed(() =>
    plus(
      plus(minus(collateralUsd.value, debtUsd.value), stabilityAmountUsd.value),
      stakingAmountUsd.value
    ).toFixed()
  );

  const borrowFee = computed(() => troveOverallDetails.value.borrowFee);
  const maxFeePercentageInWei = computed(() =>
    times(times(borrowFee.value, "100"), "1e18").toFixed()
  );
  const liquidation = computed(() => troveOverallDetails.value.liquidation);

  const status = computed(() => {
    if (!collateralAmountRef || !debtAmountRef) return ratio.value;
    return isZero(collateralAmountRef.value) && !isZero(debtAmountRef.value)
      ? "1.1"
      : div(
          debtAmountRef.value,
          times(collateralAmountRef.value, priceInUsd.value)
        ).toFixed();
  });

  const liquidationPrice = computed(() => {
    if (!collateralAmountRef || !debtAmountRef) {
      return max(
        div(div(debt.value, collateral.value), liquidation.value),
        "0"
      ).toFixed();
    }
    return isZero(collateralAmountRef.value) && !isZero(debtAmountRef.value)
      ? times(priceInUsd.value, "1.1").toFixed()
      : max(
          div(
            div(debtAmountRef.value, collateralAmountRef.value),
            liquidation.value
          ),
          "0"
        ).toFixed();
  });

  const troveOpened = computed(
    () => !isZero(collateral.value) && !isZero(debt.value)
  );

  const minDebt = computed(() => troveOverallDetails.value.minDebt);
  const liquidationReserve = computed(
    () => troveOverallDetails.value.liquidationReserve
  );

  const fetchPosition = async () => {
    if (!web3.value) {
      return;
    }

    troveTypes.value = await getTroveTypes(web3.value);

    if (!activeAccount.value) {
      return;
    }

    trove.value = await getTrove(activeAccount.value.address, web3.value);
  };

  async function getTrovePositionHints(collateralInWei, debtInWei) {
    try {
      const liquityInstance = new web3.value.eth.Contract(
        abis.resolver.liquity as AbiItem[],
        addresses.mainnet.resolver.liquity
      );

      const {
        upperHint,
        lowerHint
      } = await liquityInstance.methods
        .getTrovePositionHints(
          collateralInWei.toString(),
          debtInWei.toString(),
          0,
          0
        )
        .call();

      return {
        upperHint,
        lowerHint
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  onEvent("protocol::liquity::refresh", fetchPosition);


  watch(
    web3,
    async val => {
      if (val) {
        fetchPosition();
      }
    },
    { immediate: true }
  );

  watch(
    activeAccount,
    async val => {
      if (val) {
        fetchPosition();
      }
    },
    { immediate: true }
  );

  return {
    fetchPosition,
    troveOpened,
    netValue,
    borrowFee,
    status,
    liquidation,
    liquidationPrice,
    liquidationMaxPrice: priceInUsd,
    collateralToken,
    debtToken,
    minDebt,
    liquidationReserve,
    maxFeePercentageInWei,
    getTrovePositionHints,
    collateral,
    collateralInWei,
    collateralUsd,
    priceInUsd,
    debt,
    debtInWei,
  };
}

async function getTrove(user, web3) {
  const resolveABI = abis.resolver.liquity;
  const resolveAddr = addresses.mainnet.resolver.liquity;

  const liquityInstance = new web3.eth.Contract(
    resolveABI as AbiItem[],
    resolveAddr
  );

  try {
    const {
      trove,
      stake,
      stability
    } = await liquityInstance.methods.getPosition(user).call();
    const { collateral, debt, icr, price } = trove;
    const ratio =
      icr ===
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        ? "0"
        : new BigNumber(1e18).dividedBy(icr).toString();

    return {
      collateral: new BigNumber(collateral).dividedBy(1e18).toString(),
      debt: new BigNumber(debt).dividedBy(1e18).toString(),
      stabilityAmount: new BigNumber(stability.deposit)
        .dividedBy(1e18)
        .toString(),
      stabilityEthGain: new BigNumber(stability.ethGain)
        .dividedBy(1e18)
        .toString(),
      stabilityLqtyGain: new BigNumber(stability.lqtyGain)
        .dividedBy(1e18)
        .toString(),
      stakeAmount: new BigNumber(stake.amount).dividedBy(1e18).toString(),
      stakeEthGain: new BigNumber(stake.ethGain).dividedBy(1e18).toString(),
      stakeLqtyGain: new BigNumber(stake.lusdGain).dividedBy(1e18).toString(),
      price: new BigNumber(price).dividedBy(1e18).toString(),
      ratio,
      tokenKey: "eth",
      token: "ETH",
      liquidation: ratio
    };
  } catch (error) {
    console.error(error);
    return {};
  }
}

async function getTroveTypes(web3) {
  try {
    const resolveABI = abis.resolver.liquity;
    const resolveAddr = addresses.mainnet.resolver.liquity;

    const liquityInstance = new web3.eth.Contract(
      resolveABI as AbiItem[],
      resolveAddr
    );
    const {
      borrowFee,
      ethTvl,
      isInRecoveryMode: isRecoveryMode,
      tcr,
      price
    } = await liquityInstance.methods.getSystemState().call();

    return [
      {
        totalCollateral: new BigNumber(ethTvl).dividedBy(1e18).toString(),
        price: new BigNumber(price).dividedBy(1e18).toString(),
        totalRatio: new BigNumber(1e18).dividedBy(tcr).toString(),
        tokenKey: "eth",
        token: "ETH",
        isRecoveryMode,
        borrowFee: new BigNumber(borrowFee).dividedBy(1e18).toString(),
        liquidation: new BigNumber(100).dividedBy(110).toString(),
        minDebt: new BigNumber(2000).toString(),
        liquidationReserve: "200"
      }
    ];
  } catch (error) {
    return [];
  }
}
