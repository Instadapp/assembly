<template>
  <SidebarContextContainer class="flex-1 h-full overflow-hidden">
    <SidebarContextHeader :showBackButton="false"></SidebarContextHeader>

    <div class="flex-grow overflow-y-scroll scrollbar-hover">
      <div class="h-full mx-auto">
        <div class="flex flex-col h-full py-2 sm:py-4">
          <SidebarOverviewBalance />
          <div
            class="bg-[#C5CCE1] bg-opacity-[0.15] py-10 px-8 flex flex-col flex-grow mt-2 sm:mt-4"
          >
            <div class="flex flex-shrink-0">
              <search-input
                v-model.trim="search"
                placeholder="Search Currency"
                class="w-full"
              />
            </div>

            <div class="flex flex-col flex-grow mt-2 sm:mt-4 overflow-y-scroll">
              <currency-list :search="search" type="dsa" action-label="Trade">
                <template v-slot:no-items>
                  <div class="flex flex-col">
                    <div class="font-medium text-center text-grey-pure">
                      Can't find existing token?
                    </div>
                    <Button
                      color="ocean-blue"
                      large
                      style="background: none"
                      @click="startAddingCustomToken"
                      >Add custom token</Button
                    >
                  </div>
                </template>
              </currency-list>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SidebarContextContainer>
</template>

<script>
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'
import SVGAdd from '@/assets/img/icons/add.svg?inline'
import CurrencyList from '../components/CurrencyList.vue'
import List from '~/components/common/list/List.vue'
import Menu from '~/components/common/menu/Menu.vue'
import MenuButton from '~/components/common/menu/MenuButton.vue'
import MenuListItem from '~/components/common/menu/MenuListItem.vue'

export default defineComponent({
  components: { SVGAdd, CurrencyList, List, Menu, MenuButton, MenuListItem },
  setup() {

    const search = ref(null)

    return { search }
  },
})
</script>
