
<template>
    <!-- https://etherscan.io/txs -->
    <!-- transition-list -->
    <div class="vue-txs">
        <vue-bread  :arr=breadcrumb title=Transactions></vue-bread>

        <div class="container mt20">
            <div class="align-items-center info-and-pagination mt20 account-info">
                <div class="info shink-1">{{ totalTxs }} transactions found (showing the last {{ maxDisplayCnt }} records)</div>
                <vue-pagination class="shink-1"  :current=currentPage  :total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext
                    v-on:prev=onPrev v-on:to=onTo></vue-pagination>
            </div>
            <div class="scroll">
                <table class="mt20 table table-scroll">
                    <tr>
                        <th>TxHash</th>
                        <th>Block</th>
                        <th class="text-right ">Age</th>
                        <th>From</th>
                        <th></th>
                        <th>To</th>
                        <th class="text-right ">Value</th>
                        <th class="text-right ">TxFee</th>
                    </tr>

                    <tr v-for="(o,index) in arr" :key="index">
                        <td v-if="o.status == 0" class=fail>
                            <router-link  :to='fragApi + "/tx/" + o.hash'>{{ o.hash }}</router-link>
                        </td>
                        <td class=tdxxxwddd v-if="o.status != 0">
                            <router-link  :to='fragApi + "/tx/" + o.hash'>{{ o.hash }}</router-link>
                        </td>

                        <td>
                            <router-link  :to='fragApi + "/block/" + o.block.height'>{{ o.block.height }}</router-link>
                        </td>
                        <!--
                        <td>
                            <template v-if=txs.isPending>
                                <span> pending </span>
                            </template>
                            <template v-else>
                                <router-link v-if=o.block  :to='fragApi + "/block/" + o.block.height'>{{o.block.height}}</router-link>
                            </template>
                            <router-link  :to='fragApi + "/block/" + o.block.height'>{{ o.block.height }}</router-link>
                        </td>
                        -->
                        <td class=time>
                            <div class="text-right td-width">{{ timeConversion(Date.now() - o.timestamp) }} ago</div>
                            <div>{{ new Date(o.timestamp).toString() }} | {{ o.timestamp }}</div>
                        </td>
                        <td class=tdxxxwddd>
                            <router-link  :to='fragApi + "/address/" + o.from.hash'>{{ o.from.hash }}</router-link>
                        </td>
                        <td>
                            <span class="fa fa-arrow-right" aria-hidden=true></span>
                        </td>
                        <td class=tdxxxwddd>
                            <router-link  :to='fragApi + "/address/" + o.to.hash'>{{ o.to.hash }}</router-link>
                        </td>
                        <td class="text-right "> <span class="td-width">{{ easyNumber(o.value/1000000000000000000) }} Tch</span></td>
                        <td class="text-right"><span class=" td-width">{{ toWei(o.txFee) }}</span></td>
                    </tr>
                </table>
            </div>
           

            <vue-pagination  :current=currentPage right=1  :total=totalPage v-on:first=onFirst v-on:last=onLast v-on:next=onNext
                v-on:prev=onPrev v-on:to=onTo></vue-pagination>
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
                    { text: "Transactions", to: "" }
                ],
                currentPage: 0,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                maxDisplayCnt: 0,
                totalPage: 0,
                totalTxs: 0
            };
        },
        methods: {
            nav(n) {
                var query = JSON.parse(window.JSON.stringify(this.$route.query));

                query.p = n;
                this.$router.push({ path: this.$route.path, query });
            },
            nthPage() {
                this.$root.showModalLoading = true;

                api.getTx({
                    a: this.$route.query.a,
                    block: this.$route.query.block,
                    p: this.$route.query.p || 1,
                    isPending: this.$route.query.isPending
                }, o => {
                    this.$root.showModalLoading = false;
                    this.arr = o.txnList;
                    this.currentPage = o.currentPage;
                    this.maxDisplayCnt = o.maxDisplayCnt;
                    this.totalPage = o.totalPage;
                    this.totalTxs = o.txnCnt;
                }, xhr => {
                    console.log(xhr);
                    this.$root.showModalLoading = false;
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404!" + this.$route.fullPath);
                });
            },
            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            onFirst() {
                this.nav(1);
            },
            onLast() {
                this.nav(this.totalPage);
            },
            onNext() {
                this.nav(this.currentPage + 1);
            },
            onPrev() {
                this.nav(this.currentPage - 1);
            },
            onTo(n) {
                this.nav(n);
            },
            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            toWei(n) {
                return utility.toWei(n);
            },
            easyNumber(n) {
                return utility.easyNumber(n);
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
<style>
    .vue-txs .tip a {
        color: rgb(76, 32, 133);
    }

    .vue-txs .info-and-pagination .info a {
        color: inherit;
    }

    .vue-txs td,
    .vue-txs th {
        border-top-color: #ddd;
    }

    .vue-txs .fail {
        background: url(../../static/img/warning_icon.png)no-repeat 0 10px;
        padding-left: 28px;
    }

    .vue-txs .fail a {
        display: inline-block;
        max-width: 142px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    /* 这是新增加的样式 */
    @media (max-width: 992px) {
        .vue-txs .scroll{
            width: 96vw;
            overflow-x: auto;
        }
        .shink-1{
            margin-bottom: 5px;
        }
    }
    .td-width{
        display: inline-block;
        width: 80px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
     @media (min-width: 992px) {
        .vue-txs  .account-info{
            justify-content: space-between;
            display: flex;
        }
    }
</style>