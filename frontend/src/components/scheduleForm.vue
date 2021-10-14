<template>
  <v-form class="d-flex flex-column justify-center" ref="form" lazy-validation>
    <v-container>
      {{ date }}
      <v-text-field v-model="schedule.name" label="제목" required></v-text-field>
      <my-time-picker @submit="getTime"></my-time-picker>
      <v-textarea v-model="schedule.note" name="note" label="노트"></v-textarea>
      <v-btn color="error" class="mr-4" @click="submit">
        등록
      </v-btn>
    </v-container>
  </v-form>
</template>
<script>
export default {
  props: {
    date: null,
  },
  data() {
    return {
      schedule: {
        name: null,
        start: null,
        end: null,
        note: null,
        todoList: [],
      },
    };
  },
  methods: {
    submit() {
      // this.$store.commit('addSchedule', { ...this.schedule, date: this.date });
      // console.log(this.$store.getters.schedule);
      console.log('scheduleform1');
      this.$emit('submit', this.schedule);
      console.log('scheduleform1');
    },
    getTime(value) {
      const startTime = new Date(this.date).toISOString().substring(0, 11) + value.substring(0, 5);
      this.schedule.start = startTime;
      const endTime = new Date(this.date).toISOString().substring(0, 11) + value.substring(6, 11);
      this.schedule.end = endTime;
    },
  },
};
</script>
