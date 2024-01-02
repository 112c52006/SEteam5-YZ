<template>
<el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>

<el-dialog
                title="CardIInfo"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
                <el-table :data = "cardList">
                    <el-table-column property="name" label="Name" width="150"></el-table-column>
                    <el-table-column property="id" label="ID" width="200"></el-table-column>
                </el-table>
                <el-form :model="form">
                    <el-form-item label="Box">
                        <el-select v-model="form.region" placeholder="移動">
                            <el-option label="待辦事項" value="1"></el-option>
                            <el-option label="進行中" value="2"></el-option>
                            <el-option label="待review" value="3"></el-option>
                            <el-option label="完成" value="4"></el-option>
                            <el-option label="Trello開發資源參考區域" value="5"></el-option>
                            <el-option label="Task 2 front 註記" value="6"></el-option>
                        </el-select>
                        </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>
                <el-col :span="4">
                    <div class="el-icon-more-outline action"></div>
                </el-col>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        form: {region: ''},
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    }
};
</script>
