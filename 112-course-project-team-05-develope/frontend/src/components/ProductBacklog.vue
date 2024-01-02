<template>
  <v-container>
    <v-divider class="mx-4"></v-divider>
    <v-row>
      <v-col>
        <!-- combobox for fields -->
        <v-combobox
          v-model="selectedField"
          :items="headers"
          :search-input.sync="cbSearch"
          label="Select the field that you want to show"
          class = "mt-1"
          auto-select-first
          multiple
          hide-selected
          small-chips
          @change="setFieldAlign()"
        >
          <!-- setting of selected field -->
          <template v-slot:selection="{ attrs, item, parent, selected }">
            <v-chip
              v-if="item === Object(item)"
              v-bind="attrs"
              color='amber lighten-4'
              :input-value="selected"
              label
              small
            >
              <span class="pr-2">
                {{ item.text }}
              </span>
              <v-icon
                small
                @click="parent.selectItem(item)"
              >
                $delete
              </v-icon>
            </v-chip>
          </template>
          <!-- setting of optional field in drop-down list -->
          <template v-slot:item="{ item }">
            <v-chip
              :color="item.disabled ? 'gray lighten-3' : 'amber lighten-4'"
              label
              small
            >
              {{ item.text + (item.disabled ? ' : default' : '')}}
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
      <v-col cols="4">
        <!-- search box for issue table -->
        <v-text-field
          v-model="dtSearch"
          append-icon="mdi-magnify"
          label="Search"
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="issueData"
      :search="dtSearch"
      :custom-sort="customSort"
      :loading="loading"
      loading-text="Loading... Please wait"
      multi-sort
      class="elevation-1"
    >
      <!-- headers -->
      <template v-for="h in headers" v-slot:[`header.${h.value}`]="{ headers }">
        <v-tooltip bottom :key="h.value">
          <template v-slot:activator="{ on }">
            <span v-on="on"> {{ h.text }} </span>
          </template>
          <span v-if="headerTooltips[h.value]">
            {{ headerTooltips[h.value] }}
          </span>
          <span v-else> {{ headerTooltips.default }} </span>
        </v-tooltip>
      </template>
      <!-- status column -->
      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          :class="statusData[item.status].color"
        >
          {{ item.status }}
        </v-chip>
      </template>
      <!-- priority column -->
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
      <!-- type column -->
      <template v-slot:[`item.type`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              :color="taskTypeData[item.type].color"
              v-on="on"
            >
              {{ taskTypeData[item.type].icon }}
            </v-icon>
          </template>
          <span> {{ item.type }} </span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { getAllJiraField } from "@/apis/jiraInfo";
import { getAllJiraIssue } from "@/apis/jiraInfo";
import { getJiraInfoFake } from "@/apis/jiraInfo";

interface PriorityData {
  [index: string]: {
    color: string;
    icon: string;
    sortPriority: number;
  };
}

interface TaskTypeData {
  [index: string]: {
    color: string;
    icon: string;
    sortPriority: number;
  };
}

interface StatusData {
  [index: string]: {
    color: string;
    sortPriority: number;
  };
}

export default Vue.extend({
  data () {
    return {
      headerTooltips: {
        type: 'Main ↔ Sub',
        status: 'In Progress ↔ Done',
        priority: 'Highest ↔ Lowest',
        default: 'A ↔ Z'
      },
      priorityData: {
        'Highest': {
          color: 'deep-orange darken-1',
          icon: 'mdi-chevron-double-up',
          sortPriority: 5
        },
        'High': {
          color: 'deep-orange lighten-1',
          icon: 'mdi-chevron-up',
          sortPriority: 4
        },
        'Medium': {
          color: 'yellow darken-2',
          icon: 'mdi-approximately-equal',
          sortPriority: 3
        },
        'Low': {
          color: 'blue darken-1',
          icon: 'mdi-chevron-down',
          sortPriority: 2
        },
        'Lowest': {
          color: 'blue darken-3',
          icon: 'mdi-chevron-double-down',
          sortPriority: 1
        }
      } as PriorityData,
      taskTypeData:{
        'Task': {
          color: 'red',
          icon: 'mdi-file-document',
          sortPriority: 2
        },
        'Subtask': {
          color: 'blue',
          icon: 'mdi-file-tree',
          sortPriority: 1
        }
      } as TaskTypeData,
      statusData: {
        'In Progress': {
          color: 'blue lighten-4 blue--text text--darken-4',
          sortPriority: 3
        },
        'To Do': {
          color: 'grey lighten-2 grey--text text--darken-3',
          sortPriority: 2
        },
        'Done': {
          color: 'green lighten-4 green--text text--darken-4',
          sortPriority: 1
        }
      } as StatusData,
      headers: [] as object[],
      selectedField:[] as any[],
      issueData: [] as object[],
      dtSearch: '',
      cbSearch: '',
      loading: true
    };
  },
  methods: {
    setFieldAlign() {
      this.cbSearch='';
      this.headers.forEach((item: any, index: number) => {
        if(this.selectedField.find((field)=> field.value == item.value) || item.disabled)
          item.align = 'start';
        else
          item.align = ' d-none';
      });
    },
    getJiraField() {
      this.headers = getAllJiraField();
      // getAllJiraField()
      //   .then(response => {
      //   })
      //   .catch(err => {
      //     alert("系統錯誤");
      //   });
    },
    getJiraIssue() {
      // this.issueData = getJiraInfoFake();
      this.loading = false;
      getAllJiraIssue(Number(this.$route.params.repoId))
        .then(response => {
          this.loading = true;
          response.data.result.forEach((item: any) => {
            this.issueData.push({
              key: item.key,
              summary: item.summary,
              type: item.type,
              priority: item.priority,
              status: item.status,
              resolution: item.resolution,
              label: item.label.join(', '),
              created: new Date(item.created).toLocaleString("zh-tw"),
              updated: new Date(item.updated).toLocaleString("zh-tw")
            });
          });
          this.loading = false;
        })
        .catch(err => {
          alert("系統錯誤");
        });
    },
    customSort(items: any[], indexes: string[], isDescending: boolean[]) {
      items.sort((a: any, b: any) => {
        let p = 0;
        for (let i = 0; i < indexes.length; i++) {
          const index = indexes[i];
          const isDesc = isDescending[i];
          if (index === "priority") {
            p = this.priorityData[b.priority].sortPriority - this.priorityData[a.priority].sortPriority;
          }
          else if (index === "status") {
            p = this.statusData[b.status].sortPriority - this.statusData[a.status].sortPriority;
          }
          else if (index === "type") {
            p = this.taskTypeData[b.type].sortPriority - this.taskTypeData[a.type].sortPriority;
          }
          else if (typeof a[index] === "string") {
            p = a[index].toLowerCase().localeCompare(b[index].toLowerCase());
          }
          else if (typeof a[index] === "number") {
            p = b[index] - a[index];
          }
          else {
            p = 0;
          }
          if (isDesc) p = -p;
          if (p) break;
        }
        return p;
      });
      return items;
    }
  },
  mounted() {
    this.getJiraIssue();
    this.getJiraField();
    this.setFieldAlign();
  }
});
</script>

<style lang="scss">

</style>
