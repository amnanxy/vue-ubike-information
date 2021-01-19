<template>
  <h1>YouBike 臺北市公共自行車即時資訊</h1>
  <!--  <search :stops="ubikeStops" @search=""></search>-->
  <search :stops="ubikeStops" @update="setFilteredStops"></search>
  <ubike-table :stops="filteredStops" :stop-start-idx="stopStartIdx" :stop-end-idx="stopEndIdx"></ubike-table>
  <pagination :total="total" :page-size="20" @update="showItem"></pagination>
</template>

<script>
import Search from "@/components/Search";
import UbikeTable from "@/components/UbikeTable";
import Pagination from "@/components/Pagination";

export default {
  name: "UBike",
  components: {
    search: Search,
    ubikeTable: UbikeTable,
    pagination: Pagination,
  },
  data() {
    return {
      ubikeStops: [],
      filteredStops: [],
      total: 0,
      stopStartIdx: 0,
      stopEndIdx: 0,
    }
  },
  methods: {
    setFilteredStops(stops) {
      this.filteredStops = stops;
      this.total = this.filteredStops.length;
    },
    showItem(startIdx, endIdx) {
      this.stopStartIdx = startIdx;
      this.stopEndIdx = endIdx;
    },
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