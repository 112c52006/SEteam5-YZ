<template>
  <v-container>
    <v-divider class="mt-4 mb-6"></v-divider>
    <!--Sprint Title-->
    <v-row class="mx-auto">
      <div class="col-4">
        <div class="text-h4 d-flex pb-4">{{ sprint.name }}</div>
        <div class="d-flex" style="color: rgba(0, 0, 0, 0.54)">
          {{ sprint.goal }}
        </div>
      </div>
    </v-row>

    <!--Active Sprint Issue-->
    <!--To Do-->
    <v-row style="width: auto;">
      <v-col style="width: 33.33%;">
        <v-card class="mx-auto grey lighten-4 grey--text text--darken-4" height="700">
          <v-card-text>
            <div align="left">
              <h3>TO DO</h3>
            </div>
            <IssueDetail Conditions="To Do"/>
          </v-card-text>
        </v-card>
      </v-col>
      <!--In Progress-->
      <v-col style="width: 33.33%;">
        <v-card class="mx-auto grey lighten-4 grey--text text--darken-4" height="700">
          <v-card-text>
            <div align="left">
              <h3>IN PROGRESS</h3>
            </div>
            <IssueDetail Conditions="In Progress"/>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!--Done-->
      <v-col style="width: 33.3%;">
        <v-card class="mx-auto grey lighten-4 grey--text text--darken-4"  height="700">
          <v-card-text>
            <div align="left">
              <h3>DONE</h3>
            </div>
            <IssueDetail Conditions="Done"/>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import router from "@/router";
import { getBoardInfo, getSprint} from "@/apis/board";
import { getSprintInfo} from "@/apis/jiraInfo";
import IssueDetail from "@/components/Issue.vue";

interface Sprint{
  name: string,
  goal: string,
  id: number
};

export default Vue.extend({
  components:{
    IssueDetail
  },
  data() {
    return {
      sprint: {} as Sprint,
    };
  },
  methods: {
    getAllSprint() {
      getSprintInfo(Number(this.$route.params.repoId))
              .then(response => {
                this.sprint = response.data.result.pop();
              })
              .catch(err => {
                alert("系統錯誤");
              });
    },
  },
  mounted() {
    this.getAllSprint();
  },
});
</script>
<style lang="scss">
</style>
