<template>
  <SidebarContextContainer class="h-full overflow-hidden">
    <SidebarContextHeader class="xxl:hidden">Strategy</SidebarContextHeader>

    <div class="h-full overflow-y-scroll scrollbar-hover">
      <div class="mx-auto" style="max-width: 296px">
        <div class="py-2 sm:py-4">
          <pre>{{ $props }}</pre>
          <pre>{{ selectedStrategy }}</pre>

          <input
            type="text"
            v-for="(input, index) in selectedStrategy.inputs"
            :key="index"
            :value="input.value"
            @input="$event => input.onInput($event.target.value)"
          />
        </div>
      </div>
    </div>
  </SidebarContextContainer>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  watch,
  watchEffect,
  ref
} from "@nuxtjs/composition-api";
import { useSidebar } from "~/composables/useSidebar";
import { protocolStrategies, DefineStrategy } from "~/core/strategies";

export default defineComponent({
  props: {
    protocol: {
      type: String,
      required: true
    },
    strategy: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { close } = useSidebar();

    const strategies: DefineStrategy[] =
      protocolStrategies[props.protocol] || [];

    const selectedStrategy = ref(
      strategies.find(strategy => strategy.id === props.strategy)
    );

    watch(() => {
      selectedStrategy.value = strategies.find(
        strategy => strategy.id === props.strategy
      );
    });

    return {
      selectedStrategy
    };
  }
});
</script>