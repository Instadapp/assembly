import { computed, Ref, ref, watch } from "@nuxtjs/composition-api";
import BigNumber from "bignumber.js";
BigNumber.config({ POW_PRECISION: 200 });
import abis from "~/constant/abis";
import addresses from "~/constant/addresses";
import makerVaults from "~/constant/tokens/vaults";
import { useBigNumber } from "~/composables/useBigNumber";
import { useDSA } from "~/composables/useDSA";
import { useToken } from "~/composables/useToken";
import { useWeb3 } from "@instadapp/vue-web3";
import { AbiItem } from "web3-utils";
import useEventBus from "../useEventBus";

const defaultVault = {
  id: null,
  tokenKey: "eth",
  token: "ETH",
  collateralName: "ETH-A",
  collateral: "0",
  debt: "0",
  liquidatedCollateral: "0",
  status: "0",
  rate: "0",
  liquidation: "0",
  price: "0",
  netvalue: "0"
};

const vaultId = ref(null);
const vaults = ref([]);
const isNewVault = ref(false);
const vaultTypes = ref([]);
const vaultType = ref("");

export const vault = computed(() => {
  const vlt = vaults.value.find(v => v.id === vaultId.value);
  if (!isNewVault.value && !!vlt) {
    return vlt;
  }

  const vt = vaultTypes.value.find(vt => vt.type === vaultType.value);
  if (vt) {
    return { ...defaultVault, ...vt };
  }

  const defaultVaultType = vaultTypes.value[0];
  if (defaultVaultType) {
    return { ...defaultVault, ...defaultVaultType };
  }

  return defaultVault;
});

