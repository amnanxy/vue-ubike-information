<template>
  <p>
    站點名稱搜尋: <input type="text" v-model="searchStop">
  </p>
</template>

<script>
export default {
  name: "Search",
  props: {
    stops: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchStop: '',
    }
  },
  watch: {
    filteredStops() {
      this.$emit("update", this.filteredStops);
    }
  },
  computed:{
    filteredStops() {
      return this.stops.filter(stop => stop.sna.includes(this.searchStop));
    }
  }
}
</script>