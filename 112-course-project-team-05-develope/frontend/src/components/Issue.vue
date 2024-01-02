<template>
  <div>
    <div v-for="(item, index) in data" :key="item.total">
      <div :key="index.total" v-if="item.status === Conditions">
        <v-dialog v-model="dialog['dialog_' + index]" width="800">
          <template v-slot:activator="{ on, attrs }">
            <!--Show Task with v-card -->
            <v-card
              height="auto"
              class="my-2 px-6 pt-2 pb-6"
              v-bind="attrs"
              v-on="on"
            >
              <v-row>
                <v-card-subtitle class="font-weight-bold">
                  <v-icon color="primary">mdi-checkbox-marked-circle</v-icon>
                  {{ item.key }}
                </v-card-subtitle>
              </v-row>

              <v-card-text class="text-left text--primary pt-3 pb-6 px-2">
                {{ item.summary }}
              </v-card-text>

              <v-row justify="space-around">
                <v-chip :class="getColor(item.status)" v-for="(element) in item.labels" :key="element.total">
                  {{ element }}
                </v-chip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      :color="priorityData[item.priority].color"
                      v-on="on"
                    >
                      {{ priorityData[item.priority].icon }}
                    </v-icon>
                  </template>
                  <span> {{ item.priority }} </span>
                </v-tooltip>
                <v-chip class="red lighten-4 red--text text--darken-4">
                  {{ item.storypoint }}
                </v-chip>
              </v-row>
            </v-card>
          </template>

          <!-- Show Issue Details by v-dialog -->
          <v-card class="text-left">
            <v-card-title class="text-h5 font-weight-bold py-5">
              <v-icon color="primary" class="mr-2">mdi-checkbox-marked-circle</v-icon>
              {{ item.key}}
              {{ item.summary }}
            </v-card-title>
            
            <v-divider></v-divider>
            <v-card-text class="body-1 black--text font-weight-bold pt-6">Descriptions：</v-card-text>
            <v-card-text>
              {{ item.description }}
            </v-card-text>
            <v-card-text class="body-1 black--text font-weight-bold"> Child issue：</v-card-text>
            <v-data-table
              :headers="headers"
              :items="item.subtasks"
              class="elevation-1"
            >
              <template v-slot:[`item.status`]="{ item }">
                <v-chip :class="statusData[item.status].color">
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:[`item.priority`]="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      :color="priorityData[item.priority].color"
                      v-on="on"
                    >
                      {{ priorityData[item.priority].icon }}
                    </v-icon>
                  </template>
                  <span> {{ item.priority }} </span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getBoardInfo, getAllSubtasks } from "@/apis/board";
import { getSprintInfo, getIssueInfo } from "@/apis/jiraInfo";
export default Vue.extend({
  props: {
    Conditions: String
  },
  data() {
    return {
      priorityData: {
        Highest: {
          color: "deep-orange darken-1",
          icon: "mdi-chevron-double-up",
        },
        High: {
          color: "deep-orange lighten-1",
          icon: "mdi-chevron-up",
        },
        Medium: {
          color: "yellow darken-2",
          icon: "mdi-approximately-equal",
        },
        Low: {
          color: "blue darken-1",
          icon: "mdi-chevron-down",
        },
        Lowest: {
          color: "blue darken-3",
          icon: "mdi-chevron-double-down",
        },
      },
      statusData: {
        "In Progress": {
          color: "blue lighten-4 blue--text text--darken-4",
        },
        "To Do": {
          color: "grey lighten-2 grey--text text--darken-3",
        },
        Done: {
          color: "green lighten-4 green--text text--darken-4",
        },
      },
      data: [] as object[],
      dialog: [],
      headers: [] as object[],
    };
  },
  methods: {
    getAllBoardInfo() {
      getSprintInfo(Number(this.$route.params.repoId))
        .then(response => {
          const sprint = response.data.result.pop();
          getIssueInfo(Number(this.$route.params.repoId), Number(sprint.id))
            .then(response => {
                this.data = [];
                response.data.result.forEach((item: any) => {
                  this.data.push({
                    key: item.key,
                    summary: item.summary,
                    status: item.status,
                    storypoint: item.estimatePoint,
                    labels: item.label,
                    priority: item.priority,
                    description: item.description,
                    subtasks: item.subTasks
                  });
                });
              this.data.reverse();
            })
            .catch(err => {
              alert("系統錯誤");
            });
        })
        .catch(err => {
          alert("系統錯誤");
        });
    },
    getSubtasks() {
      this.headers = getAllSubtasks();
    },
    getColor(labels: string) {
      if (labels === "Frontend")
        return "blue lighten-4 blue--text text--darken-4";
      else return "green lighten-4 green--text text--darken-4";
    },
  },
  mounted() {
    this.getAllBoardInfo();
    this.getSubtasks();
  },
});
</script>