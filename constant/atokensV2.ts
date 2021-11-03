import { createTokenUtils } from "../utils/create-token-utils";

// prettier-ignore
export default {
  mainnet : createTokenUtils([
    { key: "aeth", "type": "atoken", "symbol": "AETH", "name": "Aave ETH", "address": "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e", "decimals": 18, "factor": 0.8, "root": "eth" },
    { key: "adai", "type": "atoken", "symbol": "ADAI", "name": "Aave DAI", "address": "0x028171bCA77440897B824Ca71D1c56caC55b68A3", "decimals": 18, "factor": 0.75, "root": "dai" },
    { key: "ausdc", "type": "atoken", "symbol": "AUSDC", "name": "Aave USDC", "address": "0xBcca60bB61934080951369a648Fb03DF4F96263C", "decimals": 6, "factor": 0.8, "root": "usdc" },
    { key: "ausdt", "type": "atoken", "symbol": "AUSDT", "name": "Aave USDT", "address": "0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811", "decimals": 6, "factor": 0, "root": "usdt" },
    { key: "asusd", "type": "atoken", "symbol": "ASUSD", "name": "Aave SUSD", "address": "0x6C5024Cd4F8A59110119C56f8933403A539555EB", "decimals": 18, "factor": 0, "root": "susd" },
    { key: "atusd", "type": "atoken", "symbol": "ATUSD", "name": "Aave TUSD", "address": "0x101cc05f4A51C0319f570d5E146a8C625198e636", "decimals": 18, "factor": 0.75, "root": "tusd" },
    { key: "arai", "type": "atoken", "symbol": "ARAI", "name": "Aave RAI", "address": "0xe0065ea37791d336D78fcA0e870D04f700395B8d", "decimals": 18, "factor": 0, "root": "rai" },
    { key: "abusd", "type": "atoken", "symbol": "ABUSD", "name": "Aave BUSD", "address": "0xA361718326c15715591c299427c62086F69923D9", "decimals": 18, "factor": 0, "root": "busd" },
    { key: "abat", "type": "atoken", "symbol": "ABAT", "name": "Aave BAT", "address": "0x05Ec93c0365baAeAbF7AefFb0972ea7ECdD39CF1", "decimals": 18, "factor": 0.7, "root": "bat" },
    { key: "aknc", "type": "atoken", "symbol": "AKNC", "name": "Aave KNC", "address": "0x39C6b3e42d6A679d7D776778Fe880BC9487C2EDA", "decimals": 18, "factor": 0.6, "root": "knc" },
    { key: "alink", "type": "atoken", "symbol": "ALINK", "name": "Aave LINK", "address": "0xa06bC25B5805d5F8d82847D191Cb4Af5A3e873E0", "decimals": 18, "factor": 0.7, "root": "link" },
    { key: "amana", "type": "atoken", "symbol": "AMANA", "name": "Aave MANA", "address": "0xa685a61171bb30d4072B338c80Cb7b2c865c873E", "decimals": 18, "factor": 0.6, "root": "mana" },
    { key: "amkr", "type": "atoken", "symbol": "AMKR", "name": "Aave MKR", "address": "0xc713e5E149D5D0715DcD1c156a020976e7E56B88", "decimals": 18, "factor": 0.6, "root": "mkr" },
    { key: "aren", "type": "atoken", "symbol": "AREN", "name": "Aave REN", "address": "0xCC12AbE4ff81c9378D670De1b57F8e0Dd228D77a", "decimals": 18, "factor": 0.55, "root": "ren" },
    { key: "asnx", "type": "atoken", "symbol": "ASNX", "name": "Aave SNX", "address": "0x35f6B052C598d933D69A4EEC4D04c73A191fE6c2", "decimals": 18, "factor": 0.15, "root": "snx" },
    { key: "awbtc", "type": "atoken", "symbol": "AWBTC", "name": "Aave WBTC", "address": "0x9ff58f4fFB29fA2266Ab25e75e2A8b3503311656", "decimals": 8, "factor": 0.7, "root": "wbtc" },
    { key: "ayfi", "type": "atoken", "symbol": "AYFI", "name": "Aave YFI", "address": "0x5165d24277cD063F5ac44Efd447B27025e888f37", "decimals": 18, "factor": 0.4, "root": "yfi" },
    { key: "azrx", "type": "atoken", "symbol": "AZRX", "name": "Aave ZRX", "address": "0xDf7FF54aAcAcbFf42dfe29DD6144A69b629f8C9e", "decimals": 18, "factor": 0.6, "root": "zrx" },
    { key: "aenj", "type": "atoken", "symbol": "AENJ", "name": "Aave ENJ", "address": "0xaC6Df26a590F08dcC95D5a4705ae8abbc88509Ef", "decimals": 18, "factor": 0.55, "root": "enj" },
    { key: "auni", "type": "atoken", "symbol": "AUNI", "name": "Aave UNI", "address": "0xB9D7CB55f463405CDfBe4E90a6D2Df01C2B92BF1", "decimals": 18, "factor": 0.6, "root": "uni" },
    { key: "aaave", "type": "atoken", "symbol": "AAAVE", "name": "Aave AAVE", "address": "0xFFC97d72E13E01096502Cb8Eb52dEe56f74DAD7B", "decimals": 18, "factor": 0.5, "root": "aave" },
    { key: "agusd", "type": "atoken", "symbol": "AGUSD", "name": "Aave GUSD", "address": "0xD37EE7e4f452C6638c96536e68090De8cBcdb583", "decimals": 2, "factor": 0, "root": "gusd" },
    { key: "abal", "type": "atoken", "symbol": "ABAL", "name": "Aave BAL", "address": "0x272F97b7a56a387aE942350bBC7Df5700f8a4576", "decimals": 18, "factor": 0.55, "root": "bal" },
    { key: "acrv", "type": "atoken", "symbol": "ACRV", "name": "Aave CRV", "address": "0x8dAE6Cb04688C62d939ed9B68d32Bc62e49970b1", "decimals": 18, "factor": 0.40, "root": "crv" },
    { key: "axsushi", "type": "atoken", "symbol": "AXSUSHI", "name": "Aave xSUSHI", "address": "0xF256CC7847E919FAc9B808cC216cAc87CCF2f47a", "decimals": 18, "factor": 0.45, "root": "xsushi" }
  ]),

  polygon : createTokenUtils([
    { key: "aeth", "type": "atoken", "symbol": "AETH", "name": "Aave ETH", "address": "0x28424507fefb6f7f8E9D3860F56504E4e5f5f390", "decimals": 18, "factor": 0.8, "root": "eth" },
    { key: "adai", "type": "atoken", "symbol": "ADAI", "name": "Aave DAI", "address": "0x27F8D03b3a2196956ED754baDc28D73be8830A6e", "decimals": 18, "factor": 0.75, "root": "dai" },
    { key: "ausdc", "type": "atoken", "symbol": "AUSDC", "name": "Aave USDC", "address": "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F", "decimals": 6, "factor": 0.8, "root": "usdc" },
    { key: "ausdt", "type": "atoken", "symbol": "AUSDT", "name": "Aave USDT", "address": "0x60D55F02A771d515e077c9C2403a1ef324885CeC", "decimals": 6, "factor": 0, "root": "usdt" },
    { key: "awbtc", "type": "atoken", "symbol": "AWBTC", "name": "Aave WBTC", "address": "0x5c2ed810328349100A66B82b78a1791B101C9D61", "decimals": 8, "factor": 0.7, "root": "wbtc" },
    { key: "aaave", "type": "atoken", "symbol": "AAAVE", "name": "Aave AAVE", "address": "0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360", "decimals": 18, "factor": 0.5, "root": "aave" },
    { key: "awmatic", "type": "atoken", "symbol": "AWMATIC", "name": "Aave WMATIC", "address": "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4", "decimals": 8, "factor": 0.7, "root": "matic" },
  ]),

  avalanche: createTokenUtils([
    { key: "avweth", "type": "atoken", "symbol": "avWETH", "name": "Aave ETH", "address": "0x53f7c5869a859F0AeC3D334ee8B4Cf01E3492f21", "decimals": 18, "factor": 0.8, "root": "eth" },
    { key: "avdai", "type": "atoken", "symbol": "avDAI", "name": "Aave DAI", "address": "0x47AFa96Cdc9fAb46904A55a6ad4bf6660B53c38a", "decimals": 18, "factor": 0, "root": "dai" },
    { key: "avusdc", "type": "atoken", "symbol": "avUSDC", "name": "Aave USDC", "address": "0x46A51127C3ce23fb7AB1DE06226147F446e4a857", "decimals": 6, "factor": 0.8, "root": "usdc" },
    { key: "avusdt", "type": "atoken", "symbol": "avUSDT", "name": "Aave USDT", "address": "0x532E6537FEA298397212F09A61e03311686f548e", "decimals": 6, "factor": 0, "root": "usdt" },
    { key: "avwbtc", "type": "atoken", "symbol": "avWBTC", "name": "Aave WBTC", "address": "0x686bEF2417b6Dc32C50a3cBfbCC3bb60E1e9a15D", "decimals": 8, "factor": 0.6, "root": "wbtc" },
    { key: "avaave", "type": "atoken", "symbol": "avAAVE", "name": "Aave AAVE", "address": "0xD45B7c061016102f9FA220502908f2c0f1add1D7", "decimals": 18, "factor": 0, "root": "aave" },
    { key: "avwavax", "type": "atoken", "symbol": "avWAVAX", "name": "Aave WAVAX", "address": "0xDFE521292EcE2A4f44242efBcD66Bc594CA9714B", "decimals": 8, "factor": 0, "root": "avax" },
  ])
}
