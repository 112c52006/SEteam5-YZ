<template>
  <v-dialog v-model="dialog" max-width="60%">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" v-bind="attrs" v-on="on" @click="clearInputData"
        ><v-icon>mdi-trello</v-icon></v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Bind Trello</span>
      </v-card-title>
      <v-card-text>
        <v-container>
           <v-row justify="start">
              <v-col cols="1" justify="start">
                <div class="text">Bind Status</div>
                <v-icon color="green darken-1" v-if="trelloBindStatus">mdi-check-circle</v-icon>
                <v-icon color="red darken-1" v-else>mdi-alpha-x-circle</v-icon>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  :label="'Trello Key'"
                  v-model="trelloData.key"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  :label="'Trello Token'"
                  v-model="trelloData.token"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
                <v-col cols = "1" width="50%">
                <v-btn color="primary" @click="clearTrelloInfo">
                    Clear Existed
                </v-btn>
              </v-col>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="bindTrelloInfo"> Add </v-btn>
            </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import router from "@/router";
import { bindTrelloInfoPost, clearTrelloBindInfo, checkTrelloKeyToken} from "@/apis/repository";
export default Vue.extend({
  props: [],
  data() {
    return {
      trelloData:{
        key: "",
        token: "",
      },
      dialog: false,
      trelloBindStatus: false,
    };
  },
  watch: {
  },
  mounted() {
    this.checkBindStatus();
  },
  methods: {
    clearInputData() {
      this.trelloData.key = "",
      this.trelloData.token = ""
    },
    // 檢查trello綁定狀態
    async checkBindStatus() {
      const result = await checkTrelloKeyToken();
      if (result.data.success) { 
        this.trelloBindStatus =  true;
      }
      else {
        this.trelloBindStatus = false;
      }
    },
    // 綁定trello的資訊
    async bindTrelloInfo() {
        const result = await bindTrelloInfoPost(
            this.trelloData.key,
            this.trelloData.token
        );
        if (result.data.success) {
            this.$emit(
                "msgSnackBar",
                true,
                "Bind Success!"
            );
            this.dialog = false;
        } 
        else {
            this.$emit(
                "msgSnackBar",
                false,
                "Bind Fail!"
            );
            this.dialog = false;
        }
        this.checkBindStatus();
    },
    // 清除之前儲存的trello資訊
    async clearTrelloInfo() {
        const result = await clearTrelloBindInfo();
        if (result.data.success) {
            this.$emit(
                "msgSnackBar",
                true,
                "Clear Success!"
            );
            this.dialog = false;
        } 
        else {
            this.$emit(
                "msgSnackBar",
                false,
                "Clear Fail!"
            );
            this.dialog = false;
        }
        this.checkBindStatus();
    }
  },
});
</script>