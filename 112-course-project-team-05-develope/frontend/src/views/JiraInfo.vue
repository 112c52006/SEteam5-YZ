<template>
  <v-container fill-height class="justify-center mt-10" style="width: 70%">
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab>Product backlog</v-tab>
      <v-tab>Sprint</v-tab>
      <v-tab>Board</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="tab-item">
      <v-tab-item><ProductBacklog/></v-tab-item>
      <v-tab-item><Sprint/></v-tab-item>
      <v-tab-item><Board/></v-tab-item>
      <v-tab-item></v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ProductBacklog from "@/components/ProductBacklog.vue";
import Sprint from "@/components/Sprint.vue";
import Board from "@/components/Board.vue";

export default Vue.extend({
  components: {
    ProductBacklog,
    Sprint,
    Board
  },
  data() {
    return {
      tab: null
    };
  },
  
  methods: {
    
  }
});
</script>

<style lang="scss">
.tab-item {
  width: 100%;
  height: 100%;
}
</style>
