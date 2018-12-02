
<template>
    <!-- https://etherscan.io/token/0xB8c77482e45F1F44dE1745F52C74426C631bDD52-->
    <div class="vue-address" :triggerComputed="urlChange">
        <vue-bread :arr="breadcrumb" :title='"Token" + $route.params.id'></vue-bread>
        <div class=container >
            <div class="overview">
                <div class="view-list">
                    <div class="view-item overview-name">
                        <span >TOKEN NAME: </span> <span > {{overview.name}}</span>
                    </div>
                </div>
                <div class="view-list">
                    <div class="view-item">
                        <span class="view-name">Total totalSupply:</span>
                        <span>{{overview.totalSupply}}</span>
                    </div>
                    <div class="view-item">
                        <span class="view-name">Contract:</span>
                        <span class="view-contract">{{overview.address}}</span>
                    </div>
                </div>
                <div class="view-list">
                    <div class="view-item">
                        <span class="view-name">Price:</span>
                        <span>${{overview.transfers}}</span>
                    </div>
                    <div class="view-item">
                        <span class="view-name">Decimals:</span>
                        <span>{{overview.totalSupply}}</span>
                    </div>
                </div>
                <div class="view-list">
                    <div class="view-item">
                        <span class="view-name">Holders:</span>
                        <span>{{overview.holders}}</span>
                    </div>
                    <div class="view-item">
                        <span class="view-name view-peacial">filter:</span>
                        <span>
                            <el-input placeholder="请输入内容" v-model="filter" size="small" style="width:250px"  clearable>
                                <el-button slot="append" icon="el-icon-search" style="display:inline-block;" @click="filterTransfer"></el-button>
                            </el-input>
                        </span>
                    </div>
                </div>
            </div>
            <vue-tab-buttons class=mt20 :arr=tabButtons :tab.sync="tab"></vue-tab-buttons>
            <div class=mt20></div>

            <!--    Transactions -->
            <div class=tab v-show="tab == 1">
                <div class="table-instruction">
                    <div> 
                        <span class="c333 fa fa-sort-amount-desc" aria-hidden=true></span>
                        A total of  {{transferList.length}} Txns found 
                    </div>
                    <div>
                        <el-pagination  :pager-count="5" background :page-size="transferPage.pageSize" layout="prev, pager, next" :total="transferPage.total" @current-change="changeTransferPage"> </el-pagination>
                    </div>
                </div>
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
                            <td class=tdxxxwddd>
                                <router-link :to='fragApi + "/tx/" + o.txHash' :title="o.txHash">{{ o.txHash }}</router-link>
                            </td>
                            <td  >
                                <span>{{o.timestamp}}</span>
                            </td>
                            <td class=tdxxxwddd>
                                <span :title="o.from">{{ o.from }}</span>
                                <!-- <router-link :to='fragApi + "/block/" + o.from'>{{ o.from }}</router-link> -->
                            </td>
                            <td >
                                <span v-if="isFilter">
                                    <span class="out-box" v-if="o.from == filter" > OUT</span>
                                    <span class="in-box" v-else> IN</span>
                                </span>
                            </td>
                            <td class="tdxxxwddd">
                                <span :title="o.to">{{ o.to }}</span>
                                <!-- <router-link :to='fragApi + "/tx/" + o.to' class="td-inline-width">{{ o.to }}</router-link> -->
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
                <div class="table-instruction">
                    <div> 
                        <span class="c333 fa fa-sort-amount-desc" aria-hidden=true></span>
                        A total of  {{holderPage.total}} Holders
                    </div>
                    <div>
                        <el-pagination  :pager-count="5" background :page-size="holderPage.pageSize" layout="prev, pager, next" :total="holderPage.total" @current-change="changeHolderPage"> </el-pagination>
                    </div>
                </div>
                <div class="scroll">
                    <table class="mt20 table">
                        <tr>
                            <th>TxHash</th>
                            <th>Address</th>
                            <th>quantity</th>
                            <th>Percentage</th>
                        </tr>

                        <tr v-for="(o,index) in balanceList" :key="index">
                            <td class=tdxxxwddd>
                                <span :title="o.contract">{{ o.contract }}</span>
                                <!-- <router-link :to='fragApi + "/tx/" + o.contract'>{{ o.contract }}</router-link> -->
                            </td>
                            <td class=tdxxxwddd >
                                <span :title="o.address ">{{ o.address }}</span>
                                <!-- <router-link :to='fragApi + "/tx/" + o.address'>{{ o.address }}</router-link> -->
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
                    { text: "Token", to: "" }
                ],
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                obj: null,
                tab: 0,
                txs: [],
                filter:'',
                isFilter:false,
                transferPage:{
                    total: 0,
                    pageNum:1,
                    pageSize:10
                },
                holderPage:{
                    total: 0,
                    pageNum:1,
                    pageSize:10
                },
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
                this.init();
            }
        },
        methods: {
            init(){
                this.getTokenView();
                this.getTokenHolders();
                this.getTokenTransfer();
            },
            getTokenView(){
                api.getTokenInfo(this.$route.params.id, o => {
                    this.overview = o;
                }, xhr => {
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404!" + this.$route.fullPath);
                });
            },
            getTokenTransfer(pageNum = 1){
                this.isFilter = false;
                api.getTokenTransfer(this.$route.params.id,pageNum, o => {
                    console.log(o);
                    this.transferList = o.transferList;
                    this.transferPage.total = o.total;
                
                }, xhr => {
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404!" + this.$route.fullPath);
                });
            },
            getTokenHolders(pageNum = 1){
                api.getTokenHolders(this.$route.params.id,pageNum, o => {
                    this.balanceList = o.balanceList;
                    this.holderPage.total = o.total;
                }, xhr => {
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404!" + this.$route.fullPath);
                });
            },
            changeTransferPage(num){
                if(this.isFilter){
                    this.filterTransfer(num);
                }else{
                    this.getTokenTransfer(num);
                }
            },
            changeHolderPage(num){
                this.getTokenHolders(num);
            },
            filterTransfer(pageNum = 1){
                this.isFilter = true;
                api.getTokenTransferFilter(this.$route.params.id,this.filter,pageNum, o=> {
                    this.transferList = o.transferList;
                    this.transferPage.total = o.total;
                },xhr => {
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404!" + this.$route.fullPath);
                });
                console.log(pageNum);
            },
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
    .vue-address .table-instruction{
        color: #000;
        font-size: 14px;
        margin-top: 20px;
        margin-left: 10px;
        display: flex;
        justify-content: space-between;
    }
    .vue-address .table-instruction > div{
        margin-bottom: 10px;
    }
    .vue-address .in-box{
        display:inline-block;
        padding: 3px 5px;
        color: #fff;
        background-color:#5cb85c;
        border-radius: 3px;
    }
    .vue-address .out-box{
        display:inline-block;
        padding: 3px 5px;
        color: #fff;
        background-color:#e67e22;
        border-radius: 3px;
    }
    .vue-address .over-view {
        width: 50%;
    }
    .vue-address .view-list{
        display: flex;
    }
    .vue-address .view-item{
        flex: 1;
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
    }
    .vue-address .overview-name{
        color: #000;
        font-size: 14px
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
            width: 94vw;
            overflow-x: auto;
        }
        .shink-1{
            margin-bottom: 5px;
        }

        /*  */
        .vue-address .table-instruction{
            display: block;
            justify-content: space-between;
             margin-left: 0px;
        }
        .vue-address .view-list{
            display: block;
        }
        .view-peacial{
            width: 35px;
        }
        .view-contract{
            display: inline-block;
            width: 290px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
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
        .vue-address .view-name{
            display: inline-block;
            width: 150px;
            text-align: left;
        }
    }
    
</style>