
<template>
    <!-- https://etherscan.io/address/0xea674fdde714fd979de3edf0f56aa9716b898ec8 -->
    <div class="vue-address" :triggerComputed=urlChange>
        <vue-bread :arr=breadcrumb :title='"Address " + $route.params.id'></vue-bread>
        <div class=container v-if=obj>
            <table class="c333 table">
                <tr>
                    <th>
                        Overview
                        <span class=c777 v-show=obj.address.alias> | {{ obj.address.alias }}</span>
                    </th>
                    <th class=text-right>
                        <!-- * uncomment this img tag -->
                        <!-- <img src=%qrcode> -->
                    </th>
                </tr>
                <tr>
                    <td>Tch Balance:</td>
                    <td>{{ easyNumber(obj.address.balance/1000000000000000000) }} Tch </td>
                </tr>
                <tr>
                    <td>Nonce:</td>
                    <td>{{ obj.address.nonce }}</td>
                </tr>
                <tr>
                    <td>Number Of Transactions:</td>
                    <td>{{ obj.txCnt }}</td>
                </tr>
                <tr>
                    <td>Mined:</td>
                    <td>{{ obj.mintedBlkCnt }}</td>
                </tr>
            </table>

            <vue-tab-buttons class=mt20 :arr=tabButtons :tab.sync=tab></vue-tab-buttons>
            <div class=mt20></div>

            <!--    Transactions
                ============================================================ -->
            <div class=tab v-show="tab == 1">
                <div class="row title align-items-center account-info">
                    <div class="shink-1 titlt-col">
                        <span class="c333 fa fa-sort-amount-desc" aria-hidden=true></span>
                        Latest {{ txs.length }} txns from a total Of
                        <router-link :to='fragApi + "/txs?a=" + $route.params.id' >{{ obj.txCnt }} transactions </router-link>
                        <router-link :to='fragApi + "/txs?a=" + $route.params.id + "&isPending=true" '  class="title-inline" >( + {{ obj.pendingTxCnt == 0? 0 : obj.pendingTxCnt }} PendingTxn )</router-link>
                    </div>
                    <div class="shink-1  address-btn">
                        <span v-if="contractHash">
                            <router-link class="btn btn-link" :to='fragApi + "/tx/"+contractHash'>View Smart Contract</router-link>
                            |</span>
                        <router-link class="btn btn-link" :to='fragApi + "/txs?a=" + $route.params.id'>View All {{ obj.txCnt }} Txn</router-link>
                        |
                        <router-link class="btn btn-link" :to='fragApi + "/txs?a=" + $route.params.id + "&isPending=true" '>View All {{ obj.pendingTxCnt == 0? 0 : obj.pendingTxCnt }} PendingTxn</router-link>
                    </div>
                </div>
                <div class="scroll">
                    <table class="mt20 table">
                        <tr>
                            <th>TxHash</th>
                            <th>Block</th>
                            <th>Age</th>
                            <th>From</th>
                            <th></th>
                            <th>To</th>
                            <th>Value</th>
                            <th class=txfee>[TxFee]</th>
                        </tr>

                        <tr v-for="(o,index) in txs" :key="index">
                            <td v-if="o.status == 0" class=fail>
                                <router-link :to='fragApi + "/tx/" + o.hash'>{{ o.hash }}</router-link>
                            </td>
                            <td class=tdxxxwddd v-if="o.status != 0">
                                <router-link :to='fragApi + "/tx/" + o.hash'>{{ o.hash }}</router-link>
                            </td>
                            <td>
                                <router-link v-if=o.block.height :to='fragApi + "/block/" + o.block.height'>{{ o.block.height }}</router-link>
                                <i v-else>(pending)</i>
                            </td>
                            <td class=time>
                                <div class="td-width" >{{ timeConversion(Date.now() - o.timestamp) }} ago</div>
                                <div>{{ new Date(o.timestamp).toString() }} | {{ o.timestamp }}</div>
                            </td>
                            <td class="tdxxxwddd">
                                <div class="td-inline">
                                    <vue-blockies :address='o.from.alias || o.from.hash'></vue-blockies>
                                    <span v-if="o.from.hash == $route.params.id" class="td-inline-width">{{ o.from.alias || o.from.hash }}</span>
                                    <router-link v-else :to='fragApi + "/address/" + o.from.hash' class="td-inline-width">{{ o.from.alias || o.from.hash }}</router-link>
                                </div>
                            </td>
                            <td class=text-uppercase :class=inOutClass(o)></td>
                            <td class=tdxxxwddd>
                                <div class="td-inline">
                                    <vue-blockies :address='o.to.alias || o.to.hash'></vue-blockies>
                                    <span v-if="o.to.hash == $route.params.id" class="td-inline-width">{{ o.to.alias || o.to.hash }}</span>
                                    <span v-else class="td-inline-width">
                                        <router-link v-if="o.to.hash" :to='fragApi + "/address/" + o.to.hash' >{{ o.to.alias || o.to.hash }}</router-link>
                                    </span>
                                    
                                </div>
                            </td>
                            <td> <div class="td-width" :title="easyNumber(o.value/1000000000000000000)">{{ easyNumber(o.value/1000000000000000000) }} Tch</div></td>
                            <td class=txfee>
                                <span v-if=o.block.height>{{ toWei(o.txFee) }}</span>
                                <i v-else>(pending)</i>
                            </td>
                        </tr>
                    </table>
                </div>
                
            </div>

            <!--    code
                ============================================================ -->
            <div class=tab v-show="tab == 2">
                <table class="mt20 table">
                    <tr>
                        <pre><code class=language-javascript v-html=formatCode></code></pre>
                    </tr>
                </table>
            </div>

            <!--    Mined Blocks
                ============================================================ -->
            <!-- <div class=tab v-show="tab == 2">
                <div class="align-items-center row title">
                    <div class=col>
                        <span class="c333 fa fa-sort-amount-desc" aria-hidden=true></span>
                        Latest {{ minted.length }} blocks (From a total of
                        <router-link :to='fragApi + "/blocks?m=" + $route.params.id'>{{ obj.mintedBlkCnt}}</router-link>)
                    </div>
                    <div class=col-auto>
                        <router-link class="btn btn-link" :to='fragApi + "/blocks?m=" + $route.params.id'>View All</router-link>
                    </div>
                </div>

                <table class="mt20 table">
                    <tr>
                        <th>Block</th>
                        <th>Age</th>
                        <th>txn</th>
                        <th>Reward</th>
                    </tr>
                    <tr v-for="o in minted">
                        <td>
                            <router-link :to='fragApi + "/block/" + o.height'>{{ o.height }}</router-link>
                        </td>
                        <td class=time>
                            <div>{{ timeConversion(Date.now() - o.timestamp) }} ago</div>
                            <div>{{ new Date(o.timestamp).toString() }} | {{ o.timestamp }}</div>
                        </td>
                        <td>{{ o.txnCnt }}</td>
                        <td>{{ toWei(o.gasReward) }}</td>
                    </tr>
                </table>
            </div> -->

            <!--    Mined Uncles
                ============================================================ -->
            <!-- <div class=tab v-show="tab == 3">
                <div class="align-items-center row title">
                    <div class=col>
                        <span class="c333 fa fa-sort-amount-desc" aria-hidden=true></span>
                        Latest %1 uncles (From a total of
                        <a href="uncles.html?id=%id-from-url">%2</a> with %3 minted)
                    </div>
                    <div class=col-auto>
                        <router-link class="btn btn-link" :to='fragApi + "/uncles?m=" + $route.params.id'>View All</router-link>
                    </div>
                </div>

                <table class="mt20 table">
                    <tr>
                        <th>Block</th>
                        <th>Age</th>
                        <th>UncleNumber</th>
                        <th>Difficulty</th>
                        <th>GasReward</th>
                        <th>Reward</th>
                    </tr>

                    <tr>
                        <td>
                            <a href="block.html?id=%Block">%Block</a>
                        </td>
                        <td>%Age</td>
                        <td>
                            <a href="uncle.html?id=%perhaps-uncle-id">%UncleNumber</a>
                        </td>
                        <td>%Difficulty</td>
                        <td>%GasReward</td>
                        <td>%Reward</td>
                    </tr>
                </table>
            </div> -->

        </div>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        prism = require("prismjs"),
        jsBeautify = require("js-beautify").js_beautify,
        utility = require("@/assets/utility");

    module.exports = {
        components: {
            "vue-bread": require("@/components/vue-bread").default,
            "vue-pagination": require("@/components/vue-pagination").default,
            "vue-tab-buttons": require("@/components/vue-tab-buttons").default,
            "vue-blockies": require("@/components/vue-blockies").default
        },
        computed: {
            formatCode() {
                var lang = prism.languages.javascript;

                if (this.obj.contractCode) {
                    return prism.highlight(jsBeautify(JSON.parse(this.obj.contractCode).Source), lang);
                }
                return "0x0";
            },
            tabButtons() {
                return this.obj && this.obj.contractCode ? ["Transactions", "Contract Code"] : ["Transactions"];
            },
            urlChange() {
                this.contractHash = ""
                api.getAddress(this.$route.params.id, o => {
                    this.minted = o.mintedBlkList;
                    this.obj = o;
                    if (o.address.type == 1) {// this is a smart contract address
                        api.getTransactionByContract({ address: o.address.hash }, this.$route.params.api, (transaction) => {
                            var transaction = JSON.parse(transaction)
                            this.contractHash = transaction.result.hash
                        })
                    }
                    this.txs = o.txList;
                }, xhr => {
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404!" + this.$route.fullPath);
                });
            }
        },
        data() {
            return {
                contractHash: "",
                breadcrumb: [
                    { text: "Home", to: "/" },
                    { text: "Normal Accounts", to: "/accounts" },
                    { text: "Address", to: "" }
                ],
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                minted: [],
                obj: null,
                tab: 0,
                txs: []
            };
        },
        methods: {
            inOutClass(o) {
                if (o.from.hash == this.$route.params.id)
                    return "out";
                else if (o.to.hash == this.$route.params.id)
                    return "in";
                else
                    return "";
            },
            failClass(o) {
                if (o.status == 0)
                    return "!";
                else
                    return " ";
            },
            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            timeConversionSec(ms) {
                return utility.timeConversionSec(ms);
            },
            toWei(n) {
                return utility.toWei(n);
            },
            easyNumber(n) {
                return utility.easyNumber(n);
            }
        }
    };
