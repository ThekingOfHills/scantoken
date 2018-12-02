
<template>
    <!-- https://etherscan.io/token/0xB8c77482e45F1F44dE1745F52C74426C631bDD52-->
    <div class="vue-address" :triggerComputed="urlChange">
        <vue-bread :arr="breadcrumb" :title='"Token" + $route.params.id'></vue-bread>
        <div class=container >
            <table class="c333 table overview">
                <tr>
                    <th style="width:50%">
                        <span class=c777>TOKEN NAME: </span> <span > {{overview.name}}</span>
                    </th>
                    <th class=text-right> </th>
                </tr>
                <tr>
                    <td>
                        <span class="view-name">Total totalSupply:</span>
                        <span>{{overview.totalSupply}}</span>
                    </td>
                    <td>
                        <span class="view-name">Contract:</span>
                        <span>{{overview.address}}</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="view-name">Price:</span>
                        <span>{{overview.transfers}}</span>
                    </td>
                    <td>
                        <span class="view-name">Decimals:</span>
                        <span>{{overview.totalSupply}}</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="view-name">Holders:</span>
                        <span>{{overview.holders}}</span>
                    </td>
                    <td style="max-width:50%">
                        <div >
                            <span class="view-name">filter:</span>
                            <span>
                                <el-input placeholder="请输入内容" v-model="filter" size="small" style="width:250px" >
                                    <el-button slot="append" icon="el-icon-search"></el-button>
                                </el-input>
                            </span>
                        </div>
                    </td>
                </tr>
                
            </table>

            <vue-tab-buttons class=mt20 :arr=tabButtons :tab.sync="tab"></vue-tab-buttons>
            <div class=mt20></div>

            <!--    Transactions -->
            <div class=tab v-show="tab == 1">
                <!-- <div class="row title align-items-center account-info">
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
                </div> -->
                <div class="scroll">
                    <table class="mt20 table">
                        <tr>
                            <th>TxHash</th>
                            <th>Timestamp</th>
                            <th>From</th>
                            <th></th>
                            <th>To</th>
                            <th>Quantity</th>
                        </tr>

                        <tr v-for="(o,index) in transferList" :key="index">
                            <td >
                                <router-link :to='fragApi + "/tx/" + o.txHash'>{{ o.txHash }}</router-link>
                            </td>
                            <td  >
                                <span>{{o.timestamp}}</span>
                            </td>
                            <td class=tdxxxwddd>
                                <router-link :to='fragApi + "/block/" + o.from'>{{ o.from }}</router-link>
                            </td>
                            <td class=time>
                               <span></span>
                            </td>
                            <td class="tdxxxwddd">
                                <router-link :to='fragApi + "/tx/" + o.to' class="td-inline-width">{{ o.to }}</router-link>
                            </td>
                            <td>
                                {{o.quantity}}
                            </td>
                        </tr>
                    </table>
                </div>
                
            </div>

            <!--    code
                ============================================================ -->
            <div class=tab v-show="tab == 2">
                <!-- <div class="row title align-items-center account-info">
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
                </div> -->
                <div class="scroll">
                    <table class="mt20 table">
                        <tr>
                            <th>Rank</th>
                            <th>Address</th>
                            <th>quantity</th>
                            <th>Percentage</th>
                        </tr>

                        <tr v-for="(o,index) in balanceList" :key="index">
                            <td  >
                                <span>{{index+1}}</span>
                            </td>
                            <td class=tdxxxwddd >
                                <router-link :to='fragApi + "/tx/" + o.address'>{{ o.address }}</router-link>
                            </td>
                            <td>
                                <span>{{o.quantity}}</span>
                            </td>
                            <td class=time>
                                <span>{{o.percentage}}</span>
                            </td>                           
                        </tr>
                    </table>
                </div>
            </div>
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
                txs: [],
                filter:'',
                overview:{
                    address: "0xe2e8b2126c47eef2be111b3ed89aaae862097478",
                    name: "MeiToken",
                    symbol: "MTK",
                    decimals: "2",
                    totalSupply: "100000000000",
                    ownerAddress: null,
                    holders: 10,
                    transfers: 9
                },
                transferList: new Array(10).fill({
                    "txHash": "0x30dca9a43252af203c74eb7cd62ea4b1ef6264429d95c1868d57b8908e1c21",
                    "timestamp": 1542902400000,
                    "from": "0xe605ca5c2c939e22f308ab5973281fd0ee8eb203",
                    "to": "0xcfb29bbfd3afc934b542c0887d956e73757b294c",
                    "quantity": 10000
                }),
                balanceList: new Array(10).fill({
                    "address": "0xe605ca5c2c939e22f308ab5973281fd0ee8eb203",
                    "quantity": 99939460919,
                    "percentage": 99.9395,
                    "contract": "0xe2e8b2126c47eef2be111b3ed89aaae862097478"
                })
            };
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
                return  ["Transfers", "Hoders"]
            },
            urlChange() {
                //监听路由变化 获取数据 
                this.contractHash = "";
                api.getTokenInfo(this.$route.params.id, o => {
                // api.getAddress(this.$route.params.id, o => {
                    // console.log(o);

                    this.minted = o.mintedBlkList;
                    this.obj = o;
                    if (o.address.type == 1) {// this is a smart contract address
                        // api.getTransactionByContract({ address: o.address.hash }, this.$route.params.api, (transaction) => {
                        //     var transaction = JSON.parse(transaction)
                        //     this.contractHash = transaction.result.hash
                        // })
                    }
                    this.txs = o.txList;
                }, xhr => {
                    // this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404!" + this.$route.fullPath);
                });
            }
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
    .vue-address{
        min-height: calc(100% - 201px);
    }
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

    /* 更新数据 */
    .vue-address  .overview{
        margin: 20px 0;
    }
    .vue-address .view-name{
        display: inline-block;
        width: 150px;
        text-align: left;
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
    }
    .vue-address .td-inline{
        display: flex;
    }
    .vue-address .td-inline-width {
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