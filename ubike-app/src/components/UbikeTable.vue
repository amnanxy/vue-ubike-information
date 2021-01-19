<template>
  <table class="table table-striped">
    <thead>
    <tr>
      <th>#</th>
      <th>場站名稱</th>
      <th>場站區域</th>
      <th>
        <span class="link" @click="sortBy('sbi')">
          目前可用車輛
          <template v-if="sortProp === 'sbi'">
            <i class="fa fa-sort-asc" aria-hidden="true" v-show="isAscSort"></i>
            <i class="fa fa-sort-desc" aria-hidden="true" v-show="!isAscSort"></i>
          </template>
        </span>
      </th>
      <th>
        <span class="link" @click="sortBy('tot')">
          總停車格
          <template v-if="sortProp === 'tot'">
            <i class="fa fa-sort-asc" aria-hidden="true" v-show="isAscSort"></i>
            <i class="fa fa-sort-desc" aria-hidden="true" v-show="!isAscSort"></i>
          </template>
        </span>
      </th>
      <th>資料更新時間</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="s in pagingStops" :key="s.sno">
      <td>{{ s.sno }}</td>
      <td>{{ s.sna }}</td>
      <td>{{ s.sarea }}</td>
      <td>{{ s.sbi }}</td>
      <td>{{ s.tot }}</td>
      <td>{{ timeFormat(s.mday) }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "UbikeTable",
  props: {
    stops: {
      type: Array,
      required: true
    },
    stopStartIdx: {
      type: Number,
      default: 0
    },
    stopEndIdx: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER
    },
  },
  data() {
    return {
      isAscSort: true,
      sortProp: '',
    }
  },
  computed: {
    sortedStops() {
      let prop = this.sortProp;
      let stops = [...this.stops];

      if (!prop) {
        return stops;
      }

      if (this.isAscSort) {
        return stops.sort((a, b) => a[prop] - b[prop]);
      } else {
        return stops.sort((a, b) => b[prop] - a[prop]);
      }
    },
    pagingStops() {
      return this.sortedStops.slice(this.stopStartIdx, this.stopEndIdx);
    }
  },
  methods: {
    timeFormat(t) {
      var date = [], time = [];

      date.push(t.substr(0, 4));
      date.push(t.substr(4, 2));
      date.push(t.substr(6, 2));
      time.push(t.substr(8, 2));
      time.push(t.substr(10, 2));
      time.push(t.substr(12, 2));

      return date.join("/") + ' ' + time.join(":");
    },
    sortBy(prop) {
      if (this.sortProp !== prop) {
        this.sortProp = prop;
      } else {
        this.isAscSort = !this.isAscSort;
      }
    },
  }
}
</script>

<style scoped>

</style>