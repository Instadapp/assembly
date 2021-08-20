# Assembly

> The Open Source Dashboard for the Instadapp Protocol 

<img src="https://raw.githubusercontent.com/Instadapp/assembly/master/banner.png">

Instadapp Assembly is an open source dashboard for developing and building on the Instadapp Protocol. Instadapp will host a community led interface here: [assembly.instadapp.io](https://assembly.instadapp.io)

## Directory Structure

    .
    ├── ...
    ├── composables             
    │   ├── protocols/          # Logic for protocols, example `useAave2Position.ts`
    │   ├── ...       
    │   └── ...                  
    ├── ...
    ├── components             
    │   ├── protocols/          # Contains components used for protocols, example `CardAave.vue`
    │   ├── sidebar/            # Contains all sidebar components, check `useSidebar.ts`
    │   └── ...                   
    ├── ...
    ├── pages             
    │   ├── mainnet/            # Apps for Mainnet network
    │   ├── polygon/            # Apps for Polygon network
    │   └── index.vue           # List all avaiable apps             
    └── ...

## Creating new App for Mainnet

- Create a new file `my-app.vue` in `pages/mainnet` folder, or duplicat existing protocol, ex: `pages/mainnet/aave-v2.vue`
- Register the new app in `index.vue` in `appsPerNetwork` array.
- Create new protocol `useMyAppPosition.ts` in `composables/protocols` folder, check `composables/protocols/useAaveV2Position.ts` for more details.
- Create sidebars for the new app in `components/sidebar/context/my-app` folder, ex: `SidebarMyAppSupply.vue`, check `components/sidebar/context/aave-v2` for more details.
- Register the sidebars in `composables/useSidebar.ts`, check the `sidebars` array for more details.

## Development

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

## Contributing to the hosted Assembly Site

### How to Integrate DApps or Protocols
If you would like to integrate your project or contracts into the Instadapp protocol you can read our [Integration Guide](https://instadapp.notion.site/Instadapp-Protocol-Integration-d14f34f1a4aa42138154143948ddb7b4). 

After integrations are merged to the protocol, users and developers can start building use-cases and functionality on Assembly by creating a DApp page or submitting strategies for the integration. 

### How to submit a new DApp Page:
You can submit a new DApp page as a PR to this repo. The team and the Assembly Guild will review and merge the DApp page. 

The requirements will vary depending on the protocol and use-case but in general, DApp pages should attempt to be complete as possible. *i.e . A Maker DApp page should contain information that the user would need such as collateral ratio, Vault ID, amount of debt borrowed, etc.*

### How to submit a strategy to an existing DApp Page:
You can submit custom strategies and other use cases to be published on Assembly. Submit the strategy to the appropriate DApp page as a PR. 

If your strategy involves multiple protocols or does not fit in one particular DApp page you can submit to multiple DApp pages or you can submit a separate DApp page for your strategy. Not Required but useful; to share the strategy as a link on [Terminal](https://terminal.instadapp.io/) for easier review.

WIP 🚧


# 📚 Additional Links

[Developer Documentation](https://docs.instadapp.io/)

[Instadapp SDK Repo](https://github.com/Instadapp/dsa-connect)

Mainnet Connectors: [Docs](https://docs.instadapp.io/connectors/mainnet) / [Repo](https://github.com/Instadapp/dsa-connectors/tree/main/contracts/mainnet)

Polygon Connectors: [Docs](https://docs.instadapp.io/connectors/polygon) / [Repo](https://github.com/Instadapp/dsa-connectors/tree/main/contracts/polygon)

---
Visit our Homepage - [Instadapp.io](https://instadapp.io/) or reach out to the team on [Discord](https://discord.gg/GFwDf3WQvK) if you have any issues.

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).
