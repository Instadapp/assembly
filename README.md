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
