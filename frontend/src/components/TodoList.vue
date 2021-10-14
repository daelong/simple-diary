<template>
  <div>
    <v-text-field v-model="todoInput" label="Todo" hide-details @keyup.enter="addTodo"></v-text-field>
    <v-list>
      <v-list-item v-for="(item, idx) in todoList" :key="idx">
        <div v-if="!item.edit" class="d-flex flex-row justify-space-between" style="width: 100%;">
          <v-list-item-icon>
            <v-icon v-text="icon.mdiClose" @click="deleteTodo(item)"></v-icon>
          </v-list-item-icon>
          <v-list-item-content :class="{ cleared: item.clear === true }">
            <v-list-item-title v-text="item.content"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon v-text="icon.mdiPencil" @click="item.edit = true"></v-icon>
          </v-list-item-icon>
          <v-list-item-icon>
            <v-icon v-text="icon.mdiCheck" @click="item.clear = !item.clear"></v-icon>
          </v-list-item-icon>
        </div>
        <v-text-field v-else v-model="item.content" hide-details @keyup.enter="item.edit = false"></v-text-field>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mdiClose, mdiCheck, mdiPencil } from '@mdi/js';

export default {
  props: {
    todoList: Array,
  },
  data() {
    return {
      todoInput: '',
      icon: {
        mdiClose,
        mdiCheck,
        mdiPencil,
      },
    };
  },
  methods: {
    addTodo() {
      if (this.todoInput !== '') {
        this.$store.commit('addTodoList', { content: this.todoInput, clear: false, edit: false });
        this.todoInput = '';
      }
    },
    deleteTodo(item) {
      this.$store.getters.schedule.todoList.splice(this.$store.getters.schedule.todoList.indexOf(item), 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.v-list-item {
  background: rgba(0, 82, 204, 0.1);
  margin-top: 10px;
  .v-list-item__title {
    color: blue;
  }
}
.cleared {
  text-decoration: line-through;
}
</style>
