<template>
  <v-card max-width="374" height="700" class="pt-5">
    <v-card-text>
      <div class="text-h5 fon-weight-bolo" >Project</div>
      <div style="height: 10px;"></div>
      <!-- image -->
      <!-- 專案封面 -->
      <v-avatar size="192">
        <img class="mb-2" height="250" contain :src="coverimageurl" @click="openImageDialog"/>
      </v-avatar>
      <!-- 修改圖片的彈出對話框 -->
      <el-dialog
        :visible="dialogVisible"
        title="修改專案封面"
        @close="dialogVisible = false"
      >
        <!-- 封面上傳的部分 -->
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          action="#"
          :http-request="uploadHttpRequest"
          :show-file-list="true"
          :data="{ projectId: projectId }"
          :before-upload="beforeUpload"
          :limit="1"
        >
          <el-button type="primary" size="small">上傳新封面</el-button>
        </el-upload>
      </el-dialog>
      <!-- image end -->
      <div style="height: 20px;"></div>
      <!-- button -->
      <v-row>
        <v-col v-if="isOwner" lg="4" class="d-flex align-begin pt-1">
          <InviteUser
            vCardTitle="Invite User"
            vTextLabel="User Name"
            @clickInvitation="clickInvatation($event)"
            :userInfo="userAccounts"
            @invite="send($event)"
          />
        </v-col>
        <v-col lg="4" class="d-flex align-begin pt-1">
          <ProjectMemberTable
            :projectOwnerId="projectOwnerId"
            :projectOwnerName="projectOwnerName"
            :projectId="projectId"
            :currentUserId="user.id"
            :tableData="projectMember"
            @deleteProjectMember="getProjectMemberWithutOwner"
          />
        </v-col>
        <v-col lg="4" class="d-flex align-begin pt-1">
          <BindTrello @msgSnackBar="msgSnackBar" />
        </v-col>
      </v-row>
      <!-- button end -->
      <v-divider class="mt-4"></v-divider>
      <v-card class="pa-4">
        <div class="text-h5 fon-weight-bolo">Introduction</div>
        <v-edit-dialog :return-value.sync="projectinfo" @save="saveProjectInfo">
            <div class="text-h6">{{ projectinfo }}</div>
            <template v-slot:input>
              <v-text-field
                v-model="projectinfo"
                :rules="[max100chars]"
                label="Edit Introduction"
              ></v-text-field>
            </template>
        </v-edit-dialog>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Vue from "vue";
  import store from "@/store";
  import { editProjectCover} from "@/apis/projects.ts";
  import { getProject, getProjectMember } from "@/apis/projects";
  import { getRepository} from "@/apis/repository";
  import { getUserInfo, isCurrentUserProjectOwner } from "@/apis/user";
  import { invite, sendInvitation } from "@/apis/notification";
  import InviteUser from "@/components/InviteUser.vue";
  import ProjectMemberTable from "@/components/ProjectMemberTable.vue";
  import BindTrello from "@/components/BindTrello.vue";

  export default Vue.extend({
    components: {
      BindTrello,
      InviteUser,
      ProjectMemberTable,
    },
    props: {
      projectId: {type : [Number, String] },
      projectInfo: { type: String },
      coverImageUrl: { type: String }
    },
    data() {
      return {
        projectinfo: this.projectInfo,
        user: { type: Object, id: "" },
        repositories: [{ type: Object, id: "", name: "", test: "" }],
        dialog: false,
        projectName: "",
        projectIntro:"",
        projectOwnerId: "",
        projectOwnerName: "",
        projectMember: [{ type: Object, id: "", name: "", avatarUrl: "" }],
        msg: "",
        snackBar: false,
        snackBarColor: "",
        isOwner: false,
        userAccounts: [],
        searchbarLength: 7,
        coverimageurl: this.coverImageUrl,
        max100chars: function (v: any) {
          return v.length <= 100 || "Input too long!";
        },
        dialogVisible: false,
        store: store
      };
    },
    async created() {
      this.user = (await getUserInfo())["data"];
      this.repositories = (await getRepository(this.projectId))["data"];
      this.isOwner = (await isCurrentUserProjectOwner(this.projectId))["data"].success;
      await this.getProjectInfo();
      await this.getProjectMemberWithutOwner();
      if (!this.isOwner) this.searchbarLength = 10;
    },
    methods: {
      async getProjectMemberWithutOwner() {
        const result = await getProjectMember(Number(this.projectId));
        this.projectMember = result["data"];
        this.projectMember = this.projectMember.filter(
          (item) => item.id != this.projectOwnerId
        );
      },
      saveProjectInfo() {
        this.$emit("save",this.projectinfo);
      },
      async getProjectInfo() {
        const result = (await getProject(Number(this.projectId)))["data"];
        this.projectIntro  = result.intro;
        this.projectOwnerId = result.ownerId;
        this.projectOwnerName = result.ownerName;
        this.projectName = result.name;
      },
      async msgSnackBar(success: boolean, msg: string) {
        this.msg = msg;
        this.snackBar = true;
        this.snackBarColor = success ? "green" : "red";
        await this.getResitories();
      },
      async getResitories() {
        this.repositories = (await getRepository(this.projectId))["data"];
      },
      async send(applicantId: any) {
        const result = await sendInvitation(
          applicantId,
          Number(this.projectId)
        );
        this.dialog = false;
        this.msg = result["data"].message;
        this.snackBar = true;
        this.snackBarColor = result["data"].success ? "green" : "red";
      },
      async clickInvatation(projectId: number) {
        invite(Number(this.projectId)).then((res) => {
          this.userAccounts = res.data;
        });
      },
      openImageDialog() {
      // 點擊圖片時打開對話框
        this.dialogVisible = true;
      },
      beforeUpload(file : any) {
      // 在上傳之前的操作，例如檢查文件類型、大小等
        const isImage = file.type.startsWith('image/jpeg');
        if (!isImage) {
          this.$message.error('只能上傳JPG！');
          return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('圖片大小不能超過2MB！');
          return false;
        }
        return true;
      },
      
      async uploadHttpRequest(file : any){
        await editProjectCover(Number(this.projectId), file.file);
        await this.$emit("loadImage");
        
        //清除UPLOAD LIST
        const uploadList:any = this.$refs.uploadRef;
        uploadList.clearFiles();

        this.dialogVisible = false;
      },
    },
    watch: {
      projectInfo(newVal) {
        this.projectinfo = newVal;
      },
      coverImageUrl(newVal) {
        this.coverimageurl = newVal;
      },
    },
  });
</script>

<style>
  .project-profile {
    background-color: lightgray;
    width: 100%;
    height: 55vh;
    border-radius: 5px;
    padding: 10px;
  }
  .upload-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 300px;
  border: 1px dashed #00c257;
  border-radius: 6px;
  overflow: hidden;
  }
</style>