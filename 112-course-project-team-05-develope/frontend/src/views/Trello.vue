<template>
    <v-container class="paper">
        <TrelloList :status="status" :ListName="index.name" :ListId="index.listId"  v-for="index in dataList" :key="index.listId" class="list" @on-change-start="emitEventStart" @on-change-end="emitEventEnd"></TrelloList>
    </v-container>
</template>
  
<script lang="ts">
import Vue from "vue";
import TrelloList from "@/components/TrelloList.vue";
import {getTrelloListById} from "@/apis/trello";
//import Box from "@/components/Box.vue"

declare interface Data {
    listId: string,
    name: string
}

export default Vue.extend({
    components: {
        TrelloList,
        //Box
    },
    data() {
        return {
            //dataList: [{ type: Object, id: "", name: ""}],
            // dataList: new Array<Data>(),
            dataList: [] as Data[],
            show: false,
            modalClass:'',
            dialogVisible: false,
            status: ''
        };
    },
    mounted() {
        this.getAsyncTrelloListById();
    },
    methods: {
        emitEventStart(ListId: string){
            this.status = ListId;
        },
        emitEventEnd(recv: string){
            this.status = recv;
        },
        async getAsyncTrelloListById() {
            this.dataList = [];
            const responses = await getTrelloListById("123", this.$route.params.boardId);
            for(const response in responses.data){
                this.dataList.push({listId: responses.data[response].listId, name: responses.data[response].listName});
            }
        },
    }
});
</script>

<style lang="scss">
    .paper{
        background-color: rgb(255, 255, 255) !important;
    }
    .list{
        display: inline-grid;
    }
</style>
  