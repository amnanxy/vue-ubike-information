<template>
  <div style="text-align: center">
    <div v-for="number in totalPage" :key="number" class="page-number">
      <span :class="{'link': number !== pageNumber}" @click="showPage(number)">
        {{ number }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    pageSize: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      pageNumber: 1,
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  watch: {
    totalPage() {
      this.showPage(1);
    },
  },
  methods: {
    showPage(pageNumber) {
      this.pageNumber = pageNumber;

      let startIdx = (this.pageNumber - 1) * this.pageSize;
      let endIdx = this.pageNumber * this.pageSize - 1;

      this.$emit("update", startIdx, endIdx);
    }
  },
}

</script>