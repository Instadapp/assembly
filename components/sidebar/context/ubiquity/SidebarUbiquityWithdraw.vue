<template>
  <SidebarContextRootContainer>
    <div class="h-[160px]">
      <h3 class="text-center text-lg font-bold">Withdraw Out of LP</h3>
      <h4 class="text-center text-[#1874FF] text-sm font-semibold">
        Created by the Ubiquity Team
      </h4>
      
      <ul
        class="
          list-disc
          pl-[68px]
          mt-[32px]
          text-[#A5ADC6]
          font-semibold
          text-md
        "
      >
        <li>Withdraw Loquidity from uAD3CRV pool and returns stablecoins</li>
      </ul>
    </div>

    <div class="bg-[#1874FF] bg-opacity-[0.04] h-full">
      <div>
        <div class="mt-10 p-6">
          <h3 class="text-primary-gray text-xs font-semibold mb-2.5">
            WITHDRAWAL AMOUNT
          </h3>

          <input-numeric placeholder="45,425 DAI"> </input-numeric>
        </div>
        <div class="mt-0 px-6 flex">
          <select
            class="
              block
              appearance-none
              w-[125px]
              bg-white
              border border-gray-400
              hover:border-gray-500
              px-4
              py-2
              pr-8
              rounded
              shadow
              leading-tight
              focus:outline-none focus:shadow-outline
            "
          >
            <option>USDC</option>
            <option>USDT</option>
            <option>INST</option>
          </select>

          <h3 class="text-primary-gray text-xs font-semibold ml-6">
            SELECT OUTPUT CURRENCY
          </h3>
        </div>
      </div>
      <div class="p-6">
        <div class="text-[#9FB0C9] text-xs mb-2 font-semibold">
          ESTIMATED LP VALUE
        </div>

        <div class="flex">
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
              w-[56px]
              h-[56px]
              rounded-full
              flex
              items-center
              justify-center
              border border-[#CCDCF3]
            "
          >
            <div
              class="
                w-[43px]
                h-[43px]
                rounded-full
                flex
                items-center
                justify-center
                bg-[#FFB45E]
              "
            >
              <RainbowIcon class="w-[23px] h-[23px] text-bold" />
            </div>
          </div>
          <div class="flex flex-col justify-center ml-2">
            <div class="text-lg font-semibold">$3,612.017</div>
            <div class="flex">
              <div class="text-[#C0C5D7] text-xs font-semibold">
                4.2 UAD3CRV-LP
              </div>
              <DollarIcon class="ml-1" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="
          flex
          mx-6
          p-4
          border-dashed border-2 border-[#9FB0C9]
          rounded-md
          place-content-between
        "
      >
        <div class="flex">
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
              w-[40px]
              h-[40px]
              rounded-full
              flex
              items-center
              justify-center
              border border-[#CCDCF3]
            "
          >
            <div
              class="
                w-[32px]
                h-[32px]
                rounded-full
                flex
                items-center
                justify-center
                bg-[#FFB45E]
              "
            >
              <RainbowIcon class="w-[17px] h-[17px] text-bold" />
            </div>
          </div>
          <div class="flex flex-col justify-center ml-2">
            <div class="text-[14px] font-semibold">$0.017</div>
            <div class="flex">
              <div class="text-[#C0C5D7] text-[10px] font-semibold">
                4.2 UAD3CRV-LP
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <UnionIcon1 class="w-[11px] h-[11px] text-[#C4C4C4] text-bold" />
        </div>

        <div class="flex">
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
              w-[40px]
              h-[40px]
              rounded-full
              flex
              items-center
              justify-center
              border border-[#CCDCF3]
            "
          >
            <div
              class="
                w-[32px]
                h-[32px]
                rounded-full
                flex
                items-center
                justify-center
                bg-[#2775C9]
              "
            >
              <UsdcIcon class="w-[17px] h-[17px] text-bold" />
            </div>
          </div>
          <div class="flex flex-col justify-center ml-2">
            <div class="text-[14px] font-semibold">$400</div>
            <div class="flex">
              <div class="text-[#C0C5D7] text-[10px] font-semibold">
                400 USDC
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 mt-[180px]">
        <div>
          <button
            class="
              mr-4
              h-[40px]
              w-full
              border-2
              text-xs
              font-semibold
              bg-[#1874FF]
              text-white
              rounded-[4px]
            "
          >
            Withdraw
          </button>
        </div>
        <div class="text-[#9FB0C9] text-xs font-semibold mt-2">
          Instadapp does not charge a fee for this operation
        </div>
      </div>
    </div>
  </SidebarContextRootContainer>
</template>
<script>
import { defineComponent } from "@vue/composition-api";
import InputNumeric from "~/components/common/input/InputNumeric.vue";
import RainbowIcon from "~/assets/img/icons/ubiquity/rainbow.svg?inline";
import DollarIcon from "~/assets/img/icons/ubiquity/dollar.svg?inline";
import UnionIcon from "~/assets/img/icons/ubiquity/Union.svg?inline";
import UnionIcon1 from "~/assets/img/icons/ubiquity/Union1.svg?inline";
import UsdcIcon from "~/assets/img/icons/ubiquity/usdc.svg?inline";

export default defineComponent({
  components: {
    InputNumeric,
    RainbowIcon,
    DollarIcon,
    UnionIcon,
    UnionIcon1,
    UsdcIcon,
  },
  setup() {},
});
</script>
