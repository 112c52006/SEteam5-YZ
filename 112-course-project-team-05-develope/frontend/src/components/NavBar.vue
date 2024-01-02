<template>
  <v-app-bar dense dark>
    <v-toolbar-title>
      <router-link to="/project" class="routercolor">PMS</router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <Notification v-if="isAuth" />
      <router-link to="/project">
        <div class="user-info">
          
            <img class="avatar" height="30" contain :src="user.avatarUrl" />
            <span class="username">{{ user.name }}</span>
          
        </div>
      </router-link>
    <v-btn @click="logout" v-if="isAuth">
      <v-icon>mdi-logout</v-icon>
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import store from "@/store";
import Vue from "vue";
import Notification from "@/components/Notification.vue";
import { getUserInfo, editUserName } from "@/apis/user";

export default Vue.extend({
  components: {
    Notification
  },
  data() {
    return {
      user: { id: "", name: "", avatarUrl: "" },
    };
  },
  async created() {
    await this.fetchUserInfo();
  },
  computed: {
    isAuth() {
      return store.auth.isAuthenticated;
    }
  },
  methods: {
    async fetchUserInfo() {
      this.user = (await getUserInfo())["data"];
      console.log(this.user);
    },
    logout() {
      // 在登出时清空用户信息
      this.user = { id: "", name: "", avatarUrl: "" };
      store.auth.logout();
    }
  },
  watch: {
    // 使用 watch 监听路由变化
    '$route': 'fetchUserInfo'
  }
});
</script>
<style>
.user-info {
  display: flex;
  align-items: center;
  margin-left: 15px;
}

.avatar {
  margin-right: 5px;
  border-radius: 50%; /* 圓形頭像 */
}

.username {
  font-weight: bold;
  color: white;
}
</style>