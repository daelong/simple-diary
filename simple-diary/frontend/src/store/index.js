import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    events: [],
    user: {
      name: null,
      id: null,
      password: null,
    },
    loginedId: null,
    registered: null,
    checkId: null,
  },
  getters: {
    events: (state) => state.events,
    todoList: (state) => state.schedule.todoList,
    username: (state) => state.user.name,
    loginedId: (state) => state.loginedId,
    registered: (state) => state.registered,
    checkId: (state) => state.checkId,
  },
  mutations: {
    addTodoList: (state, payload) => {
      state.schedule.todoList.push(payload);
    },

    getSchedule: (state, payload) => {
      state.events.push(payload);
    },
    removeSchedule: (state, payload) => {
      state.events = payload;
    },
    loginedId: (state, payload) => {
      state.loginedId = payload;
    },
    registered: (state, payload) => {
      state.registered = payload;
    },
    checkId: (state, payload) => {
      state.checkId = payload;
    },
  },
  actions: {
    register: async (context, payload) => {
      await axios
        .post('/api/auth/register/local', payload)
        .then(() => {
          context.commit('registered', true);
        })
        .catch(() => {
          context.commit('registered', false);
        });
    },
    login: async (context, payload) => {
      await axios
        .post('/api/auth/login/local', payload)
        .then((res) => {
          context.commit('loginedId', res.data.id);
        })
        .catch(() => {
          context.commit('loginedId', false);
        });
    },
    checkId: async (context, payload) => {
      await axios.get(`/api/auth/exists/id/${payload}`).then((res) => {
        context.commit('checkId', res.data.exists);
      });
    },
    addSchedule: (context, payload) => {
      axios.post('/api/events/', payload).then((res) => {
        context.commit('getSchedule', res.data.schedule);
      });
    },
    getEvent: async (context, payload) => {
      await axios.get(`/api/events/${payload}`).then((res) => {
        res.data.forEach((element) => {
          context.commit('getSchedule', element.schedule);
        });
      });
    },
  },
});
