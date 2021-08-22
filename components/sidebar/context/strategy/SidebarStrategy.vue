<template>
  <SidebarContextContainer class="h-full overflow-hidden">
    <SidebarContextHeader class="xxl:hidden">Strategy</SidebarContextHeader>

    <div class="h-full overflow-y-scroll scrollbar-hover">
      <div class="mx-auto" style="max-width: 296px">
        <div class="py-2 sm:py-4">
          <div v-for="(input, index) in inputs" :key="index">
            <input
              type="text"
              :value="input.value"
              @input="$event => input.onInput($event.target.value)"
              :placeholder="input.placeholder()"
            />
            {{ input.error }}
          </div>

          <button @submit="submit">Submit</button>

          {{ error }}
        </div>
      </div>
    </div>
  </SidebarContextContainer>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { useSidebar } from "~/composables/useSidebar";
import { protocolStrategies, DefineStrategy } from "~/core/strategies";
import { useStrategy } from "~/composables/useStrategy";

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

    const { inputs, submit, error } = useStrategy(
      strategies.find(strategy => strategy.id === props.strategy)
    );

    return {
      inputs,
      error,
      submit
    };
  }
});
</script>