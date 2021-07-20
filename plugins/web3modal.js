import WalletConnectProvider from "@walletconnect/web3-provider";
import { setProviders } from "~/composables/useWeb3"
import WalletLink from 'walletlink'
import Portis from '@portis/web3'
import SVGcoinbase from '~/assets/coinbase.svg'

export default ({ $config }) => {
    setProviders({
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: $config.INFURA_ID,
                rpc: {
                    137: 'https://rpc-mainnet.maticvigil.com',
                },
            },
        },
        portis: {
            package: Portis,
            options: {
                id: $config.PORTIS_ID,
            },
        },
        'custom-walletlink': {
            display: {
                logo: SVGcoinbase,
                name: 'Coinbase Wallet',
                description: 'Scan with Coinbase Wallet to connect',
            },
            package: WalletLink,
            options: {
                infuraId: $config.INFURA_ID,
            },
            connector: async (ProviderPackage, options) => {
                const ETH_JSONRPC_URL = `https://mainnet.infura.io/v3/${options.infuraId}`
                const CHAIN_ID = 1

                // Initialize WalletLink
                const walletLink = new ProviderPackage({
                    appName: 'Instadapp',
                    appLogoUrl: 'https://raw.githubusercontent.com/InstaDApp/brand/master/instadapp%20logo%20only%20filled.svg',
                    darkMode: false,
                })

                // Initialize a Web3 Provider object
                const provider = await walletLink.makeWeb3Provider(ETH_JSONRPC_URL, CHAIN_ID)
                await provider
                    .enable()
                    .then((accounts) => {
                        // eslint-disable-next-line no-console
                        console.log('Connected to Coinbase Wallet:', accounts[0])
                    })
                    .catch((err) => {
                        // eslint-disable-next-line no-console
                        console.error(err)
                        throw err
                    })
                return provider
            },
        },
    });
}