<template>
  <v-app>
    <v-toolbar max-height="60" color="primary">
      <router-link to="/">
        <v-toolbar-title class="font">나의 다이어리1</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <div v-if="$cookies.get('user_name')">
        <v-btn class="font" color="primary" depressed>{{ $cookies.get('user_name') }}님</v-btn>
        <v-btn class="font" color="primary" depressed @click="logout">로그아웃</v-btn>
      </div>
      <div v-else>
        <v-btn class="font" color="primary" depressed to="/login">로그인</v-btn>
        <v-btn class="font" color="primary" depressed to="/register">회원가입</v-btn>
      </div>
    </v-toolbar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    logout() {
      this.$store.commit('removeSchedule', []);
      this.$cookies.remove('user_name');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.font {
  color: white;
}
</style>
