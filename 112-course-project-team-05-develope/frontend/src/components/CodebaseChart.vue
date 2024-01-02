<template>
  <div>
    <ve-line :data="chartData" :settings="chartSettings"></ve-line>
    <ve-line
      v-if="isCompare"
      :data="compareChartData"
      :settings="chartSettings"
    ></ve-line>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getCodebase, getTree , getRepoLanguage } from "@/apis/repoInfo";
export default Vue.extend({
  props: {
    repoId: Number,
    compareRepoId: Number
  },
  data() {
    return {
      chartSettings: {
        area: true
      },
      chartData: {
        columns: [
          "date",
          "numberOfRows",
          "numberOfRowsAdded",
          "numberOfRowsDeleted"
        ],
        rows: []
      },
      compareChartData: {
        columns: [
          "date",
          "numberOfRows",
          "numberOfRowsAdded",
          "numberOfRowsDeleted"
        ],
        rows: []
      },
    };
  },
  watch: {
    compareRepoId: function(newValue) {
      this.getCodebaseData(this.compareRepoId).then(res => {
        this.compareChartData.rows = res;
      });
    }
  },
  mounted() {
    this.getCodebaseData(this.repoId).then(res => {
      this.chartData.rows = res;
    });

    this.getTreeData(this.repoId);
    this.getRepoLanguageData(this.repoId);
    

    if (this.isCompare) {
      this.getCodebaseData(this.compareRepoId).then(res => {
        this.compareChartData.rows = res;
      });
    }
  },
  computed: {
    isCompare(): boolean {
      return this.compareRepoId != null;
    }
  },
  methods: {
    getCodebaseData(repoId: number): Promise<any> {
      return getCodebase(repoId).then(res => {
        return res.data;
      });
    },
    getTreeData(repoId: number): Promise<any> {
      return getTree(repoId).then(res => {
         console.log('82 res:', res)
         console.log('83 res.data:', res.data)
         return res.data;
       });
    },
     getRepoLanguageData(repoId: number): Promise<any> {
       return getRepoLanguage(repoId).then(res => {
         console.log('89 res:', res)
         console.log('90 res.data:', res.data)
         return res.data;
       });
    },
  }
});
</script>
