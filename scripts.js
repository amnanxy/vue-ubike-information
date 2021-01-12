const vm = Vue.createApp({
    data() {
        return {
            ubikeStops: [],
            searchStop: '',
            isAscSort: true,
            sortProp: '',
            currentPageNumber: 1,
            pageSize: 20,
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
        showPage(pageNumber) {
            this.currentPageNumber = pageNumber;
        }
    },
    watch: {
        filteredStops() {
            this.currentPageNumber = 1;
        }
    },
    computed: {
        filteredStops() {
            if (this.searchStop === '') {
                return [...this.ubikeStops];
            } else {
                return this.ubikeStops.filter(stop => stop.sna.includes(this.searchStop));
            }
        },
        sortedStops() {
            let prop = this.sortProp;
            let stops = this.filteredStops;

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
            let startIdx = (this.currentPageNumber - 1) * this.pageSize;
            let endIdx = this.currentPageNumber * this.pageSize - 1;

            return this.sortedStops.slice(startIdx, endIdx);
        },
        totalPage() {
            return Math.ceil(this.filteredStops.length / this.pageSize);
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
}).mount('#app');