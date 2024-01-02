<template>
  <div>
    <v-tabs>
      <v-tab>Architecture</v-tab>
      <v-tab>All</v-tab>
      <!-- Architecture -->
      <v-tab-item>
        <div class="tree-container">
          <el-tree 
            :data="treeData" 
            :props="defaultProps" 
            v-if="treeData.length > 0"
          />
          <div v-else>等待讀取，如果還是沒有顯示，請檢查資料</div>
        </div>
      </v-tab-item>
      
      <!-- All -->
      <v-tab-item>
        <ve-pie
          :data="repoLanguagesData"
          :settings="pieChartSettings"
          v-if="repoLanguagesData.rows.length > 0"
        />
        <div v-else>無語言比例</div>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { getRepoLanguage, getTree } from "@/apis/repoInfo";

  interface TreeNode {
    label: string;
    children: TreeNode[];
  }

  export default Vue.extend({
    props: {
      repoId: Number,
    },
    data() {
      return {
        pieChartSettings: {
          radius: 150,
          offsetY: 220,
        },
        repoLanguagesData: {
          columns: ["語言", "比例"],
          rows: [] as any,
        },
        fileStructureTree: "",
        treeData: [] as TreeNode[], // Specify the type here
        defaultProps: {
          children: 'children',
          label: 'label'
        },
      };
    },
    async mounted() {
      const Tree = (await getTree(this.repoId)).data;
      this.treeData = this.buildElTreeData(this.buildTree(Tree.tree));

      const repoLanguages = (await getRepoLanguage(this.repoId)).data;
      const arrayFailed = Object.entries(repoLanguages)
        .map((arr) => ({
          語言: arr[0],
          比例: arr[1],
        }))
        .map((arr) => {
          this.repoLanguagesData.rows.push(arr);
        });
    },
    methods: {
      buildTree(data: any) {
        const tree: any = {};

        for (const entry of data) {
          const pathComponents = entry.path.split('/');
          let currentNode = tree;

          for (const component of pathComponents) {
            if (!currentNode[component]) {
              currentNode[component] = {};
            }
            currentNode = currentNode[component];
          }

          if (entry.language !== null) {
            currentNode.language = entry.language;
          }
        }

        return tree;
      },
      buildElTreeData(data: any) {
        const elTreeData: TreeNode[] = [];

        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const node: TreeNode = {
              label: key,
              children: [],
            };

            if (data[key].language !== undefined && data[key].language !== null) {
              node.label += `\t(${data[key].language})`;
              if (data[key].language && typeof data[key].language === 'object') {
                node.children = this.buildElTreeData(data[key].language);
              }
            } else {
              if (data[key] && typeof data[key] === 'object') {
                node.children = this.buildElTreeData(data[key]);
              }
            }
            elTreeData.push(node);
          }
        }
        return elTreeData;
      }
    },
  });
</script>

<style lang="css">
  .tree-container {
    margin: 40px;
    padding: 10px;
    border: 1px solid #ccc;
  }
</style>