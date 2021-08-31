import { AbiItem } from "web3-utils";

import compoundABI from "~/abis/read/compound.json";
import { computed, ref, watch } from "@nuxtjs/composition-api";
import { useDSA } from "~/composables/useDSA";
import { useWeb3 } from "@kabbouchi/vue-web3";
import BigNumber from "bignumber.js";
import tokens from "~/constant/tokens";
import { Network, useNetwork } from "~/composables/useNetwork";
import { useBigNumber } from "~/composables/useBigNumber";
import { usePosition } from "~/composables/usePosition";
import { useToken } from "~/composables/useToken";
import addresses from "~/constant/addresses";
import ctokens from "~/constant/ctokens";
import tokenIdMapping from "~/constant/tokenIdMapping";
import { useSorting } from "~/composables/useSorting";

const {
  times,
  isZero,
  div,
  max,
  gt,
  minus,
  ensureValue,
  plus
} = useBigNumber();
const { getType } = usePosition();

const position = ref<any>({
  totalSupplyInEth: new BigNumber(0),
  totalBorrowInEth: new BigNumber(0),
  totalBorrowStableInEth: new BigNumber(0),
  totalBorrowVariableInEth: new BigNumber(0),
  maxBorrowLimitInEth: new BigNumber(0),
  maxBorrowLiquidityLimitInEth: new BigNumber(0),
  ethPriceInUsd: "0",
  data: []
});
const totalSupply = computed(() =>
  position.value
    ? times(
        position.value.totalSupplyInEth,
        position.value.ethPriceInUsd
      ).toFixed()
    : 0
);

const totalBorrow = computed(() =>
  position.value
    ? times(
        position.value.totalBorrowInEth,
        position.value.ethPriceInUsd
      ).toFixed()
    : 0
);

const ethPriceInUsd = computed(() => position.value?.ethPriceInUsd);

