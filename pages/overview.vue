<template>
  <div>
    <sidebar-overview />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import SidebarOverview from "~/components/sidebar/context/overview/SidebarOverview.vue";

export default defineComponent({
  components: {SidebarOverview  },
});
</script>
