<template>
    <div class="border card-width">
        <div>{{ListName}}</div>
        <el-card class="box-card card-style" v-for="index in cardList" :key="index.id">
            <el-row>
                <el-col :span="20">
                    <div  class="text item" style="word-break: break-all;" @click="beforeOpen(index.id, index.name)">{{index.name}}</div>
                </el-col>
                <el-col :span="4">
                    <div class="el-icon-more-outline action"></div>
                </el-col>
                <el-dialog
                title="CardIInfo"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
                >
                    <el-form :model="form">
                        <el-form-item label="Name">
                            <el-input v-model="name"></el-input>
                        </el-form-item>
                        <el-form-item label="Describe">
                            <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="textarea">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="Box">
                            <el-select v-model="selection" placeholder="移動">
                                <el-option :label=List.name :value=List.listId v-for="List in optionList" :key="List.listId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="save()" > 确 定</el-button>
                    </span>
                </el-dialog>
            </el-row>
        </el-card>
        <el-row>
            <v-edit-dialog>
                <div class="text-h8 el-icon-plus add-card">新增卡片</div>
                <template v-slot:input>
                    <v-text-field label="卡片名稱" v-model="newCardName"></v-text-field>
                    <el-button size="small" style="margin-bottom=3px; float: right;" type="primary" v-on:click="addNewCard()">新增</el-button>
                </template>
            </v-edit-dialog>
        </el-row>
        
    </div>
</template>
  
<script lang="ts">
import Vue, { watch } from "vue";
import {getTrelloListById, getTrelloCardById, addNewCardToList, getCardInfo, updateTrelloCard} from "@/apis/trello"
import Box from "@/components/Box.vue"

declare interface Data {
    id: string,
    name: string
}

declare interface List {
    listId: string,
    name: string
}

export default Vue.extend({
    props: {
        ListId: String, 
        ListName: String, 
        status: String,
        opencard: {
        type: Object,
        default: () => ({})}
    },
    data() {
        return {
            cardList: [] as Data[],
            optionList: [] as List[],
            newCardName: "",
            dialogVisible: false,
            form: {region: ''},
            textarea: '',
            selection: '',
            name: '',
            currentCardId: ''
           // cardData:[{name:,data:}]
            
        };
    },
    watch: {
        status: function (newValue,rawValue) {
            if(newValue === this.ListId){
                this.getAsyncTrelloCardById();
                this.$emit('on-change-end', '');
            }
        },
    },
    mounted() {
        this.getAsyncTrelloListById();
        this.getAsyncTrelloCardById();
    },
    methods: {
        beforeOpen(CardId: string, CardName: string){
            this.dialogVisible=true;
            this.getAsyncCardInfo(CardId);
            this.name = CardName;
            this.currentCardId = CardId;
        },
        async save(){
            await this.AsyncUpdateTrelloCard(this.currentCardId);
            this.dialogVisible = false;
            await this.getAsyncTrelloCardById();
            this.$emit('on-change-start', this.selection);
        },
        handleClose() {
            if(confirm('確認關閉?')){
                this.dialogVisible  = false;
            }
        },
        async AsyncUpdateTrelloCard(CardId: string) {
            const responses = await updateTrelloCard(this.selection, CardId, this.textarea, this.name);
            // if(responses){
            //     this.$message({
            //         message: '修改成功',
            //         type: 'success'
            //     });
            // }
            // else{
            //     this.$message({
            //         message: '修改失敗',
            //         type: 'error'
            //     });
            // }
        },
        async getAsyncCardInfo(CardId: string) {
            this.selection = this.ListId;
            const responses = await getCardInfo(CardId);
            this.textarea = responses.data.desc;
        },
        async getAsyncTrelloListById() {
            const responses = await getTrelloListById("123", this.$route.params.boardId);
            for(const response in responses.data){
                this.optionList.push({listId: responses.data[response].listId, name: responses.data[response].listName});
            }
        },
        async getAsyncTrelloCardById(){
            const responses = await getTrelloCardById("123", this.ListId);

            this.cardList = [];
            for(const response in responses.data){
                this.cardList.push({id: responses.data[response].cardId, name: responses.data[response].cardName});
            }
        },
        addNewCard(){
            this.addAsyncNewCardToList();
            this.newCardName = "";
        },
        async addAsyncNewCardToList(){
            const responses = await addNewCardToList("123", this.ListId, this.newCardName);
            this.getAsyncTrelloCardById();
        },
    }
});
</script>

<style lang="scss">
.border{
    border-width: 1px;
    border-style:solid;
    border-color: rgb(166, 177, 177);
    padding: 5px;
    border-radius: 3px;
    margin: 10px;
}
.action{
    width: 70%;
    border-radius: 5px;
}
.action:hover{
    background-color: rgba(76, 83, 88, 0.199);
}
.card-width{
    width: 300px;
}
.card-style{
    margin-top: 10px;
}
.card-style{
    cursor: pointer;
}
.add-card{
    margin-top: 15px;
    width: 100%;
    height: 25px;
    border-radius: 5px;
    padding-top: 5px;
}
.add-card:hover{
    background-color: rgba(76, 83, 88, 0.199);
    cursor: pointer;
}
</style>
  