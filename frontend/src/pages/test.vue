<template>
  <div>
    <div>This is a test page</div>
    <div v-for="(item, i) in books" :key="i">
      {{ item.authors }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      books: Array,
    };
  },
  mounted() {
    axios.get('http://localhost:8080/api/books').then((res) => {
      this.books = res.data;
    });
  },
};
</script>

<style></style>
