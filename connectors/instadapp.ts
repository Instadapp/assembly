import { AbstractConnector } from "@web3-react/abstract-connector";
import { ConnectorUpdate } from "@web3-react/types";

class InstadappConnector extends AbstractConnector {
  private provider: AbstractConnector | undefined;

  public async activate(): Promise<ConnectorUpdate> {
    //@ts-ignore
    const provider = await window.parent.$nuxt.$web3Modal.connect();

    return {
      provider,
      chainId: 1,
      account: window.parent.$nuxt.$store.state.auth.dsaAddress
    };
  }
  public async getProvider(): Promise<AbstractConnector> {
    if (!this.provider) {
      //@ts-ignore
      this.provider = await window.parent.$nuxt.$web3Modal.connect();
    }
    return this.provider;
  }

  public async getChainId(): Promise<string | number> {
    const provider = await this.getProvider();

    //@ts-ignore
    return provider.chainId;
  }

  public async getAccount(): Promise<string> {
    return window.parent.$nuxt.$store.state.auth.dsaAddress;
  }

  public async deactivate(): Promise<void> {
    //@ts-ignore
    await window.parent.$nuxt.$disconnectProviderWeb3();
  }

  public async isInstadapp(): Promise<boolean> {
    return (
      window.parent &&
      window.parent.$nuxt &&
      //@ts-ignore
      typeof window.parent.$nuxt.$web3 != "undefined" &&
      //@ts-ignore
      typeof window.parent.$nuxt.$dsa != "undefined"
    );
  }
}

export { InstadappConnector };
