<template>
  <div justify="space-around">
    <v-menu bottom left :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          :value="startToEnd"
          label="시간"
          placeholder="00:00"
          @click="openPicker"
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-dialog v-model="dialog" width="600">
        <v-card color="white" width="600">
          <div class="d-flex flex-row justify-space-around">
            <div>
              <h2>Start:</h2>
              <v-time-picker v-model="start" :max="end"></v-time-picker>
            </div>
            <div>
              <h2>End:</h2>
              <v-time-picker v-model="end" :min="start"></v-time-picker>
            </div>
          </div>
          <div>
            <v-btn @click="test">저장</v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      start: null,
      end: null,
      dialog: false,
    };
  },
  computed: {
    startToEnd() {
      if (this.start === null || this.end === null) return '00:00~00:00';
      return `${this.start}~${this.end}`;
    },
  },
  methods: {
    openPicker() {
      this.dialog = true;
    },
    test() {
      this.$emit('submit', this.startToEnd);
      this.dialog = false;
    },
  },
  watch: {
    start(value) {
      console.log(value);
      let date = new Date().toISOString().substring(0, 11);
      date += value;
      console.log(date);
    },
  },
};
</script>
v-model로 값받아서 저장하는게 문제인거잖아 start값이랑 end값이 있는데 start값만 둘다 옮겨야하는거지