export function useCompoundPosition(
  { overridePosition } = { overridePosition: null }
) {
  overridePosition = overridePosition || (pos => pos);

  const { library } = useWeb3();
  const { activeNetworkId } = useNetwork()
  const { activeAccount } = useDSA();
  const { getTokenByKey } = useToken();
  const { byMaxSupplyOrBorrowDesc } = useSorting()
  const resolver = computed(() => addresses.mainnet.resolver.compound);

  const fetchPosition = async () => {
    if (!library.value) {
      return;
    }

    if (!activeAccount.value) {
      return;
    }

    const resolverInstance = new library.value.eth.Contract(
      compoundABI as AbiItem[],
      resolver.value
    );

    const tokensArr = ctokens[activeNetworkId.value].allTokens.map(a => a.address);

    const compoundRawData = await resolverInstance.methods
      .getPosition(activeAccount.value.address, tokensArr)
      .call();

    const newPos = calculateCompoundPosition(
      compoundRawData,
      activeNetworkId.value
    );

    return newPos;
  };

  const refreshPosition = async () => {
    position.value = await fetchPosition();
  };

  watch(
    library,
    async val => {
      if (val) {
        refreshPosition();
      }
    },
    { immediate: true }
  );

  watch(
    activeAccount,
    async val => {
      if (val) {
        refreshPosition();
      }
    },
    { immediate: true }
  );

  const stats = computed(() =>
    displayPositions.value.reduce(
      (stats, { key, supply, borrow, priceInEth, factor }) => {
        if (key === "eth") {
          stats.ethSupplied = supply;
        }

        stats.totalSupplyInEth = plus(
          stats.totalSupplyInEth,
          times(supply, priceInEth)
        ).toFixed();
        stats.totalBorrowInEth = plus(
          stats.totalBorrowInEth,
          times(borrow, priceInEth)
        ).toFixed();
        stats.totalMaxBorrowLimitInEth = plus(
          stats.totalMaxBorrowLimitInEth,
          times(supply, times(priceInEth, factor))
        ).toFixed();

        return stats;
      },
      {
        totalSupplyInEth: "0",
        totalBorrowInEth: "0",
        totalMaxBorrowLimitInEth: "0",
        ethSupplied: "0"
      }
    )
  );

  const rewardTokenPriceInUsd = computed(() => {
    return ensureValue(
      position.value.data.find(position => position.key === "comp")?.priceInUsd
    );
  });

  const displayPositions = computed(() => {
    if (!position.value) {
      return [];
    }

    return ctokens[activeNetworkId.value].allTokens
      .flatMap(ctoken => {
        const token = getTokenByKey(ctoken.root);
        if (!token) {
          return [];
        }

        const ctokenPosition = overridePosition(
          position.value.data.find(x => x.cTokenId === ctoken.id)
        );

        if (!ctokenPosition) {
          return [];
        }

        const p = getPositionOrDefaultPosition(token, ctokenPosition);
        if (gt(p.supply, "0") && gt(p.borrow, "0")) {
          return [
            { ...p, type: "supply" },
            { ...p, type: "borrow" }
          ];
        } else {
          return [p];
        }
      })
      .filter(p => {
        if (
          tokenIdMapping.archived.compound.includes(p.tokenId) &&
          isZero(p.supply) &&
          isZero(p.borrow)
        ) {
          return false;
        }
        return true;
      })
      .sort(byMaxSupplyOrBorrowDesc);
  });

  function getPositionOrDefaultPosition(token, pos) {
    if (!pos) {
      const defaultPosition = {
        key: token?.key,
        tokenId: `${token.symbol}-A`,
        ctknBalance: "0",
        cTokenDecimals: "0",
        cf: "0",
        supply: "0",
        supplyUsd: "0",
        supplyRate: "0",
        supplyYield: "0",
        borrow: "0",
        borrowUsd: "0",
        borrowRate: "0",
        borrowYield: "0",
        type: "no",
        borrowEnabled: true,
        supplyRewardRate: "0",
        borrowRewardRate: "0",
        priceInUsd: "0"
      };

      return defaultPosition;
    }

    return {
      key: token?.key,
      tokenId: pos.cTokenId,
      ctknBalance: pos.ctknBalance,
      cTokenDecimals: pos.cTokenDecimals,
      cf: pos.factor,
      supply: pos.supply,
      supplyUsd: times(pos.supply, pos.priceInUsd).toFixed(),
      supplyRate: pos.supplyRate,
      supplyYield: pos.supplyYield,
      borrow: pos.borrow,
      borrowUsd: times(pos.borrow, pos.priceInUsd).toFixed(),
      borrowRate: pos.borrowRate,
      borrowYield: pos.borrowYield,
      borrowEnabled: pos.borrowEnabled,
      type: getType(pos),
      supplyRewardRate: times(
        pos.compSupplyApy,
        rewardTokenPriceInUsd.value
      ).toFixed(),
      borrowRewardRate: times(
        pos.compBorrowApy,
        rewardTokenPriceInUsd.value
      ).toFixed(),
      priceInUsd: pos.priceInUsd,
      priceInEth: pos.priceInEth,
      factor: pos.factor,
    };
  }

  const liquidationPrice = computed(() => {
    if (isZero(stats.value.ethSupplied)) return "0";

    return max(
      times(
        div(
          stats.value.totalBorrowInEth,
          stats.value.totalMaxBorrowLimitInEth
        ),
        ethPriceInUsd.value
      ),
      "0"
    ).toFixed();
  });

  const status = computed(() => {
    if (
      isZero(stats.value.totalSupplyInEth) &&
      !isZero(stats.value.totalBorrowInEth)
    )
      return "1.1";
    if (isZero(stats.value.totalSupplyInEth)) return "0";

    return max(
      div(stats.value.totalBorrowInEth, stats.value.totalSupplyInEth),
      "0"
    ).toFixed();
  });

  const liquidation = computed(() => {
    if (isZero(stats.value.totalSupplyInEth)) return "0";

    return max(
      div(stats.value.totalMaxBorrowLimitInEth, stats.value.totalSupplyInEth),
      "0"
    ).toFixed();
  });

  return {
    stats,
    displayPositions,
    position: position,
    fetchPosition,
    refreshPosition,
    totalSupply,
    totalBorrow,
    status,
    liquidation,
    liquidationPrice,
    liquidationMaxPrice: ethPriceInUsd
  };
}

