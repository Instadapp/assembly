import { createTokenUtils } from "../utils/create-token-utils";

// prettier-ignore
export default {
  mainnet : createTokenUtils([
    { key: "aeth", "type": "atoken", "symbol": "AETH", "name": "Aave ETH", "address": "0x3a3A65aAb0dd2A17E3F1947bA16138cd37d08c04", "decimals": 18, "factor": 0.75, "root": "eth" },
    { key: "adai", "type": "atoken", "symbol": "ADAI", "name": "Aave DAI", "address": "0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d", "decimals": 18, "factor": 0.75, "root": "dai" },
    { key: "ausdc", "type": "atoken", "symbol": "AUSDC", "name": "Aave USDC", "address": "0x9bA00D6856a4eDF4665BcA2C2309936572473B7E", "decimals": 6, "factor": 0.75, "root": "usdc" },
    { key: "ausdt", "type": "atoken", "symbol": "AUSDT", "name": "Aave USDT", "address": "0x71fc860F7D3A592A4a98740e39dB31d25db65ae8", "decimals": 6, "factor": 0, "root": "usdt" },
    { key: "asusd", "type": "atoken", "symbol": "ASUSD", "name": "Aave SUSD", "address": "0x625aE63000f46200499120B906716420bd059240", "decimals": 18, "factor": 0, "root": "susd" },
    { key: "atusd", "type": "atoken", "symbol": "ATUSD", "name": "Aave TUSD", "address": "0x4DA9b813057D04BAef4e5800E36083717b4a0341", "decimals": 18, "factor": 0.75, "root": "tusd" },
    { key: "abusd", "type": "atoken", "symbol": "ABUSD", "name": "Aave BUSD", "address": "0x6Ee0f7BB50a54AB5253dA0667B0Dc2ee526C30a8", "decimals": 18, "factor": 0, "root": "busd" },
    { key: "abat", "type": "atoken", "symbol": "ABAT", "name": "Aave BAT", "address": "0xE1BA0FB44CCb0D11b80F92f4f8Ed94CA3fF51D00", "decimals": 18, "factor": 0.6, "root": "bat" },
    { key: "aknc", "type": "atoken", "symbol": "AKNC", "name": "Aave KNC", "address": "0x9D91BE44C06d373a8a226E1f3b146956083803eB", "decimals": 18, "factor": 0.6, "root": "knc" },
    { key: "alend", "type": "atoken", "symbol": "ALEND", "name": "Aave LEND", "address": "0x7D2D3688Df45Ce7C552E19c27e007673da9204B8", "decimals": 18, "factor": 0.4, "root": "lend" },
    { key: "aaave", "type": "atoken", "symbol": "AAAVE", "name": "Aave AAVE", "address": "0xba3D9687Cf50fE253cd2e1cFeEdE1d6787344Ed5", "decimals": 18, "factor": 0.5, "root": "aave" },
    { key: "auni", "type": "atoken", "symbol": "AUNI", "name": "Aave UNI", "address": "0xB124541127A0A657f056D9Dd06188c4F1b0e5aab", "decimals": 18, "factor": 0.4, "root": "uni" },
    { key: "alink", "type": "atoken", "symbol": "ALINK", "name": "Aave LINK", "address": "0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84", "decimals": 18, "factor": 0.65, "root": "link" },
    { key: "amana", "type": "atoken", "symbol": "AMANA", "name": "Aave MANA", "address": "0x6FCE4A401B6B80ACe52baAefE4421Bd188e76F6f", "decimals": 18, "factor": 0.6, "root": "mana" },
    { key: "amkr", "type": "atoken", "symbol": "AMKR", "name": "Aave MKR", "address": "0x7deB5e830be29F91E298ba5FF1356BB7f8146998", "decimals": 18, "factor": 0.35, "root": "mkr" },
    { key: "aren", "type": "atoken", "symbol": "AREN", "name": "Aave REN", "address": "0x69948cc03f478b95283f7dbf1ce764d0fc7ec54c", "decimals": 18, "factor": 0.5, "root": "ren" },
    { key: "asnx", "type": "atoken", "symbol": "ASNX", "name": "Aave SNX", "address": "0x328C4c80BC7aCa0834Db37e6600A6c49E12Da4DE", "decimals": 18, "factor": 0, "root": "snx" },
    { key: "awbtc", "type": "atoken", "symbol": "AWBTC", "name": "Aave WBTC", "address": "0xFC4B8ED459e00e5400be803A9BB3954234FD50e3", "decimals": 8, "factor": 0.6, "root": "wbtc" },
    { key: "ayfi", "type": "atoken", "symbol": "AYFI", "name": "Aave YFI", "address": "0x12e51E77DAAA58aA0E9247db7510Ea4B46F9bEAd", "decimals": 18, "factor": 0.4, "root": "yfi" },
    { key: "azrx", "type": "atoken", "symbol": "AZRX", "name": "Aave ZRX", "address": "0x6Fb0855c404E09c47C3fBCA25f08d4E41f9F062f", "decimals": 18, "factor": 0.6, "root": "zrx" },
    { key: "arep", "type": "atoken", "symbol": "AREP", "name": "Aave REP", "address": "0x71010A9D003445aC60C4e6A7017c1E89A477B438", "decimals": 18, "factor": 0.35, "root": "rep" },
    { key: "aenj", "type": "atoken", "symbol": "AENJ", "name": "Aave ENJ", "address": "0x712db54daa836b53ef1ecbb9c6ba3b9efb073f40", "decimals": 18, "factor": 0.55, "root": "enj" }
  ]),
  
  polygon : createTokenUtils([
    { key: "aeth", "type": "atoken", "symbol": "AETH", "name": "Aave ETH", "address": "0x28424507fefb6f7f8E9D3860F56504E4e5f5f390", "decimals": 18, "factor": 0.8, "root": "eth" },
    { key: "adai", "type": "atoken", "symbol": "ADAI", "name": "Aave DAI", "address": "0x27F8D03b3a2196956ED754baDc28D73be8830A6e", "decimals": 18, "factor": 0.75, "root": "dai" },
    { key: "ausdc", "type": "atoken", "symbol": "AUSDC", "name": "Aave USDC", "address": "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F", "decimals": 6, "factor": 0.8, "root": "usdc" },
    { key: "ausdt", "type": "atoken", "symbol": "AUSDT", "name": "Aave USDT", "address": "0x60D55F02A771d515e077c9C2403a1ef324885CeC", "decimals": 6, "factor": 0, "root": "usdt" },
    { key: "awbtc", "type": "atoken", "symbol": "AWBTC", "name": "Aave WBTC", "address": "0x5c2ed810328349100A66B82b78a1791B101C9D61", "decimals": 8, "factor": 0.7, "root": "wbtc" },
    { key: "aaave", "type": "atoken", "symbol": "AAAVE", "name": "Aave AAVE", "address": "0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360", "decimals": 18, "factor": 0.5, "root": "aave" },
    { key: "awmatic", "type": "atoken", "symbol": "AWMATIC", "name": "Aave WMATIC", "address": "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4", "decimals": 18, "factor": 0.5, "root": "matic" },
  ])
}