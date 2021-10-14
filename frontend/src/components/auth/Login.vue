<template>
  <div class="d-flex flex-row justify-center align-center" style="height: 90%">
    <v-card width="500" class="d-flex flex-column">
      <v-card-title>로그인</v-card-title>
      <v-card-text>
        <v-row class="align-center">
          <v-col cols="2">
            아이디
          </v-col>
          <v-col>
            <v-text-field v-model="user.id" hide-details></v-text-field>
          </v-col>
        </v-row>
        <v-row class="align-center">
          <v-col cols="2">
            비밀번호
          </v-col>
          <v-col>
            <v-text-field
              v-model="user.password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required]"
              :type="showPassword ? 'text' : 'password'"
              name="input-10-1"
              hint="At least 8 characters"
              counter
              @click:append="showPassword = !showPassword"
              @keyup.enter="login"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="justify-end">
          <v-col class="find-auth" cols="4">아이디/비밀번호 찾기</v-col>
        </v-row>
      </v-card-text>
      <v-btn color="primary" @click="login">로그인</v-btn>
    </v-card>
  </div>
</template>

<script>
// import axios from 'axios';

export default {
  data() {
    return {
      user: {
        id: null,
        password: null,
      },
      showPassword: false,
      rules: {
        required: (value) => !!value || 'Required.',
      },
    };
  },

  methods: {
    async login() {
      await this.$store.dispatch('login', this.user);
      if (this.$store.getters.loginedId) {
        this.$cookies.set('user_name', this.$store.getters.loginedId, 60 * 60 * 1);
        await this.$store.dispatch('getEvent', this.$store.getters.loginedId);
        this.$router.push('/');
      } else {
        alert('아이디, 비밀번호를 확인해주세요');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.find-auth {
  &:hover {
    color: $primary-color;
    cursor: pointer;
  }
}
</style>
