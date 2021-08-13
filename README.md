# Assembly

<img src="https://raw.githubusercontent.com/Instadapp/assembly/master/banner.png">


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

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).