</script>
<style>
    .vue-address td.out {
        width: 50px;
    }

    .vue-address td.in::before,
    .vue-address td.out::before {
        border-radius: 4px;
        color: white;
        padding: 3px 5px;
    }

    .vue-address td.in::before {
        background-color: var(--green);
        content: "in";
    }

    .vue-address td.out::before {
        background-color: var(--orange);
        content: "out";
    }

    .vue-address .container .table th {
        border-top: 0;
    }

    .vue-address .container .title {
        overflow: auto;
    }

    .vue-address .txfee {
        color: silver;
    }

    .vue-address .tab a {
        font-size: 13px;
    }

    .vue-address .fail {
        background: url(../../static/img/warning_icon.png)no-repeat 0 10px;
        padding-left: 28px;
    }

    .vue-address .fail a {
        display: inline-block;
        max-width: 142px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .vue-address .tdxxxwddd{
      padding: .75rem 0.4rem;
    }
    .vue-address .tdxxxwddd img{
      margin-right: 5px;
    }
     @media (max-width: 992px) {
         .vue-address .address-btn .btn{
             padding: 0.375rem 0;
        }
        /* .title-inline{
           display:block;
           line-height:20px;
        } */
        .align-items-center {
            display: block;
        }
        .vue-address .scroll{
            width: 96vw;
            overflow-x: auto;
        }
        .shink-1{
            margin-bottom: 5px;
        }
    }
     .vue-address .td-width{
        width: 80px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .vue-address .td-inline{
        display: flex;
    }
    .vue-address .td-inline-width {
        display: inline-block;
       width: 140px;
       white-space: nowrap;
       text-overflow: ellipsis;
       overflow: hidden; 
    }
     @media (min-width: 992px) {
        .vue-address  .account-info{
            justify-content: space-between;
            display: flex;
        }
    }
</style>