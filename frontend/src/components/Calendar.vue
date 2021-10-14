<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @contextmenu:date="viewDay"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="addSchedule"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          style="width: 50%"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <h3 v-if="selectedEvent.start">
                {{ selectedEvent.start.substring(11, 16) }} ~ {{ selectedEvent.end.substring(11, 16) }}
              </h3>
            </v-card-text>
            <v-textarea
              :value="selectedEvent.note"
              label="Note"
              background-color="amber lighten-4"
              color="orange orange-darken-4"
              outlined
              hide-details
            ></v-textarea>
            <TodoList :todoList="selectedEvent.todoList"></TodoList>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <scheduleForm v-if="dialog" :date="date" @submit="enrollSchedule"></scheduleForm>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import scheduleForm from '@/components/scheduleForm.vue';
import TodoList from '@/components/TodoList.vue';

export default {
  components: {
    scheduleForm,
    TodoList,
  },
  data: () => ({
    focus: '',
    date: '',
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    dialog: false,
  }),

  mounted() {
    this.$refs.calendar.checkChange();
    if (this.$cookies.get('user_name') === null) {
      this.events = [];
    } else {
      this.events = this.$store.getters.events;
    }

    console.log(`calendar ${this.events}`);
  },
  // computed: {
  //   events() {
  //     return this.$store.getters.events;
  //   },
  // },
  methods: {
    enrollSchedule(schedule) {
      this.dialog = false;
      // this.$store.commit('addSchedule', [
      //   {
      //     ...schedule,
      //     color: this.colors[this.rnd(0, this.colors.length - 1)],
      //     timed: schedule.start,
      //   },
      // ]);

      // this.events.push(this.$store.getters.event.schedule);
      this.$store.dispatch('addSchedule', {
        schedule: {
          ...schedule,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: schedule.start,
        },
        id: this.$cookies.get('user_name'),
      });
    },
    addSchedule({ date }) {
      this.date = date;
      this.dialog = true;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = '';
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() => {
          this.selectedOpen = true;
        });
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => open());
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i += 1) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        // console.log(first);
        console.log(second);

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        });
      }

      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>
