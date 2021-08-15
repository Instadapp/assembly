<template>
  <div>
    <h3 class="text-primary-gray text-lg font-semibold mb-4">Swap</h3>
    <div class="relative">
      <div
        class="shadow-sm relative border border-grey-dark/[0.15] rounded-lg p-4 mb-2"
      >
        <div class="flex justify-between items-center mb-3">
          <div class="flex-1" @click="() => token0Input.focus()">
            <input
              type="text"
              v-model.trim="token0.amount"
              ref="token0Input"
              inputmode="decimal"
              autocomplete="off"
              autocorrect="off"
              pattern="^[0-9]*[.,]?[0-9]*$"
              placeholder="0.0"
              minlength="1"
              maxlength="79"
              spellcheck="false"
              :size="
                token0.amount.length > 0
                  ? Math.min(token0.amount.length, 20)
                  : 2
              "
              class="border-0 focus:outline-none focus:ring-0 text-lg font-semibold px-0 max-w-full"
            />
            <span class="text-primary-gray text-lg font-semibold">{{
              token0.symbol
            }}</span>
          </div>

          <Dropdown>
            <template #trigger="{ toggle }">
              <button
                class="flex items-center hover:bg-primary-blue-dark/10 p-1.5 rounded"
                @click="toggle"
              >
                <svg
                  width="9"
                  height="6"
                  viewBox="0 0 9 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.5 4.5L3.89896 5.10104C4.2309 5.43299 4.76909 5.43299 5.10104 5.10104L4.5 4.5ZM8.60104 1.60104C8.93299 1.2691 8.93299 0.730905 8.60104 0.398959C8.2691 0.0670136 7.7309 0.0670135 7.39896 0.398959L8.60104 1.60104ZM1.60104 0.398959C1.26909 0.0670133 0.730905 0.0670132 0.398959 0.398959C0.0670138 0.730905 0.0670137 1.26909 0.398959 1.60104L1.60104 0.398959ZM5.10104 5.10104L8.60104 1.60104L7.39896 0.398959L3.89896 3.89896L5.10104 5.10104ZM5.10104 3.89896L1.60104 0.398959L0.398959 1.60104L3.89896 5.10104L5.10104 3.89896Z"
                    fill="#3F75FF"
                  />
                </svg>

                <icon-currency
                  :currency="token0.symbol.toLowerCase()"
                  class="ml-2.5 w-9 h-9"
                />
              </button>
            </template>
            <template #menu="{ close }">
              <DropdownMenu
                class="z-10 bg-white w-32 rounded border border-[#CFDCFF] drop-shadow-sm pt-0 pb-0"
                align="right"
              >
                <List
                  :items="allTokens.filter(t => t.symbol != token1.symbol)"
                  class="p-1.5"
                  items-wrapper-classes="space-y-2 overflow-y-scroll max-h-[200px]"
                >
                  <template v-slot:default="{ item }">
                    <div
                      @click="
                        selectToken0(item);
                        close();
                      "
                      class="cursor-pointer rounded-sm flex items-center p-1.5 bg-[#F6F7F9] border border-transparent hover:border-primary-blue-dark"
                    >
                      <icon-currency
                        :currency="item.symbol.toLowerCase()"
                        class="mr-1.5 w-6 h-6"
                      />

                      <span
                        class="text-primary-blue-dark text-sm font-semibold"
                      >
                        {{ item.symbol }}
                      </span>
                    </div>
                  </template>
                </List>
              </DropdownMenu>
            </template>
          </Dropdown>
        </div>

        <div
          class="flex justify-between items-center text-primary-gray font-medium"
        >
          <div>~ $ 9,321.69</div>

          <div>Balance: 85 {{ token0.symbol }}</div>
        </div>

        <div
          class="absolute -bottom-1 border border-grey-dark/[0.15] border-b-0 inset-x-0 mx-auto rounded-t-full bg-white w-10 h-5 shadow-sm"
        ></div>
      </div>

      <div
        class="shadow-sm relative border border-grey-dark/[0.15] rounded-lg p-4"
      >
        <div class="flex justify-between items-center mb-3">
          <div>
            <input
              type="text"
              v-model.trim="token1.amount"
              readonly
              inputmode="decimal"
              autocomplete="off"
              autocorrect="off"
              pattern="^[0-9]*[.,]?[0-9]*$"
              placeholder="0.0"
              minlength="1"
              maxlength="79"
              spellcheck="false"
              :size="
                token1.amount.length > 0
                  ? Math.min(token1.amount.length, 20)
                  : 2
              "
              class="border-0 focus:outline-none focus:ring-0 text-lg font-semibold px-0 max-w-full"
            />
            <span class="text-primary-gray text-lg font-semibold">{{
              token1.symbol
            }}</span>
          </div>

          <Dropdown>
            <template #trigger="{ toggle }">
              <button
                class="flex items-center hover:bg-primary-blue-dark/10 p-1.5 rounded"
                @click="toggle"
              >
                <svg
                  width="9"
                  height="6"
                  viewBox="0 0 9 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.5 4.5L3.89896 5.10104C4.2309 5.43299 4.76909 5.43299 5.10104 5.10104L4.5 4.5ZM8.60104 1.60104C8.93299 1.2691 8.93299 0.730905 8.60104 0.398959C8.2691 0.0670136 7.7309 0.0670135 7.39896 0.398959L8.60104 1.60104ZM1.60104 0.398959C1.26909 0.0670133 0.730905 0.0670132 0.398959 0.398959C0.0670138 0.730905 0.0670137 1.26909 0.398959 1.60104L1.60104 0.398959ZM5.10104 5.10104L8.60104 1.60104L7.39896 0.398959L3.89896 3.89896L5.10104 5.10104ZM5.10104 3.89896L1.60104 0.398959L0.398959 1.60104L3.89896 5.10104L5.10104 3.89896Z"
                    fill="#3F75FF"
                  />
                </svg>

                <icon-currency
                  :currency="token1.symbol.toLowerCase()"
                  class="ml-2.5 w-9 h-9"
                />
              </button>
            </template>
            <template #menu="{ close }">
              <DropdownMenu
                class="z-10 bg-white w-32 rounded border border-[#CFDCFF] drop-shadow-sm pt-0 pb-0"
                align="right"
              >
                <List
                  :items="allTokens.filter(t => t.symbol != token0.symbol)"
                  class="p-1.5"
                  items-wrapper-classes="space-y-2 overflow-y-scroll max-h-[200px]"
                >
                  <template v-slot:default="{ item }">
                    <div
                      @click="
                        selectToken1(item);
                        close();
                      "
                      class="cursor-pointer rounded-sm flex items-center p-1.5 bg-[#F6F7F9] border border-transparent hover:border-primary-blue-dark"
                    >
                      <icon-currency
                        :currency="item.symbol.toLowerCase()"
                        class="mr-1.5 w-6 h-6"
                      />

                      <span
                        class="text-primary-blue-dark text-sm font-semibold"
                      >
                        {{ item.symbol }}
                      </span>
                    </div>
                  </template>
                </List>
              </DropdownMenu>
            </template>
          </Dropdown>
        </div>

        <div
          class="flex justify-between items-center text-primary-gray font-medium"
        >
          <div>~ $ 9,321.69 <span class="text-green-pure">(0.188%)</span></div>

          <div>Balance: 85 {{ token1.symbol }}</div>
        </div>

        <div
          class="shadow-sm absolute -top-1 border border-grey-dark/[0.15] border-t-0 inset-x-0 mx-auto rounded-b-full bg-white w-10 h-5"
        ></div>
      </div>

      <div class="absolute inset-y-0 my-auto h-2 w-full bg-white"></div>
      <div
        @click="switchTokens"
        class="cursor-pointer absolute inset-0 m-auto h-[30px] w-[30px] bg-white border border-[#D1D7E1] rounded-full flex items-center justify-center drop-shadow-sm"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.25333 6.0701C2.26024 6.14317 2.27865 6.21659 2.30753 6.2869C2.42378 6.5674 2.69665 6.74979 3.0004 6.74979H4.5004L4.5004 14.9998H6.0004L6.0004 6.74979H7.5004C7.8034 6.74979 8.07702 6.5674 8.19327 6.2869C8.23152 6.1939 8.2504 6.09654 8.2504 5.99979C8.2504 5.80479 8.17392 5.61277 8.03067 5.46952L5.78067 3.21952C5.48742 2.92627 5.01263 2.92627 4.72013 3.21952L2.47013 5.46952C2.30925 5.63039 2.23259 5.8509 2.25333 6.0701ZM9.75333 11.9295C9.73259 12.1487 9.80925 12.3692 9.97012 12.5301L12.2201 14.7801C12.5126 15.0733 12.9874 15.0733 13.2807 14.7801L15.5307 12.5301C15.6739 12.3868 15.7504 12.1948 15.7504 11.9998C15.7504 11.903 15.7315 11.8057 15.6933 11.7127C15.577 11.4322 15.3034 11.2498 15.0004 11.2498H13.5004L13.5004 2.99979H12.0004L12.0004 11.2498H10.5004C10.1974 11.2498 9.92378 11.4322 9.80753 11.7127C9.77865 11.783 9.76024 11.8564 9.75333 11.9295Z"
            fill="#3F75FF"
          />
        </svg>
      </div>
    </div>

    <div class="text-right mt-[18px] font-medium mb-1">
      1 DAI = 0.0004272 ETH
    </div>

    <div class="mt-6 flex items-center justify-between">
      <div class="text-[#A5AEC5] text-sm font-medium">
        Slippage tolerance
      </div>

      <div>
        <toggle-button
          :checked="customSlippage"
          @change="customSlippage = $event"
          label="Custom"
        />
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between space-x-4">
      <div class="w-1/2">
        <div
          v-if="customSlippage"
          class="text-sm font-medium flex text-center items-center bg-primary-gray/[.15] text-primary-gray w-full p-1 rounded-[6px] border border-grey-dark border-opacity-[0.15]"
        >
          <span class="w-1/4 py-1.5">0.1%</span>
          <span class="w-1/4 py-1.5">0.5%</span>
          <span class="w-1/4 py-1.5">1%</span>
          <span class="w-1/4 py-1.5">3%</span>
        </div>

        <div
          v-else
          class="text-sm font-medium flex items-center border-primary-blue-dark text-primary-gray w-full p-1 rounded-[6px] border "
        >
          <button
            class="w-1/4 py-1.5"
            @click="slippage = '0.1'"
            :class="{
              'rounded bg-primary-blue-dark text-white': slippage === '0.1'
            }"
          >
            0.1%
          </button>

          <button
            class="w-1/4 py-1.5"
            @click="slippage = '0.5'"
            :class="{
              'rounded bg-primary-blue-dark text-white': slippage === '0.5'
            }"
          >
            0.5%
          </button>

          <button
            class="w-1/4 py-1.5"
            @click="slippage = '1'"
            :class="{
              'rounded bg-primary-blue-dark text-white': slippage === '1'
            }"
          >
            1%
          </button>

          <button
            class="w-1/4 py-1.5"
            @click="slippage = '3'"
            :class="{
              'rounded bg-primary-blue-dark text-white': slippage === '3'
            }"
          >
            3%
          </button>
        </div>
      </div>
      <div class="w-1/2">
        <input-percent
          ref="customPercentInput"
          right
          max="10"
          v-model="customSlippageValue"
          placeholder="Custom"
          :disabled="!customSlippage"
        />
      </div>
    </div>

    <div class="mt-7">
      <ButtonCTA class="px-8 h-16 w-full">Swap</ButtonCTA>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, ref } from '@nuxtjs/composition-api'
