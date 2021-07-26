<template>
  <transition
    v-bind="$attrs"
    v-on="$listeners"
    @after-enter="addAfterEnterClass"
    @before-leave="removeAfterEnterClass"
  >
    <slot />
  </transition>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  props: {
    afterEnterClass: { type: String, default: '' },
  },
  setup(props) {
    const afterEnterClasses = computed(() => props.afterEnterClass.split(' ').filter((cssClass) => !!cssClass))
    function addAfterEnterClass(el) {
      afterEnterClasses.value.forEach((cssClass) => el.classList.add(cssClass))
    }
    function removeAfterEnterClass(el) {
      afterEnterClasses.value.forEach((cssClass) => el.classList.remove(cssClass))
    }

    return { addAfterEnterClass, removeAfterEnterClass }
  },
})
</script>
