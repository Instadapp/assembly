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
          v-for="(safeType, index) in filteredSafes"
          :key="index"
          class="flex items-center justify-between px-4 py-4 mt-4 cursor-pointer first:mt-0 group bg-white rounded-lg border border-grey-dark/[0.15] hover:bg-selection"
          @click="select(safeType.type)"
        >
          <div class="flex flex-col mr-4">
            <div class="mb-1 font-semibold whitespace-no-wrap text-12">
              {{ safeType.type }}
            </div>
            <div
              class="mb-1 font-medium whitespace-no-wrap text-12 text-grey-pure"
            >
              Stability Fee: {{ formatPercent(safeType.rate) }}
            </div>
            <div
              class="mb-1 font-medium whitespace-no-wrap text-12 text-grey-pure"
            >
              Liquidation: {{ formatPercent(safeType.liquidation) }}
            </div>
          </div>

          <IconCurrency :currency="safeType.tokenKey" />
        </div>
      </div>
    </div>
  </SidebarContextRootContainer>
</template>

<script>
import { defineComponent, useContext, computed } from '@nuxtjs/composition-api'
import { useFormatting } from '~/composables/useFormatting'
import { useReflexerPosition } from '~/composables/protocols/useReflexerPosition'
import { useSearchFilter } from '~/composables/useSearchFilter'
import { useSidebar } from '~/composables/useSidebar'

export default defineComponent({
  props: {
    safeType: { type: String, default: null },
  },
  setup(props) {
    const { store, app, route } = useContext()
    const { formatPercent } = useFormatting()
    const { back } = useSidebar()
    const { safeTypes: reflexerSafeTypes, safeType, isNewSafe } = useReflexerPosition()

    const safeTypes = computed(() => {
      const shouldFilter = !!props.safeType && (props.safeType === 'token' || props.safeType === 'uniLPT')
      const filtered = reflexerSafeTypes.value.filter((safe) => !safe.disabled)
      const final = shouldFilter ? filtered.filter((safe) => safe.safeTokenType === props.safeType) : filtered
      if (route.value.hash.startsWith('#collateral')) return final
      return filtered.filter((safe) => safe.safeTokenType === 'token')
    })

    const { filtered: filteredSafes, search } = useSearchFilter(safeTypes, 'type', 'token')

    function select(vt, tokenKey) {
      safeType.value = vt;
      isNewSafe.value = true
      app.router.push({ hash: 'supply' })
    }

    return {
      filteredSafes,
      search,
      formatPercent,
      select,
    }
  },
})
</script>
