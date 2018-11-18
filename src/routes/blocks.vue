<template>
    <!-- https://etherscan.io/blocks -->
    <!-- 这是block-list页面 -->
    <div class="vue-blocks">
        <vue-bread :arr=breadcrumb title="Blocks"></vue-bread>

        <div class="container mt20">
            <div class="align-items-center info-and-pagination row">
                <div class=col>Showing Block (#{{ heightFrom }} to #{{ heightTo }}) out of {{ totalBlocks }} total blocks</div>
                <vue-pagination class=col-auto :current=currentPage :total=totalPage :first=onFirst :last=onLast :next=onNext :prev=onPrev :to=onTo style="margin-bottom:5px;"></vue-pagination>
            </div>
            <div class="scroll">
                <table class="mt20 table">
                    <tr>
                        <th>Height</th>
                        <th class="text-right block-td-width">Age</th>
                        <th>txn</th>
                        <th>Mined</th>
                        <th class="text-right "><span class="block-td-width">Gas Reward</span></th>
                        <th class="text-right "><span class="block-td-width">GasLimit </span></th>
                        <th class="text-right "> <span style="width:90px;display:inline-block;"> Avg.GasPrice</span></th>
                    </tr>
                    <tr v-for="(o,index) in arr" :key="index">
                        <td>
                            <router-link :to='fragApi + "/block/" + o.height'>{{ o.height }}</router-link>
                        </td>
                        <td class=time>
                            <div class="text-right block-td-width">{{ timeConversion( Date.now() - o.timestamp) }} ago</div>
                            <div>{{ new Date(o.timestamp).toString() }} | {{ o.timestamp }}</div>
                        </td>
                        <td>
                            <router-link :to='fragApi + "/txs?block=" + o.height'>{{ o.txnCnt }}</router-link>
                        </td>
                        <td class=monospace>
                            <router-link :to='fragApi + "/address/" + o.miner.hash' class="mined-width">{{ o.miner.alias || o.miner.hash }}</router-link>
                        </td>
                        <td class="text-right"><div class="block-td-width">5 tch</div> </td>
                        <td class="text-right"><div class="block-td-width">{{ numberAddComma(o.gasLimit) }}</div> </td>
                        <td class="text-right"><div class="block-td-width">{{ toWei(o.avgGasPrice) }}</div> </td>
                    </tr>
                </table>
            </div>
            
            <vue-pagination :current=currentPage right=1 :total=totalPage :first=onFirst :last=onLast :next=onNext :prev=onPrev :to=onTo></vue-pagination>
        </div>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility");

    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-pagination": require("@/components/vue-pagination").default
        },
        data() {
            return {
                arr: [],
                breadcrumb: [
                    { text: "Home", to: "/" },
                    { text: "Blocks", to: "" }
                ],
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                heightFrom: 0,
                heightTo: 0,
                totalBlocks: 0,
                totalPage: 0
            };
        },
        methods: {
            nthPage() {
                var p = this.$route.query.p || 1;

                if (p == this.currentPage)
                    console.log("nthPage - 请求的第", p, "页正是当前页, 忽略此次调用");
                else {
                    this.$root.showModalLoading = true;

                    api.getBlock({ p }, o => {

                        this.$root.showModalLoading = false;
                        this.arr = o.data;
                        this.currentPage = o.page;
                        this.totalPage = o.totalPage;
                        this.totalBlocks = o.totalCount;

                        if (this.arr.length) {
                            this.heightFrom = this.arr[0].height;
                            this.heightTo = this.arr[this.arr.length - 1].height;
                        } else {
                            this.heightFrom = 0;
                            this.heightTo = 0;
                        }
                    }, xhr => {
                        console.log(xhr);
                        this.$root.showModalLoading = false;
                        this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404!" + this.$route.fullPath);
                    });
                }
            },
            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            onFirst() {
                this.$router.push({
                    path: this.$route.path,
                    query: { p: 1 }
                });
            },
            onLast() {
                this.$router.push({
                    path: this.$route.path,
                    query: { p: this.totalPage }
                });
            },
            onNext() {
                this.$router.push({
                    path: this.$route.path,
                    query: { p: this.currentPage + 1 }
                });
            },
            onPrev() {
                this.$router.push({
                    path: this.$route.path,
                    query: { p: this.currentPage - 1 }
                });
            },
            onTo(n) {
                this.$router.push({
                    path: this.$route.path,
                    query: { p: n }
                });
            },
            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            toWei(n) {
                return utility.toWei(n);
            }
        },
        mounted() {
            this.nthPage();
        },
        watch: {
            $route() {
                this.nthPage();
            }
        }
    };
</script>
<style >
    /* 这是新增加的样式 */
    @media (max-width: 992px) {
        .vue-blocks .scroll{
            width: 100vw;
            overflow-x: auto;
        }
    }
     .vue-blocks .block-td-width{
        display:inline-block;
        width: 80px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .vue-blocks .mined-width{
        display: inline-block;
        max-width: 300px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>