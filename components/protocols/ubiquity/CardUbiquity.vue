<template>
  <div class="shadow rounded-md mt-2 p-[30px]">
    <div class="flex place-content-between">
      <div class="flex">
        <div class="mr-4">
          <div
            style="
              background: radial-gradient(
                  42.15% 42.15% at 48.94% 48.94%,
                  #d6dae0 75.67%,
                  #f0f3f9 100%
                ),
                #c4c4c4;
            "
            class="
              w-[72px]
              h-[72px]
              rounded-full
              flex
              items-center
              justify-center
              border border-[#CCDCF3]
            "
          >
            <div
              class="
                w-[56px]
                h-[56px]
                rounded-full
                flex
                items-center
                justify-center
                bg-[#FFB45E]
              "
            >
              <RainbowIcon class="w-[30.5px] h-[30.5px] text-bold" />
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-center">
          <div class="text-lg font-semibold">$3,612.017</div>
          <div class="flex">
            <div class="text-[#C0C5D7] text-xs font-semibold">
              4.2 UAD3CRV-LP
            </div>
            <DollarIcon class="ml-1" />
          </div>
        </div>
      </div>
      <div
        class="
          mr-4
          h-[32px]
          w-[140px]
          mr-[-30px]
          text-xs
          font-semibold
          bg-[#1874FF]
          shadow
          text-white
          rounded-l-[4px]
          justify-center
          items-center
          hidden
          sm:flex
        "
      >
        Staked
      </div>
    </div>

    <div
      class="
        place-content-between
        mt-[24px]
        grid
        w-full
        grid-cols-1
        gap-1
        md:grid-cols-4
        sm:grid-cols-2
        xxl:gap-6
        min-w-max-content
        px-1
      "
    >
      <div class="flex justify-center">
        <button
          class="
            mr-4
            h-[40px]
            md:h-[32px]
            w-full
            border-2 border-[#1874FF]
            text-xs
            font-semibold
            bg-white
            text-[#1874FF]
            rounded-[4px]
          "
          @click="$router.push({ hash: 'apein' })"
        >
          APE IN
        </button>
      </div>
      <div class="flex justify-center">
        <button
          class="
            mr-4
            h-[40px]
            md:h-[32px]
            w-full
            border-2 border-[#1874FF]
            text-xs
            font-semibold
            bg-white
            text-[#1874FF]
            rounded-[4px]
          "
          @click="$router.push({ hash: 'withdraw' })"
        >
          WITHDRAW
        </button>
      </div>
      <div class="flex justify-center">
        <button
          class="
            mr-4
            h-[40px]
            md:h-[32px]
            w-full
            border-2 border-[#1874FF]
            text-xs
            font-semibold
            bg-white
            text-[#1874FF]
            rounded-[4px]
          "
        >
          STAKE
        </button>
      </div>
      <div class="flex justify-center">
        <button
          class="
            mr-4
            h-[40px]
            md:h-[32px]
            w-full
            border-2 border-[#1874FF]
            text-xs
            font-semibold
            bg-white
            text-[#1874FF]
            rounded-[4px]
          "
        >
          UNSTAKE
        </button>
      </div>
    </div>
    <div
      class="
        border-t-2 border-[#9FB0C9]
        text-[#9FB0C9] text-xl
        font-semibold
        flex
        items-center
        justify-center
        mt-[25px]
        pt-[36px]
      "
    >
      Stake and lookup tokens for UBQ Rewards
    </div>
    
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import RainbowIcon from "~/assets/img/icons/ubiquity/rainbow.svg?inline";
import DollarIcon from "~/assets/img/icons/ubiquity/dollar.svg?inline";

export default defineComponent({
  components: {
    RainbowIcon,
    DollarIcon,
  },
  setup() {},
});
</script>
