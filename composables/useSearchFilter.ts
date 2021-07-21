import { computed, ref } from '@nuxtjs/composition-api'

/**
 * Simple filtering of objects by search term.
 *
 * @param {Ref<{}[]>} collectionRef Ref of object array with objects which items will get filtered
 * @param  {...string} propertyNames Names of properties that will be compared with the search term
 */
export function useSearchFilter(collectionRef, ...propertyNames) {
  const search = ref('')

  const filtered = computed(() => {
    if (!search.value) return collectionRef.value

    const term = search.value.toLowerCase()

    return collectionRef.value.filter((item) => {
      const properties = propertyNames.map((propertyName) => item[propertyName]).filter((p) => !!p)

      const isTermIncludedInProperties = properties
        .map((property) => property.toString().toLowerCase())
        .some((property) => property.includes(term))

      return isTermIncludedInProperties
    })
  })

  return { filtered, search }
}
