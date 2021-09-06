import { AbstractConnector } from '@web3-react/abstract-connector'
import { injected, walletconnect, portis, walletlink } from '~/connectors'

import METAMASK_ICON_URL from '~/assets/icons/metamask.svg?inline'
import WALLETCONNECT_ICON_URL from '~/assets/icons/wallet-connect-icon.svg?inline'
import PORTIS_ICON_URL from '~/assets/icons/portis.svg?inline'
import COINBASE_ICON_URL from '~/assets/icons/coinbase.svg?inline'

interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconURL: string;
}


export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    METAMASK: {
      connector: injected,
      name: 'MetaMask',
      iconURL: METAMASK_ICON_URL,
    },
    WALLET_CONNECT: {
      connector: walletconnect,
      name: 'WalletConnect',
      iconURL: WALLETCONNECT_ICON_URL,
    },
    Portis: {
      connector: portis,
      name: 'Portis',
      iconURL: PORTIS_ICON_URL,
    },
    WALLET_LINK: {
      connector: walletlink,
      name: 'Coinbase Wallet',
      iconURL: COINBASE_ICON_URL,
    },
  }
  