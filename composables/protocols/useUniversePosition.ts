import BigNumber from 'bignumber.js';
import { useWeb3 } from '@instadapp/vue-web3';
import { ref, useContext, watch } from '@nuxtjs/composition-api';

import universeABI from '~/abis/read/universe.json';
import addresses from '~/constant/addresses';
import tokens from '~/constant/tokens';

import { useBigNumber } from '../useBigNumber';
import { useDSA } from '../useDSA';
import useEventBus from '../useEventBus';

const resolver = addresses.mainnet.resolver.universe;

const allTokens = tokens.mainnet.allTokens.map(token => token.address);

const vaults = ref<Vault[]>([]);
const totalDeposit = ref<Number>(0);
const totalUNTReward = ref<Number>(0);

interface VaultModel {
  tokenSymbol: string
  tokenAddress: string
  tokenDecimals: number
  tokenIndex: 0 | 1
  vaultName: string
  vaultAddress: string
  feeAprLifetime: string
  feeApr24h: string
  netReturn: string
  netApr: string
  price: string
  untReward: number
  totalUnclaimedUnt: number
}

type Vault = VaultModel & {
  deposit: string,
  depositInUsd: string
  link: string
}

export function useUniversePosition() {
  const { $axios } = useContext();
  const { times } = useBigNumber();
  const { library } = useWeb3();
  const { activeAccount } = useDSA();
  const { onEvent } = useEventBus();

  const fetchPosition = async () => {
    const { data: availableVaults } = await $axios
      .$get<{ data: VaultModel[] }>("https://api.webwxk.com/singleVault/universe/instadapp/vaultList")

    if (!library.value) {
      return;
    }

    if (!activeAccount.value) {
      vaults.value = availableVaults.map(vault => {
        return {
          ...vault,
          link: `https://universe.finance/single/vault/${vault.vaultAddress}?watch=`,
          deposit: '0',
          depositInUsd: '0'
        }
      });
      
      return;
    }

    const resolverInstance = new library.value.eth.Contract(
      universeABI as any,
      resolver
    );

    const vaultAddressArr = [
      ...new Set(availableVaults.map(v => v.vaultAddress))
    ]
    
    const account = activeAccount.value.address;
    const rawData = await resolverInstance.methods
      .getUserShareAmountList(vaultAddressArr, account)
      .call();
    const vaultsAmounts = vaultAddressArr.map((address, index) => ({
      vaultAddress: address,
      token0Amount: rawData[index][0],
      token1Amount: rawData[index][1]
    }))
    let totalDepositInUsd = 0;
    let untReward = 0;

    const newVaults = [];
    
    availableVaults.forEach(vault => {
      const amounts = vaultsAmounts.find(vm => vm.vaultAddress === vault.vaultAddress);

      if (amounts) {
        const amount = vault.tokenIndex === 0 ? amounts.token0Amount : amounts.token1Amount;
        const deposit = new BigNumber(amount)
              .dividedBy(10 ** vault.tokenDecimals)
              .toFixed();
        const depositInUsd = times(deposit, vault.price === '0' ? 1 : vault.price).toFixed()
        totalDepositInUsd += Number(depositInUsd);
        untReward += vault.totalUnclaimedUnt;
  
        const item = {
          ...vault,
          link: `https://universe.finance/single/vault/${vault.vaultAddress}?watch=${account}`,
          deposit,
          depositInUsd
        }
        newVaults.push(item);
      }
    })

    vaults.value = newVaults;
    totalDeposit.value = totalDepositInUsd;
    totalUNTReward.value = untReward;
  };

  const refreshPosition = async () => {
    await fetchPosition();
  };

  onEvent("protocol::universe::refresh", refreshPosition);

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

  return {
    vaults,
    totalDeposit,
    totalUNTReward,
    refreshPosition,
  };
}