import { useNetwork } from '~/composables/useNetwork'
import tokens from '~/constant/tokens'
import Button from '../Button.vue'
import Dropdown from '../common/input/Dropdown.vue'
import InputPercent from '../common/input/InputPercent.vue'
import ToggleButton from '../common/input/ToggleButton.vue'
import List from '../common/list/List.vue'
import Menu from '../common/menu/Menu.vue'
import IconCurrency from '../IconCurrency.vue'
import DropdownMenu from '../protocols/DropdownMenu.vue'
import ButtonCTA from '~/components/common/input/ButtonCTA.vue'

export default defineComponent({
  components: { List, Menu, IconCurrency, Button, Dropdown, DropdownMenu, ToggleButton, InputPercent, ButtonCTA },
  setup() {

    const { activeNetworkId } = useNetwork()
    const allTokens = computed(() => tokens[activeNetworkId.value].allTokens)

    const token0Input = ref()

    const token0 = reactive({
      address: '',
      symbol: 'ETH',
      amount: '4'
    })

    const token1 = reactive({
      address: '',
      symbol: 'DAI',
      amount: '9322.75'
    })

    const slippage = ref('3')
    const customSlippage = ref(false)
    const customSlippageValue = ref("0.0")

    const switchTokens = () => {
      const token0Raw = JSON.parse(JSON.stringify(token0))
      const token1Raw = JSON.parse(JSON.stringify(token1))

      token0.symbol = token1Raw.symbol
      token0.address = token1Raw.address
      token0.amount = token1Raw.amount

      token1.symbol = token0Raw.symbol
      token1.address = token0Raw.address
      token1.amount = token0Raw.amount
    }

    const selectToken0 = (token) => {
      token0.symbol = token.symbol
      token0.address = token.address
      token0.amount = "0"
    }

    const selectToken1 = (token) => {
      token1.symbol = token.symbol
      token1.address = token.address
      token1.amount = "0"
    }

    return {
      token0Input,
      customSlippage,
      token0,
      selectToken0,
      token1,
      selectToken1,
      switchTokens,
      allTokens,
      customSlippageValue,
      slippage,
    }
  },
})
</script>
