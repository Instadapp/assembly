<template>
  <SidebarContextRootContainer>
    <template #title>Select Collateral</template>
    <div>
      <div class="px-8 pb-6 -mt-4">
        <SearchInput
          v-model.trim="search"
          class="mt-1"
          placeholder="Search Collateral"
        />
      </div>
      <div class="bg-[#C5CCE1] bg-opacity-[0.15] px-8 py-6 min-h-screen">
        <div
          v-for="(vaultType, index) in filteredVaults"
          :key="index"
          class="flex items-center justify-between px-4 py-4 mt-4 cursor-pointer first:mt-0 group bg-white rounded-lg border border-grey-dark/[0.15] hover:bg-selection"
          @click="select(vaultType.type)"
        >
          <div class="flex flex-col mr-4">
            <div class="mb-1 font-semibold whitespace-no-wrap text-12">
              {{ vaultType.type }}
            </div>
            <div
              class="mb-1 font-medium whitespace-no-wrap text-12 text-grey-pure"
            >
              Stability Fee: {{ formatPercent(vaultType.rate) }}
            </div>
            <div
              class="mb-1 font-medium whitespace-no-wrap text-12 text-grey-pure"
            >
              Liquidation: {{ formatPercent(vaultType.liquidation) }}
            </div>
          </div>

          <IconCurrency :currency="vaultType.tokenKey" />
        </div>
      </div>
    </div>
  </SidebarContextRootContainer>
</template>

<script>
import { defineComponent, useContext, computed } from '@nuxtjs/composition-api'
import { useFormatting } from '~/composables/useFormatting'
import { useMakerdaoPosition } from '~/composables/protocols/useMakerdaoPosition'
import { useSearchFilter } from '~/composables/useSearchFilter'
import { useSidebar } from '~/composables/useSidebar'

export default defineComponent({
  props: {
    vaultType: { type: String, default: null },
  },
  setup(props) {
    const { store, app, route } = useContext()
    const { formatPercent } = useFormatting()
    const { back } = useSidebar()
    const { vaultTypes: makerVaultTypes, vaultType, isNewVault } = useMakerdaoPosition()

    const vaultTypes = computed(() => {
      const shouldFilter = !!props.vaultType && (props.vaultType === 'token' || props.vaultType === 'uniLPT')
      const filtered = makerVaultTypes.value.filter((vault) => !vault.disabled)
      const final = shouldFilter ? filtered.filter((vault) => vault.vaultTokenType === props.vaultType) : filtered
      if (route.value.hash.startsWith('#collateral')) return final
      return filtered.filter((vault) => vault.vaultTokenType === 'token')
    })

    const { filtered: filteredVaults, search } = useSearchFilter(vaultTypes, 'type', 'token')

    function select(vt, tokenKey) {
      vaultType.value = vt;
      isNewVault.value = true
      app.router.push({ hash: 'supply' })
    }

    return {
      filteredVaults,
      search,
      formatPercent,
      select,
    }
  },
})
</script>