export function useMakerdaoPosition(
  collateralAmountRef: Ref = null,
  debtAmountRef: Ref = null
) {
  const { library } = useWeb3();
  const { onEvent } = useEventBus()
  const { activeAccount } = useDSA();
  const { isZero, ensureValue, times, div, max, gt } = useBigNumber();
  const { getTokenByKey } = useToken();

  const vaultTokenType = computed(() => vault.value.vaultTokenType);

  const price = computed(() => ensureValue(vault.value.price).toFixed());

  const collateralUsd = computed(() =>
    times(collateral.value, price.value).toFixed()
  );
  const collateral = computed(() =>
    ensureValue(vault.value.collateral).toFixed()
  );

  const liquidation = computed(() =>
    ensureValue(vault.value.liquidation).toFixed()
  );
  const tokenKey = computed(() => vault.value.tokenKey);

  const token = computed(() => getTokenByKey(tokenKey.value));
  const symbol = computed(() => token.value.symbol ?? "ETH");
  const rate = computed(() => ensureValue(vault.value.rate).toFixed());
  const netValue = computed(() => ensureValue(vault.value.netValue).toFixed());

  const status = computed(() => {
    if (!collateralAmountRef || !debtAmountRef)
      return ensureValue(vault.value.status).toFixed();
    return isZero(collateralAmountRef.value) && !isZero(debtAmountRef.value)
      ? "1.1"
      : div(
          debtAmountRef.value,
          times(collateralAmountRef.value, price.value)
        ).toFixed();
  });

  const liquidationPrice = computed(() => {
    if (!collateralAmountRef || !debtAmountRef)
      return max(
        div(div(debt.value, collateral.value), liquidation.value),
        "0"
      ).toFixed();
    return isZero(collateralAmountRef.value) && !isZero(debtAmountRef.value)
      ? times(price.value, "1.1").toFixed()
      : max(
          div(
            div(debtAmountRef.value, collateralAmountRef.value),
            liquidation.value
          ),
          "0"
        ).toFixed();
  });

  const debt = computed(() => ensureValue(vault.value.debt).toFixed());
  const minDebt = computed(() => vaultTypes.value[0]?.totalFloor.toString() || "5000");
  const debtCeilingReached = computed(() =>
    vaultTypes.value?.some(v =>
      gt(v.overallTotalDebt, v.overallTotalDebtCeiling)
    )
  );

  const fetchPosition = async () => {
    if (!library.value) {
      return;
    }

    vaultTypes.value = await getVaultTypes(library.value);

    if (!activeAccount.value) {
      return;
    }
    vaults.value = await getVaults(activeAccount.value.address, library.value);
    if (vaults.value.length > 0 && !vaultId.value) {
      vaultId.value = vaults.value[0].id;
    }
  };

  onEvent("protocol::makerdao::refresh", fetchPosition);

  watch(
    library,
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

  const selectVault = vid => {
    if (vid === vaultId.value && !isNewVault.value) return;
    vaultId.value = vid;
    isNewVault.value = false;
  };

  return {
    fetchPosition,
    vaultId: computed(() => (isNewVault.value ? "0" : vaultId.value || "0")),
    selectVault,
    vaultTokenType,
    vault,
    vaults,
    vaultType,
    vaultTypes,
    isNewVault,
    collateralUsd,
    collateral,
    price,
    liquidation,
    tokenKey,
    token,
    symbol,
    rate,
    netValue,
    status,
    liquidationPrice,
    liquidationMaxPrice: price,
    debt,
    minDebt,
    debtCeilingReached
  };
}

async function getVaultTypes(web3) {
  const makerResolveABI = abis.resolver.maker;
  const makerResolveAddr = addresses.mainnet.resolver.maker;

  const makerResolverInstance = new web3.eth.Contract(
    makerResolveABI as AbiItem[],
    makerResolveAddr
  );

  try {
    const rawData: any[] = await makerResolverInstance.methods
      .getColInfo(makerVaults.types)
      .call();

    return makerVaults.allVaults.map(
      ({ type, token, key: tokenKey, disabled, vaultTokenType }, i) => {
        const [
          rate,
          price,
          ratioCbyD,
          debtCeiling,
          totalFloor,
          totalDebt,
          overallTotalDebtCeiling,
          overallTotalDebt
        ] = rawData[i];

        return {
          type,
          token,
          tokenKey,
          disabled,
          vaultTokenType,
          rate: calRate(rate),
          price: new BigNumber(price).dividedBy(1e27).toFixed(),
          liquidation: new BigNumber(1)
            .dividedBy(new BigNumber(ratioCbyD).dividedBy(1e27))
            .toFixed(),
          debtCeiling: debtCeiling,
          totalDebt: new BigNumber(totalFloor)
            .dividedBy(1e18)
            .multipliedBy(1.00002)
            .toFixed(),
          totalFloor: new BigNumber(totalDebt).dividedBy(1e45),
          overallTotalDebtCeiling: new BigNumber(
            overallTotalDebtCeiling
          ).dividedBy(1e45),
          overallTotalDebt: new BigNumber(overallTotalDebt).dividedBy(1e45)
        };
      }
    );
  } catch (error) {
    console.error(error);
    return [];
  }
}
async function getVaults(user, web3) {
  try {
    const makerResolveABI = abis.resolver.maker;
    const makerResolveAddr = addresses.mainnet.resolver.maker;

    const makerResolverInstance = new web3.eth.Contract(
      makerResolveABI as AbiItem[],
      makerResolveAddr
    );

    const rawData: any[] = await makerResolverInstance.methods
      .getVaults(user)
      .call();

    return rawData.map(
      ([
        id,
        owner,
        type,
        collInWei,
        ,
        debtInWei,
        liquidatedColInWei,
        ratePerBlock,
        priceInWei,
        liquidationRatioCbyD,
        urn
      ]) => {
        const collateral = new BigNumber(collInWei).dividedBy(1e18);
        const debt = new BigNumber(debtInWei).dividedBy(1e18);
        const price = new BigNumber(priceInWei).dividedBy(1e27);

        const vault = makerVaults.getVaultByType(type);

        return {
          id,
          owner,
          type,
          tokenKey: vault.key,
          token: vault.token,
          vaultTokenType: vault.vaultTokenType,
          collateral: collateral.toFixed(),
          debt: debt.toFixed(),
          liquidatedCollateral: new BigNumber(liquidatedColInWei)
            .dividedBy(1e18)
            .toFixed(),
          rate: calRate(ratePerBlock),
          price: price.toFixed(),
          liquidation: new BigNumber(1)
            .dividedBy(new BigNumber(liquidationRatioCbyD).dividedBy(1e27))
            .toFixed(),
          urn,
          netValue: collateral
            .multipliedBy(price)
            .minus(debt)
            .toFixed(),
          status: collateral.isZero()
            ? "0"
            : debt.dividedBy(collateral.multipliedBy(price)).toFixed()
        };
      }
    );
  } catch (error) {
    console.error(error);
    return [];
  }
}

function calRate(ilkRate) {
  try {
    return new BigNumber(ilkRate)
      .dividedBy(1e27)
      .pow(31545000)
      .minus(1)
      .toFixed(18);
  } catch (error) {
    console.log("error", error);
  }
}