function calculateCompoundPosition(
  res: any[],
  network: Network = Network.Mainnet
) {
  try {
    const newPos = {
      totalSupplyInEth: new BigNumber(0),
      totalBorrowInEth: new BigNumber(0),
      totalBorrowStableInEth: new BigNumber(0),
      totalBorrowVariableInEth: new BigNumber(0),
      maxBorrowLimitInEth: new BigNumber(0),
      maxBorrowLiquidityLimitInEth: new BigNumber(0),
      tokens: {},
      data: []
    };
    const dataPos = [];
    let ethPrice = "0";
    ctokens[network].allTokens.forEach((ctoken, i) => {
      const key = ctoken.address;
      const [
        priceInEthInWei,
        priceInUsdInWei,
        exchangeRateInWei,
        cBalanceInWei,
        borrowInWei,
        totalBorrowsInWei,
        totalSuppliedInWei,
        borrowCapInWei,
        supplyRatePerBlock,
        borrowRatePerBlock,
        collateralFactorInWei,
        compSpeed,
        isComped,
        isBorrowPaused
      ] = res[0][i];

      const decimals = tokens[network].getTokenByKey(ctoken.root).decimals;
      const root = ctoken.root;

      const blocksInYear = 2398050;

      const priceInEth = new BigNumber(priceInEthInWei).dividedBy(1e18);
      const priceInUsd = new BigNumber(priceInUsdInWei).dividedBy(1e18);
      const exchangeRate = new BigNumber(exchangeRateInWei).dividedBy(1e18);
      const supply = new BigNumber(cBalanceInWei)
        .multipliedBy(exchangeRate)
        .dividedBy(10 ** decimals);
      const borrow = new BigNumber(borrowInWei).dividedBy(10 ** decimals);
      const supplyRate = new BigNumber(supplyRatePerBlock)
        .multipliedBy(blocksInYear)
        .dividedBy(1e18);
      const supplyYield = supplyRate
        .dividedBy(365)
        .plus(1)
        .exponentiatedBy(365)
        .minus(1)
        .toFixed(18);
      const borrowRate = new BigNumber(borrowRatePerBlock)
        .multipliedBy(blocksInYear)
        .dividedBy(1e18);
      const borrowYield = borrowRate
        .dividedBy(365)
        .plus(1)
        .exponentiatedBy(365)
        .minus(1)
        .toFixed(18);
      const totalBorrow = new BigNumber(totalBorrowsInWei).dividedBy(
        10 ** decimals
      );
      const borrowCap = new BigNumber(borrowCapInWei)
        .dividedBy(10 ** decimals)
        .multipliedBy(0.9999)
        .toFixed();
      const collateralFactor = new BigNumber(collateralFactorInWei)
        .dividedBy(1e18)
        .toFixed();
      const totalSupplied = new BigNumber(totalSuppliedInWei)
        .dividedBy(10 ** decimals)
        .multipliedBy(priceInUsd);
      const compSupplyApy = new BigNumber(compSpeed)
        .multipliedBy(blocksInYear)
        .dividedBy(1e18)
        .dividedBy(totalSupplied)
        .toFixed();
      const compBorrowApy = new BigNumber(compSpeed)
        .multipliedBy(blocksInYear)
        .dividedBy(1e18)
        .dividedBy(totalBorrow.multipliedBy(priceInUsd))
        .toFixed();

      newPos.totalSupplyInEth = newPos.totalSupplyInEth.plus(
        supply.multipliedBy(priceInEth)
      );
      newPos.maxBorrowLimitInEth = newPos.maxBorrowLimitInEth.plus(
        supply.multipliedBy(priceInEth).multipliedBy(ctoken.factor)
      );
      newPos.totalBorrowInEth = newPos.totalBorrowInEth.plus(
        borrow.multipliedBy(priceInEth)
      );

      if (ctoken.root === "eth") ethPrice = priceInUsd.toFixed();
      dataPos.push({
        key: root,
        cTokenAddr: key,
        cTokenKey: ctoken.key,
        cTokenDecimals: ctoken.decimals.toString(),
        cTokenId: ctoken.id,
        priceInEth: priceInEth.toFixed(),
        priceInUsd: priceInUsd.toFixed(),
        exchangeRate: exchangeRate.toFixed(),
        ctknBalance: cBalanceInWei,
        supply: supply.toFixed(),
        borrow: borrow.toFixed(),
        supplyRate: supplyRate.toFixed(),
        supplyYield,
        borrowRate: borrowRate.toFixed(),
        borrowYield,
        factor: collateralFactor,
        totalBorrow: totalBorrow.toFixed(),
        borrowCap,
        isComped,
        borrowEnabled: !isBorrowPaused,
        compSupplyApy,
        compBorrowApy
      });
    });

    const totalSupplyInEthIsZero = newPos.totalSupplyInEth.isZero();
    const status = totalSupplyInEthIsZero
      ? 0
      : newPos.totalBorrowInEth.dividedBy(newPos.totalSupplyInEth).toFixed();
    const liquidation = totalSupplyInEthIsZero
      ? 0
      : newPos.maxBorrowLimitInEth.dividedBy(newPos.totalSupplyInEth).toFixed();
    //@ts-ignore
    newPos.totalSupplyInEth = newPos.totalSupplyInEth.toFixed();
    //@ts-ignore
    newPos.totalBorrowInEth = newPos.totalBorrowInEth.toFixed();
    //@ts-ignore
    newPos.maxBorrowLimitInEth = newPos.maxBorrowLimitInEth.toFixed();

    //@ts-ignore
    newPos.status = status;

    //@ts-ignore
    newPos.liquidation = liquidation;

    //@ts-ignore
    newPos.ethPriceInUsd = ethPrice;

    const comp = res[1];
    //@ts-ignore
    newPos.compBalance = new BigNumber(comp.balance).dividedBy(1e18).toFixed();

    //@ts-ignore
    newPos.compAccrued = new BigNumber(comp.allocated)
      .dividedBy(1e18)
      .toFixed();
    //@ts-ignore
    newPos.compDelegate = comp.delegate;
    //@ts-ignore
    newPos.compVotes = comp.votes;

    newPos.data = dataPos;

    return newPos;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
