
<template>
    <!-- https://etherscan.io/block/4951841 -->
    <div class="container vue-block" v-bind:triggerComputed=urlChange>
        <vue-tab-buttons class=mt20 v-bind:arr=tabButtons v-bind:tab.sync=tab></vue-tab-buttons>
        <div class=mt20></div>
        <div class=tab v-show="tab == 1">
            <h4>Block Information</h4>
            <div class="table-list" v-if=block>
                <div class="list-item">
                    <h4 class="name">Height:</h4>
                    <div>
                        <router-link v-bind:to='fragApi + "/block/" + (block.height - 1)' aria-label=Previous v-if="block.height > 1">
                            <span aria-hidden=true>&lt; Prev</span>
                        </router-link>
                        <span>{{ block.height }}</span>
                        <router-link v-bind:to='fragApi + "/block/" + (block.height + 1)' aria-label=Next v-if="block.height < block.maxHeight">
                            <span aria-hidden=true>Next &gt;</span>
                        </router-link>
                    </div>
                </div>
                <div class="list-item">
                    <h4 class="name">TimeStamp:</h4>
                    <div class="list-item-content">{{ timeConversion(Date.now() - block.timestamp ) }} ago ({{ new Date(block.timestamp).toString() }} | {{ block.timestamp }})</div>
                </div>
                <div class="list-item">
                    <h4 class="name">Transactions:</h4>
                    <div class="list-item-content">
                        <router-link v-bind:to='fragApi + "/txs?block=" + block.height'>{{ block.txCnt }}</router-link>
                        tx in this block
                    </div>
                </div>
                <div class="list-item">
                    <h4 class="name">Hash:</h4>
                    <div class="list-item-content">{{ block.hash }}</div>
                </div>
                <div class="list-item">
                    <h4 class="name">Parent Hash:</h4>
                    <div class="list-item-content">
                        <router-link v-bind:to='fragApi + "/block/" + block.parentHash'>{{ block.parentHash }}</router-link>
                    </div>
                </div>
                <div class="list-item">
                    <h4 class="name">Mined:</h4>
                    <div class="list-item-content">
                        <router-link v-bind:to='fragApi + "/address/" + block.miner.hash'>{{ block.miner.hash }}</router-link>
                        <span v-if=block.miner.alias> | {{ block.miner.alias }}</span>
                    </div>
                </div>
                <div class="list-item">
                    <h4 class="name">Coinbase:</h4>
                    <div class="list-item-content">
                        <router-link v-bind:to='fragApi + "/address/" + block.coinbase'>{{ block.coinbase }}</router-link>
                    </div>
                </div>
                <div class="list-item">
                    <h4 class="name">Gas Reward:</h4>
                    <div>5 tch</div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility");

    module.exports = {
        components: {
            "vue-tab-buttons": require("@/components/vue-tab-buttons").default
        },
        computed: {
            urlChange() {
                api.getBlock(this.$route.params.id, o => {
                    this.block = o;
                }, xhr => {
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404!" + this.$route.fullPath);
                });
            }
        },
        methods: {
            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            timeConversionSec(ms) {
                return utility.timeConversionSec(ms);
            },
            toWei(n) {
                return utility.toWei(n);
            }
        },
        data() {
            return {
                block: null,
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                tab: 0,
                tabButtons: ["Overview"]
            };
        }
    };
</script>
<style>
    .vue-block .table tbody tr td {
        border: 0;
        vertical-align: middle;
    }

    .vue-block td .pagination {
        margin: 0;
        vertical-align: top;
    }

    .vue-block tr>td:first-child::after {
        content: ":";
    }

    .vue-block .dynasty {
        height: 78px;
        overflow: hidden;
    }

    .vue-block .dynasty a {
        display: block;
    }

    .vue-block .dynasty button {
        background-color: darkgray;
        border-color: none;
    }

    .vue-block .card {
        border: 0;
    }

    /* 更新的样式 */
    .vue-block .list-item{
        box-sizing: border-box;
        width: calc(100vw - 30px);
        padding:10px 0;
        word-break: break-all; 
        word-wrap:break-word;
    }
    @media (min-width: 991px) {
        .vue-block .list-item{
            display: flex;
        }
        .vue-block .list-item .name{
            width: 150px;
        }
    }
    .vue-block .list-item .name{
        font-size: 13px;
        color: #000;
        margin-bottom: 0;
    }
    .vue-block .list-item .list-item-content{
        padding-right: 15px;
        word-break: break-all; 
        word-wrap:break-word;
    }
</style>