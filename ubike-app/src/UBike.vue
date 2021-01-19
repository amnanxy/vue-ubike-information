<template>
  <h1>YouBike 臺北市公共自行車即時資訊</h1>
  <!--  <search :stops="ubikeStops" @search=""></search>-->
  <p>
    站點名稱搜尋: <input type="text" v-model="searchStop">
  </p>

  <table class="table table-striped">
    <thead>
    <tr>
      <th>#</th>
      <th>場站名稱</th>
      <th>場站區域</th>
      <th>
        <span class="link" @click="sortBy('sbi')">目前可用車輛</span>
      </th>
      <th>
        <span class="link" @click="sortBy('tot')">總停車格</span>
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
  <pagination :total="total" :page-size="20" @update="showItem"></pagination>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: "UBike",
  components: {
    pagination: Pagination
  },
  data() {
    return {
      ubikeStops: [],

      searchStop: '',
      
      isAscSort: true,
      sortProp: '',

      total: 0,
      stopStartIdx: 0,
      stopEndIdx: 0,
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
    showItem(startIdx, endIdx) {
      this.stopStartIdx = startIdx;
      this.stopEndIdx = endIdx;
    },
  },
  watch: {
    filteredStops() {
      this.total = this.filteredStops.length;
    },
  },
  computed: {
    filteredStops() {
      return this.ubikeStops.filter(stop => stop.sna.includes(this.searchStop));
    },
    sortedStops() {
      let prop = this.sortProp;
      let stops = [...this.filteredStops];

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
  created() {

    // 欄位說明請參照:
    // http://data.taipei/opendata/datalist/datasetMeta?oid=8ef1626a-892a-4218-8344-f7ac46e1aa48

    // sno：站點代號、 sna：場站名稱(中文)、 tot：場站總停車格、
    // sbi：場站目前車輛數量、 sarea：場站區域(中文)、 mday：資料更新時間、
    // lat：緯度、 lng：經度、 ar：地(中文)、 sareaen：場站區域(英文)、
    // snaen：場站名稱(英文)、 aren：地址(英文)、 bemp：空位數量、 act：全站禁用狀態

    fetch('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz')
        .then(res => res.json())
        .then(res => {
          // 將 json 轉陣列後存入 this.ubikeStops
          this.ubikeStops = Object.keys(res.retVal).map(key => res.retVal[key]);
        });

  }
}
</script>

<style>
@import "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css";

body {
  padding: 1em;
}

.link {
  color: blue;
  cursor: pointer;
}

.page-number {
  margin: 10px;
  display: inline-block;
}
</style>