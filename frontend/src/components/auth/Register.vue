<template>
  <div class="d-flex flex-row justify-center align-center" style="height: 90%">
    <v-card width="500" class="d-flex flex-column">
      <v-card-title>회원가입</v-card-title>
      <v-card-text>
        <v-row class="align-center">
          <v-col cols="2">
            이름
          </v-col>
          <v-col>
            <v-text-field v-model="user.name" hide-details></v-text-field>
          </v-col>
        </v-row>
        <v-row class="align-center">
          <v-col cols="2">
            아이디
          </v-col>
          <v-col>
            <v-text-field v-model="user.id" hide-details></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-btn @click="overlapIdCheck">중복검사</v-btn>
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
              :rules="[rules.required, rules.min]"
              :type="showPassword ? 'text' : 'password'"
              name="input-10-1"
              hint="At least 8 characters"
              counter
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-btn color="primary" @click="register">회원가입</v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: null,
        id: null,
        password: null,
      },
      showPassword: false,
      rules: {
        required: (value) => !!value || 'Required.',
        min: (v) => v.length >= 8 || 'Min 8 characters',
      },
    };
  },
  methods: {
    async register() {
      await this.$store.dispatch('register', this.user);
      if (this.$store.getters.registered) {
        alert('회원가입이 완료되었습니다. 로그인을 진행해주세요');
        this.$router.push('/login');
      } else {
        alert('회원가입이 실패했습니다. 다시 진행해주세요');
      }
    },
    async overlapIdCheck() {
      await this.$store.dispatch('checkId', this.user.id);
      if (!this.$store.getters.checkId) {
        alert('id 사용이 가능핣니다.');
      } else {
        alert('id가 중복되었습니다.');
      }
    },
  },
};
</script>
일단 스토어 사용하자
