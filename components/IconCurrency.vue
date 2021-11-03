<template>
  <!-- TODO: RENAME TO IconToken and currency parameter to token-key -->
  <div
    class="inline-flex items-center justify-center dark:opacity-90"
    :class="{
      'h-10 w-10': !noHeight
    }"
  >
    <SVG1inch v-if="currency === '1inch'" class="h-full" />
    <SVGaave v-else-if="currency === 'aave'" class="h-full" />
    <SVGbal v-else-if="currency === 'bal'" class="h-full" />
    <SVGbat v-else-if="currency === 'bat'" class="h-full" />
    <SVGbnb v-else-if="currency === 'bnb'" class="h-full" />
    <SVGbusd v-else-if="currency === 'busd'" class="h-full" />
    <SVGcbat v-else-if="currency === 'cbat'" class="h-full" />
    <SVGcbtc v-else-if="currency === 'cbtc'" class="h-full" />
    <SVGcdai v-else-if="currency === 'cdai'" class="h-full" />
    <SVGceth v-else-if="currency === 'ceth'" class="h-full" />
    <SVGcomp v-else-if="currency === 'comp'" class="h-full" />
    <SVGcrep v-else-if="currency === 'crep'" class="h-full" />
    <SVGcrv v-else-if="currency === 'crv'" class="h-full" />
    <SVGcsai v-else-if="currency === 'csai'" class="h-full" />
    <SVGcusdc v-else-if="currency === 'cusdc'" class="h-full" />
    <SVGcusdt v-else-if="currency === 'cusdt'" class="h-full" />
    <SVGczrx v-else-if="currency === 'czrx'" class="h-full" />
    <SVGdai v-else-if="currency === 'dai'" class="h-full" />
    <SVGdpi v-else-if="currency === 'dpi'" class="h-full" />
    <SVGdgx v-else-if="currency === 'dgx'" class="h-full" />
    <SVGenj v-else-if="currency === 'enj'" class="h-full" />
    <SVGeth v-else-if="currency === 'eth'" class="h-full" />
    <SVGeth2xfli v-else-if="currency === 'eth2xfli'" class="h-full" />
    <SVGbtc2xfli v-else-if="currency === 'btc2xfli'" class="h-full" />
    <SVGgusd v-else-if="currency === 'gusd'" class="h-full" />
    <SVGinst v-else-if="currency === 'inst'" class="h-full" />
    <SVGknc v-else-if="currency === 'knc'" class="h-full" />
    <SVGlend v-else-if="currency === 'lend'" class="h-full" />
    <SVGlink v-else-if="currency === 'link'" class="h-full" />
    <SVGlqty v-else-if="currency === 'lqty'" class="h-full" />
    <SVGlrc v-else-if="currency === 'lrc'" class="h-full" />
    <SVGlusd v-else-if="currency === 'lusd'" class="h-full" />
    <SVGmana v-else-if="currency === 'mana'" class="h-full" />
    <SVGmatic v-else-if="currency === 'matic'" class="h-full" />
    <SVGmkr v-else-if="currency === 'mkr'" class="h-full" />
    <SVGomg v-else-if="currency === 'omg'" class="h-full" />
    <SVGpax v-else-if="currency === 'pax'" class="h-full" />
    <SVGpoly v-else-if="currency === 'poly'" class="h-full" />
    <SVGrenbtc v-else-if="currency === 'renbtc'" class="h-full" />
    <SVGrai v-else-if="currency === 'rai'" class="h-full" />
    <SVGren v-else-if="currency === 'ren'" class="h-full" />
    <SVGrep v-else-if="currency === 'rep'" class="h-full" />
    <SVGsai v-else-if="currency === 'sai'" class="h-full" />
    <SVGsalt v-else-if="currency === 'salt'" class="h-full" />
    <SVGsbtc v-else-if="currency === 'sbtc'" class="h-full" />
    <SVGsnt v-else-if="currency === 'snt'" class="h-full" />
    <SVGsnx v-else-if="currency === 'snx'" class="h-full" />
    <SVGstkaave v-else-if="currency === 'stkaave'" class="h-full" />
    <SVGsusd v-else-if="currency === 'susd'" class="h-full" />
    <SVGsushi v-else-if="currency === 'sushi'" class="h-full" />
    <SVGtusd v-else-if="currency === 'tusd'" class="h-full" />
    <SVGuni v-else-if="currency === 'uni'" class="h-full" />
    <SVGuniaaveeth v-else-if="currency === 'uniaaveeth'" class="h-full" />
    <SVGunidaieth v-else-if="currency === 'unidaieth'" class="h-full" />
    <SVGuniusdceth v-else-if="currency === 'uniusdceth'" class="h-full" />
    <SVGuniwbtceth v-else-if="currency === 'uniwbtceth'" class="h-full" />
    <SVGuniusdcdai v-else-if="currency === 'unidaiusdc'" class="h-full" />
    <SVGuniusdteth v-else-if="currency === 'uniethusdt'" class="h-full" />
    <SVGunidaiusdt v-else-if="currency === 'unidaiusdt'" class="h-full" />
    <SVGunidaiwbtc v-else-if="currency === 'uniwbtcdai'" class="h-full" />
    <SVGunidaiyfi v-else-if="currency === 'uniyfidai'" class="h-full" />
    <SVGuniunieth v-else-if="currency === 'uniunieth'" class="h-full" />
    <SVGunilinketh v-else-if="currency === 'unilinketh'" class="h-full" />
    <SVGusdc v-else-if="currency === 'usdc'" class="h-full" />
    <SVGusdt v-else-if="currency === 'usdt'" class="h-full" />
    <SVGwbtc v-else-if="currency === 'wbtc'" class="h-full" />
    <SVGweth v-else-if="currency === 'weth'" class="h-full" />
    <SVGxsushi v-else-if="currency === 'xsushi'" class="h-full" />
    <SVGyfi v-else-if="currency === 'yfi'" class="h-full" />
    <SVGzil v-else-if="currency === 'zil'" class="h-full" />
    <SVGzrx v-else-if="currency === 'zrx'" class="h-full" />
    <SVGavax v-else-if="currency === 'avax'" class="h-full" />
    <SVGwavax v-else-if="currency === 'wavax'" class="h-full" />

    <div
      v-else
      class="flex items-center justify-center w-full h-full leading-none text-white uppercase truncate rounded-full  text-11 bg-gradient-to-br from-gray-300 to-grey-dark"
    >
      {{ currency }}
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import SVG1inch from '@/assets/icons/currencies/1inch.svg?inline'
import SVGaave from '@/assets/icons/currencies/aave.svg?inline'
import SVGbal from '@/assets/icons/currencies/bal.svg?inline'
import SVGbat from '@/assets/icons/currencies/bat.svg?inline'
import SVGbnb from '@/assets/icons/currencies/bnb.svg?inline'
import SVGbusd from '@/assets/icons/currencies/busd.svg?inline'
import SVGcbat from '@/assets/icons/currencies/cbat.svg?inline'
import SVGcbtc from '@/assets/icons/currencies/cbtc.svg?inline'
import SVGcdai from '@/assets/icons/currencies/cdai.svg?inline'
import SVGceth from '@/assets/icons/currencies/ceth.svg?inline'
import SVGcomp from '@/assets/icons/currencies/comp.svg?inline'
import SVGcrep from '@/assets/icons/currencies/crep.svg?inline'
import SVGcrv from '@/assets/icons/currencies/crv.svg?inline'
import SVGcsai from '@/assets/icons/currencies/csai.svg?inline'
import SVGcusdc from '@/assets/icons/currencies/cusdc.svg?inline'
import SVGcusdt from '@/assets/icons/currencies/cusdt.svg?inline'
import SVGczrx from '@/assets/icons/currencies/czrx.svg?inline'
import SVGdai from '@/assets/icons/currencies/dai.svg?inline'
import SVGdpi from '@/assets/icons/currencies/dpi.svg?inline'
import SVGdgx from '@/assets/icons/currencies/dgx.svg?inline'
import SVGenj from '@/assets/icons/currencies/enj.svg?inline'
import SVGeth from '@/assets/icons/currencies/eth.svg?inline'
import SVGeth2xfli from '@/assets/icons/currencies/eth2xfli.svg?inline'
import SVGbtc2xfli from '@/assets/icons/currencies/btc2xfli.svg?inline'
import SVGgusd from '@/assets/icons/currencies/gusd.svg?inline'
import SVGinst from '@/assets/icons/currencies/inst.svg?inline'
import SVGknc from '@/assets/icons/currencies/knc.svg?inline'
import SVGlend from '@/assets/icons/currencies/lend.svg?inline'
import SVGlink from '@/assets/icons/currencies/link.svg?inline'
import SVGlrc from '@/assets/icons/currencies/lrc.svg?inline'
import SVGmana from '@/assets/icons/currencies/mana.svg?inline'
import SVGmatic from '@/assets/icons/currencies/matic.svg?inline'
import SVGmkr from '@/assets/icons/currencies/mkr.svg?inline'
import SVGomg from '@/assets/icons/currencies/omg.svg?inline'
import SVGpax from '@/assets/icons/currencies/pax.svg?inline'
import SVGpoly from '@/assets/icons/currencies/poly.svg?inline'
import SVGrai from '@/assets/icons/currencies/rai.svg?inline'
import SVGrenbtc from '@/assets/icons/currencies/renbtc.svg?inline'
import SVGren from '@/assets/icons/currencies/ren.svg?inline'
import SVGrep from '@/assets/icons/currencies/rep.svg?inline'
import SVGsai from '@/assets/icons/currencies/sai.svg?inline'
import SVGsalt from '@/assets/icons/currencies/salt.svg?inline'
import SVGsbtc from '@/assets/icons/currencies/sbtc.svg?inline'
import SVGsnt from '@/assets/icons/currencies/snt.svg?inline'
import SVGsnx from '@/assets/icons/currencies/snx.svg?inline'
import SVGstkaave from '@/assets/icons/currencies/stkaave.svg?inline'
import SVGsusd from '@/assets/icons/currencies/susd.svg?inline'
import SVGsushi from '@/assets/icons/currencies/sushi.svg?inline'
import SVGtusd from '@/assets/icons/currencies/tusd.svg?inline'
import SVGuni from '@/assets/icons/currencies/uni.svg?inline'
import SVGuniaaveeth from '@/assets/icons/currencies/uniaaveeth.svg?inline'
import SVGunidaieth from '@/assets/icons/currencies/unidaieth.svg?inline'
import SVGuniusdcdai from '@/assets/icons/currencies/uniusdcdai.svg?inline'
import SVGuniusdteth from '@/assets/icons/currencies/uniusdteth.svg?inline'
import SVGunidaiusdt from '@/assets/icons/currencies/unidaiusdt.svg?inline'
import SVGunidaiwbtc from '@/assets/icons/currencies/unidaiwbtc.svg?inline'
import SVGunidaiyfi from '@/assets/icons/currencies/unidaiyfi.svg?inline'
import SVGuniunieth from '@/assets/icons/currencies/uniunieth.svg?inline'
import SVGunilinketh from '@/assets/icons/currencies/unilinketh.svg?inline'
import SVGuniusdceth from '@/assets/icons/currencies/uniusdceth.svg?inline'
import SVGuniwbtceth from '@/assets/icons/currencies/uniwbtceth.svg?inline'
import SVGusdc from '@/assets/icons/currencies/usdc.svg?inline'
import SVGusdt from '@/assets/icons/currencies/usdt.svg?inline'
import SVGwbtc from '@/assets/icons/currencies/wbtc.svg?inline'
import SVGweth from '@/assets/icons/currencies/weth.svg?inline'
import SVGxsushi from '@/assets/icons/currencies/xsushi.svg?inline'
import SVGyfi from '@/assets/icons/currencies/yfi.svg?inline'
import SVGzil from '@/assets/icons/currencies/zil.svg?inline'
import SVGzrx from '@/assets/icons/currencies/zrx.svg?inline'
import SVGCustom from '@/assets/icons/currencies/custom.svg?inline'
import SVGlqty from '@/assets/icons/currencies/lqty.svg?inline'
import SVGlusd from '@/assets/icons/currencies/lusd.svg?inline'
import SVGavax from '@/assets/icons/currencies/avax.svg?inline'
import SVGwavax from '@/assets/icons/currencies/wavax.svg?inline'
export default defineComponent({
  props: {
    currency: { type: String, default: '' },
    noHeight: { type: Boolean, default: false },
  },
  components: {
    SVG1inch,
    SVGaave,
    SVGbal,
    SVGbat,
    SVGbnb,
    SVGbusd,
    SVGcbat,
    SVGcbtc,
    SVGcdai,
    SVGceth,
    SVGcomp,
    SVGcrep,
    SVGcrv,
    SVGcsai,
    SVGcusdc,
    SVGcusdt,
    SVGczrx,
    SVGdai,
    SVGdpi,
    SVGdgx,
    SVGenj,
    SVGeth,
    SVGeth2xfli,
    SVGbtc2xfli,
    SVGinst,
    SVGgusd,
    SVGknc,
    SVGlend,
    SVGlink,
    SVGlrc,
    SVGmana,
    SVGmatic,
    SVGmkr,
    SVGomg,
    SVGpax,
    SVGpoly,
    SVGrai,
    SVGrenbtc,
    SVGren,
    SVGrep,
    SVGsai,
    SVGsalt,
    SVGsbtc,
    SVGsnt,
    SVGsnx,
    SVGstkaave,
    SVGsusd,
    SVGsushi,
    SVGtusd,
    SVGuni,
    SVGuniaaveeth,
    SVGunidaieth,
    SVGuniusdceth,
    SVGuniwbtceth,
    SVGuniusdcdai,
    SVGuniusdteth,
    SVGunidaiusdt,
    SVGunidaiwbtc,
    SVGunidaiyfi,
    SVGuniunieth,
    SVGunilinketh,
    SVGusdc,
    SVGusdt,
    SVGwbtc,
    SVGweth,
    SVGxsushi,
    SVGyfi,
    SVGzil,
    SVGzrx,
    SVGlqty,
    SVGlusd,
    SVGCustom,
    SVGavax,
    SVGwavax,
  },
})
</script>
