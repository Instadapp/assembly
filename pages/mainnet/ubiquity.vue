<template>
  <div>
    <div>
      <nuxt-link
        to="/"
        class="text-[#C0C5D7] text-lg font-semibold flex items-center"
      >
        <BackIcon class="w-4 h-4 mr-3" />
        Apps
      </nuxt-link>
    </div>
    <div class="mt-10 flex items-center justify-between">
      <div class="flex items-center">
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
            w-16
            h-16
            rounded-full
            flex
            items-center
            justify-center
            border border-[#CCDCF3]
          "
        >
          <div
            class="
              w-12
              h-12
              rounded-full
              flex
              items-center
              justify-center
              bg-[#1874FF]
            "
          >
            <UbiquityIcon class="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 class="ml-4 text-primary-black text-2xl font-semibold">
          Ubiquity DAO
        </h1>
      </div>
    </div>

    <div class="mt-10">
      <h2 class="text-primary-gray text-lg font-semibold">Overview</h2>

      <div
        class="
          px-0.5
          mt-6
          grid
          w-full
          grid-cols-1
          gap-1
          md:grid-cols-3
          sm:grid-cols-2
          xl:gap-[17px]
        "
      >
        <div class="shadow rounded-md place-content-between flex">
          <div
            class="
              flex flex-col
              place-content-between
              py-[24px]
              pl-[24px]
              pr-[24px]
              w-[305px]
            "
          >
            <h3
              class="
                text-[19px] text-primary-black
                font-semibold
                leading-[22px]
              "
            >
              Stabilize Liquity Protocol
            </h3>
            <p
              class="
                mt-1
                text-primary
                font-medium
                flex
                justify-end
                text-[14px] text-[#1874FF]
              "
            >
              <a
                target="_blank"
                href="https://docs.liquity.org/faq/stability-pool-and-liquidations"
                >- Learn More -</a
              >
            </p>
          </div>
          <div
            class="
              flex
              items-center
              bg-[#1874FF]
              shadow
              rounded-r-md
              w-[51px]
              justify-center
            "
          >
            <SVGStableize class="text-white w-[27px] h-[27px]" />
          </div>
        </div>

        <div class="shadow rounded-md place-content-between flex">
          <div
            class="
              flex flex-col
              place-content-between
              py-[24px]
              pl-[24px]
              pr-[20px]
              w-[305px]
            "
          >
            <h3
              class="
                text-[19px] text-primary-black
                font-semibold
                leading-[22px]
              "
            >
              Get Passive Yield on Your LUSD
            </h3>
            <p
              class="
                mt-1
                text-primary
                font-medium
                flex
                justify-end
                text-[14px] text-[#1874FF]
              "
            >
              <a
                target="_blank"
                href="https://medium.com/b-protocol/b-protocol-liquity-integration-is-live-1342605e7cfb"
                >- Learn More -</a
              >
            </p>
          </div>
          <div
            class="
              flex
              items-center
              bg-[#1874FF]
              shadow
              rounded-r-md
              w-[51px]
              flex
              justify-center
            "
          >
            <SVGEarn class="text-white w-[27px] h-[27px]" />
          </div>
        </div>

        <div class="shadow rounded-md place-content-between flex">
          <div
            class="
              flex flex-col
              place-content-between
              py-[24px]
              pl-[24px]
              pr-[20px]
              w-[305px]
            "
          >
            <h3
              class="
                text-[19px] text-primary-black
                font-semibold
                leading-[22px]
              "
            >
              Improved Liquidity Mining Program
            </h3>
            <p
              class="
                mt-1
                text-primary
                font-medium
                flex
                justify-end
                text-[14px] text-[#1874FF]
              "
            >
              <a
                target="_blank"
                href="https://docs.bprotocol.org/info/liquidity-mining"
                >- Learn More -</a
              >
            </p>
          </div>
          <div
            class="
              flex
              items-center
              bg-[#1874FF]
              shadow
              rounded-r-md
              w-[51px]
              flex
              justify-center
            "
          >
            <SVGUse class="text-white w-[27px]" />
          </div>
        </div>
      </div>

      <div
        class="
          px-0.5
          mt-6
          grid
          w-full
          grid-cols-1
          gap-1
          md:grid-cols-2
          xl:gap-[17px]
        "
      >
        <div class="shadow rounded-lg place-content-between flex items-center">
          <div class="flex place-content-between">
            <div
              class="
                flex
                items-center
                rounded-r-lg
                h-[108px]
                w-[100px]
                flex
                justify-center
              "
            >
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
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  border border-[#CCDCF3]
                "
              >
                <div
                  class="
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    bg-[#00E5DC]
                  "
                >
                  <UbiquityIcon2 class="w-[20px] text-bold" />
                </div>
              </div>
            </div>
            <div class="flex flex-col justify-center">
              <div class="text-lg font-semibold">$325,904</div>
              <div class="text-[#C0C5D7] text-xs">UAD Twao Price</div>
            </div>
          </div>
          <div
            class="
              flex
              items-center
              rounded-lg
              h-[108px]
              w-[51px]
              flex
              justify-center
            "
          >
            <CoinStackIcon class="w-[27px]" />
          </div>
        </div>

        <div class="shadow rounded-md place-content-between flex items-center">
          <div class="flex place-content-between">
            <div
              class="
                flex
                items-center
                rounded-r-lg
                h-[108px]
                w-[100px]
                flex
                justify-center
              "
            >
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
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  border border-[#CCDCF3]
                "
              >
                <div
                  class="
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    bg-[#00E5DC]
                  "
                >
                  <UbiquityIcon1 class="w-[20px] text-bold" />
                </div>
              </div>
            </div>
            <div class="flex flex-col justify-center">
              <div class="text-lg font-semibold">4.320</div>
              <div class="text-[#C0C5D7] text-xs">UBQ Rewards</div>
            </div>
          </div>
          <div
            class="
              flex
              items-center
              rounded-lg
              h-[108px]
              w-[190px]
              flex
              justify-center
            "
          >
            <button
              class="
                mr-4
                h-10
                w-full
                text-xs
                font-semibold
                bg-[#1874FF]
                shadow
                text-white
                rounded-[4px]
                hover:bg-primary-blue-hover
              "
            >
              CLAIM ALL
            </button>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <div class="text-[#C0C5D7] text-sm font-semibold flex items-center">
          <GorillaIcon class="w-4 h-4 mr-3" />
          APE INTO UAD POOLS
        </div>
        <CardUbiquity />
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import BackIcon from "~/assets/icons/back.svg?inline";
import UbiquityIcon from "~/assets/icons/ubiquity.svg?inline";
import UbiquityIcon1 from "~/assets/img/icons/ubiquity/ubiquity1.svg?inline";
import UbiquityIcon2 from "~/assets/img/icons/ubiquity/ubiquity2.svg?inline";
import CoinStackIcon from "~/assets/img/icons/ubiquity/coin_stack.svg?inline";
import SVGBalance from "@/assets/img/icons/balance.svg?inline";
import SVGStableize from "@/assets/img/icons/ubiquity/stableize.svg?inline";
import SVGUse from "@/assets/img/icons/ubiquity/use.svg?inline";
import SVGEarn from "@/assets/img/icons/ubiquity/earn.svg?inline";
import CardUbiquity from "~/components/protocols/ubiquity/CardUbiquity.vue";
import GorillaIcon from "~/assets/img/icons/ubiquity/gorilla.svg?inline";

export default defineComponent({
  components: {
    BackIcon,
    UbiquityIcon,
    SVGBalance,
    SVGStableize,
    SVGUse,
    SVGEarn,
    UbiquityIcon1,
    UbiquityIcon2,
    CoinStackIcon,
    CardUbiquity,
    GorillaIcon,
  },
  setup() {},
});
</script>
