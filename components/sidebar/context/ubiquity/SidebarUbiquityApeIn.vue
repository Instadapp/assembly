<template>
    <SidebarContextRootContainer >
        <div class="h-[160px]">
           <h3 class=" text-center text-lg font-bold"> APE INTO LP</h3>
           <h4 class=" text-center text-[#1874FF] text-sm font-semibold">Created by the Ubiquity Team</h4>
           <ul class="list-disc pl-[68px] mt-[32px] text-[#A5ADC6] font-semibold text-md">
               <li>Deposits Stablecoins into uAD3CRV-LP</li>
               <li class="mt-1">Stakes and lockups LP tokens for UBQ Rewards</li>
           </ul>
        </div>

        <div class="bg-[#1874FF] bg-opacity-[0.04] h-full">
            <div>
                <div class="mt-10 p-6">
                    <h3 class="text-primary-gray text-xs font-semibold mb-2.5">
                        TOKEN TO ZAP
                    </h3>

                    <input-numeric
                    placeholder="0 DAI">
                    
                    </input-numeric>
                </div>
                 <div class="mt-0 px-6">
                    <h3 class="text-primary-gray text-xs font-semibold mb-2.5">
                       LOCKUP TIME IN WEEKS
                    </h3>

                    <input-numeric
                    placeholder="1 - 208 weeks">
                    
                    </input-numeric>
                </div>

            </div>
            <div class="p-6 " >
                <div class="text-[#9FB0C9] text-xs mb-2 font-semibold">ESTIMATED LP VALUE</div>

            <div  class="flex">
                
                  <div
                            style="background: radial-gradient(42.15% 42.15% at 48.94% 48.94%, #D6DAE0 75.67%, #F0F3F9 100%), #C4C4C4;"
                            class="w-[56px] h-[56px] rounded-full flex items-center justify-center border border-[#CCDCF3]"
                            >
                            <div
                                class="w-[43px] h-[43px] rounded-full flex items-center justify-center bg-[#FFB45E]"
                            >
                    
                          
                                <RainbowIcon class="w-[23px] h-[23px] text-bold"/>
                          </div>
                </div>
                  <div class="flex flex-col justify-center ml-2">
                        <div class="text-lg font-semibold">$3,612.017</div>
                        <div class="flex">
                            <div class="text-[#C0C5D7] text-xs font-semibold">4.2 UAD3CRV-LP</div>
                        <DollarIcon class="ml-1" />
                        </div>
            </div>
            </div>
           
        </div>
        <div class="p-6 mt-[160px]">
            <div class="bg-[#F56565] bg-opacity-[0.1] h-[62px] mb-3 rounded-md ">
                <div class="flex place-content-between items-center p-4">
                    <div class="list-disc text-[#F56565] text-xs font-semibold ">
                        <li>Please provide a valid amount</li>
                        <li>Position will liquidate</li>
                    </div>
                    <div>
                        <div
                                class="w-[22px] h-[22px] rounded-full flex items-center justify-center bg-[#F56565]"
                            >
                    
                          
                                <UnionIcon class="w-[8px] h-[8px] text-bold"/>
                          </div>

                    </div>
                </div>
                <div></div>
            </div>

            <div><button class="mr-4  h-[40px]  w-full border-2  text-xs font-semibold bg-[#9FB0C9] active:bg-[#1874FF]  text-white rounded-[4px] ">
        APE IN
      </button></div>
            <div class="text-[#9FB0C9] text-xs font-semibold mt-2">Instadapp does not charge a fee for this operation</div>
        </div>

        </div>

      </SidebarContextRootContainer>   
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import InputNumeric from '~/components/common/input/InputNumeric.vue'
import RainbowIcon from "~/assets/img/icons/ubiquity/rainbow.svg?inline";
import DollarIcon from "~/assets/img/icons/ubiquity/dollar.svg?inline";
import UnionIcon from "~/assets/img/icons/ubiquity/Union.svg?inline";

export default defineComponent({
    components:{InputNumeric,RainbowIcon,DollarIcon,UnionIcon},
    setup() {
        
    },
})
</script>
