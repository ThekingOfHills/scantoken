
<template>
    <div class="container vue-home" style="background-color: #f7f7f7;padding-top: 30px">
        <div class=top>
            <div class=row>
                <div class="marginb-20 col-md-6">
                    <div class=chart_banner v-if=market>
                        <!--更新的地方  -->
                        <div class="tch-info">
                            <div class="logo-pc"></div>
                            <div class="tch-infoDetail marginb-20">
                                <div class="estimate"><span>MARKET CAP OF  </span><span>$750 MILLION</span></div>
                                <div class="current-price"><span class="price">$1</span> <span class="total-count"> <span class="white-8">count</span> <span >{{toTch(summerInfo.totalBalance)}}</span></span></div>
                            </div>
                        </div>
                        <div class="trade-box">
                            <div class="last-block-trade">
                                <span class="white-8">LAST BLOCK</span>
                                <span class="last-count"> {{blocks[0].height}}</span>
                            </div>
                            <div class="last-block-trade">
                                <span class="white-8">TRANSACTIONS</span>
                                <span class="transiton-count">{{summerInfo.totalTransaction}} <span class="transiton-tps"> ({{summerInfo.transactionTps}} TPS)</span> </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="marginb-20 col-md-6">
                    <div id=chart style="padding: 20px; border-right-color: #6610f2; border-right-style: solid;
                     border-right-width: 2px;border-left-color: #6610f2; border-left-style: solid;
                     border-left-width: 2px; margin-bottom: 0px; background-color: #FFFFFF;box-shadow: 0 10px 6px -6px #bbb;"></div>
                </div>
            </div>
        </div>
        <div class=mt20>
            <div class=row>
                <div class="banner_left marginb-20 col-md-6">
                    <div class=list_tab>
                        <div class=img>
                            <span class="fa fa-th-large" aria-hidden=true></span>
                            Blocks
                        </div>
                        <router-link class="btn btn-default pull-right" :to='fragApi + "/blocks"' role=button>View
                            All
                        </router-link>
                    </div>
                    <ul class="blocks list" >
                        <li class=li v-for="(o,index) in blocks" :key="index">
                            <div class=img>
                                <router-link class=mt20 :to='fragApi + "/block/" + o.height'>block {{ o.height}}</router-link>
                                <div class=mt20>{{ timeConversion(msVmReady - o.timestamp) }} ago</div>
                            </div>
                            <div class=right>
                                Mined By
                                <router-link class="li-item-miner" :to='fragApi + "/address/" + o.miner.hash'>{{
                                    o.miner.hash }}
                                </router-link>
                                <div class=mt16>
                                    <router-link :to='fragApi + "/txs?block=" + o.height'>
                                        <b>{{ o.txnCnt }}</b> transactions
                                    </router-link>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class=col-md-6>
                    <div class=tab-right>
                        <div class=img>
                            <span class="fa fa-list" aria-hidden=true></span>
                            Transaction
                        </div>
                        <router-link class="btn btn-default pull-right" :to='fragApi + "/txs"' role=button>View
                            All
                        </router-link>
                    </div>
                    <ul class="list txs">
                        <li class="li" v-for="(o,index) in txs" :key="index">
                            <img class="txs-img" src=/static/img/icon.png height=43 width=43 alt="">
                            <div class="txs-content">
                                <div class="txs-content-item">
                                    <span class="txs-tit">TX#</span>
                                    <span class="txs-item-content">
                                        <router-link class=monospace :to='fragApi + "/tx/"+ o.hash' :title="o.hash.toUpperCase()">{{ o.hash.toUpperCase() }}</router-link>
                                    </span>
                                    <span class="txs-time">{{timeConversion(msVmReady - o.timestamp)}} ago</span>
                                </div>
                                <div class="txs-content-item">
                                    <span class="txs-tit">From</span>
                                    <span class="txs-hash">
                                        <router-link class=monospace :to='fragApi + "/address/" + o.from.hash' :title="o.from.hash">{{ o.from.hash }}</router-link>
                                    </span>
                                    <span class="txs-tit">To</span>
                                    <span class="txs-hash">
                                        <router-link class=monospace :to='fragApi + "/address/" + o.to.hash' :title="o.to.hash">{{ o.to.hash}} </router-link>
                                    </span>
                                </div>
                                <div class="txs-content-item">
                                    <span class="txs-tit">Amount</span>
                                    <span class="tes-ktch">{{ toWei(o.value) }}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    var api = require("@/assets/api"),
        utility = require("@/assets/utility");

    function getDate(timestamp) {
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        return Y+M+D;
    }

    module.exports = {
        data() {
            return {
                blocks: [],
                totalCount: 750000000,
                chartConfig: {
                    // legend: {
                    //     align: "right",
                    //     layout: "vertical",
                    //     verticalAlign: "middle"
                    // },
                    chart: {
                        type: 'line',
                        spacingBottom: 0,
                        spacingTop: 0,
                        spacingLeft: 0,
                        spacingRight: 0,
                    },
                    series: [{
                        data: null,
                        name: "Transactions",
                        allowPointSelect: true
                        // , type: "area"
                    }],
                    legend: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Tchainup Transaction History in 14 days',
                        style: {
                            fontSize: '13px'
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            return '<span style="font-size:10px">' + getDate(this.point.category) + '</span><br><table><tr><td style="padding:0">' +
                                '<span style="color:' + this.series.color + '">Transactions: </a></span><b>' + this.point.y + '</b><br>'
                            '</td></tr></table>';
                        }
                    },
                    plotOptions: {
                        series: {
                            color:'#5F1CC8',
                            animation: {
                                duration: 0
                            },
                        },
                        column: {
                            pointPadding: 0.1,
                            borderWidth: 0
                        }
                    },
                    xAxis: {
                        title: {text: ''},
                        type: "datetime"
                    },
                    yAxis: {
                        labels: {
                            enabled: true
                        },
                        title: {
                            text: null
                        }
                    }
                },
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                market: null,
                msVmReady: Date.now(),
                txs: [],
                timerB: null,
                timerT: null,
                summerInfo: {
                    totalBalance:0,
                    totalTransaction:0,
                    transactionTps:0
                }
            };
        },
        methods: {
            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            timeConversion(ms) {
                // if a vue directive uses a vue method, this method will get called on any vue data's any change
                //
                // https://github.com/vuejs/vue/issues/5682
                // "In 2.x a component's entire render function is called when it is updated."
                return utility.timeConversion(ms);
            },
            toWei(n) {
                return utility.toWei(n);
            },
            toTch(n){
                return utility.toTch(n);
            }
        },
        mounted() {
            this.timerB = setInterval(() => {
                 this.msVmReady = Date.now();
                 api.getBlock({type: "latest"}, o => this.blocks = o);
            }, 1000);

             api.getTx({type: "latest"}, o => this.txs = o);
             this.timerT = setInterval(() => {
                 api.getTx({type: "latest"}, o => this.txs = o);
            }, 5000);


            api.getMarketCap(o => this.market = o);

            api.getTx("cnt_static", o => {
                var i, arr = [], div = document.querySelector("#chart");

                if (div) {
                    for (i in o) arr.push([Date.parse(i), o[i]]);

                    arr.sort(function (a, b) {
                        return a[0] - b[0];
                    });

                    // series 全部是 0 时没法计算纵坐标, highcharts 会把一条线居中显示. 如果想让线靠下就需要给 max 一个非零的值比如 1
                    // this.chartConfig.yAxis.max = 1;

                    this.chartConfig.series[0].data = arr;
                    require("highcharts").chart(div, this.chartConfig);
                }
            });

            api.getSummerInfo("summerInfo",o=>{
                this.summerInfo=o;
            });
        },
        distroyed: function () {
        　　clearInterval(this.timerB);
        　　clearInterval(this.timerT);
        }
    };
</script>
<style >
    .vue-home .container {
        background-color: #f7f7f7;
    }

    .vue-home .mt16 {
        margin-top: 5px;
    }

    .vue-home .list {
        height: 725px;
        /* overflow: hidden; */
        overflow: auto;
    }

    .vue-home .banner_left .list_tab {
        width: 100%;
        height: 60px;
        border-bottom: 3px solid #f7f7f7;
        background-color: #fff;
        position: relative;
    }

    .vue-home .banner_left .list_tab .img {
        position: absolute;
        top: 33%;
        left: 2%;
        font-size: 16px;
    }

    .vue-home .banner_left .list_tab .btn {
        position: absolute;
        right: 2%;
        top: 20%;
    }

    .vue-home .li {
        align-items: center;
        background-color: #fff;
        border-bottom: 4px solid #f7f7f7;
        display: flex;
        height: 95px;
        padding: 10px;
    }

    .vue-home li .monospace {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;

    }

    .vue-home .blocks li .monospace {
        margin-top: 5px;
        width: 350px;
    }

    /*.vue-home .txs li .monospace {*/
        /*width: 400px;*/
    /*}*/

    .vue-home .blocks li > .img {
        background-color: #808080;
        flex-shrink: 0;
        height: 65px;
        width: 135px;
        padding: 7px 10px 4px 10px;
        margin-right: 13px;
    }

    .vue-home .blocks li > .img > * {
        color: white;
        display: block;
        text-align: center;
    }

    .vue-home .tab-right {
        height: 60px;
        border-bottom: 3px solid #f7f7f7;
        background-color: #fff;
        position: relative;
    }

    .vue-home .tab-right .img {
        position: absolute;
        top: 33%;
        left: 2%;
        font-size: 16px;
    }

    .vue-home .tab-right .btn {
        position: absolute;
        right: 2%;
        top: 20%;
    }

    .vue-home .txs li {
        /* 右侧列表 状态不同 左边框有不同的状态颜色, 目前不知道啥状态所以是按顺序给颜色 */
        border-left: 2px solid;
    }

    .vue-home .txs li > img {
        flex-shrink: 0;
        margin-right: 20px;
    }

    .vue-home .txs li tr > td:first-child {
        height: 20px;
        width: 40px;
    }

    .vue-home .txs li:nth-of-type(4n + 1) {
        border-left-color: #3cba54;
    }

    .vue-home .txs li:nth-of-type(4n + 2) {
        border-left-color: #f4c20d;
    }

    .vue-home .txs li:nth-of-type(4n + 3) {
        border-left-color: #db3236;
    }

    .vue-home .txs li:nth-of-type(4n + 4) {
        border-left-color: #4885ed;
    }

    /*
        chart
        */

    .vue-home #chart {
        height: 225px;
        max-width: 950px;
    }

    .vue-home .chart_banner {
        background-color: #5F1CC8;
        padding: 20px;
        height: 225px;
    }

    .vue-home .chart_banner {
        color: whitesmoke;
    }

    .vue-home .chart_banner .name {
        font-size: 15px;
    }

    .vue-home .chart_banner .value {
        font-size: 30px;
    }

    .vue-home .chart_banner .msg {
        font-size: 16px;
        margin-top: 10px;
    }

    .vue-home .chart_banner .msg div {
        margin-top: 10px;
    }

    .vue-home .chart_banner .msg .msg_change_right {
        float: right;
        margin-right: 10px;
    }

    .vue-home .chart_banner .msg .red {
        color: red;
    }

    .vue-home .chart_banner .msg .green {
        color: green;
    }

    .vue-home .chart_banner .msg .msg_change_left {
        margin-left: 10px;
    }

    .vue-home text.highcharts-credits {
        display: none;
    }

    .vue-home .updataTime {
        float: right;
    }

    /* 更新代码 */
    .marginb-20{
        margin-bottom: 0px;
    }
    .tch-info{
        display: flex;
    }
    .logo-pc{
        width: 60px;
        height: 60px;
        background: url('/static/img/transparant-logo.png') no-repeat;
        background-size: 60px 60px;
        margin: 0 20px 20px 0;
    }
    @media (max-width: 992px) {
        .logo-pc{
            display: none;
            width: 50px;
            height: 50px;
            background: url('/static/img/transparant-logo.png') no-repeat;
            background-size: 50px 50px;
            margin: 0;
        }
        .marginb-20{
            margin-bottom: 20px;
        }
    }
    .estimate{
        margin-bottom: 6px;
        font-size: 16px;
        color: rgba(255,255,255,0.8);
    }
    .current-price{
        height: 30px;
        font-size: 20px;
    }
    .current-price .price{
        margin-right: 20px;
    }
    .current-price .total-count{
        text-transform: uppercase;
        font-size: 18px;
    }
    .trade-box{
        display: flex;
        justify-content: space-between;
        padding-top: 20px;
    }
    .last-block-trade{
        font-size: 16px;
        display: flex;
        flex-direction: column;
    }
    .white-8{
        color: rgba(255,255,255,0.8);
    }
    .last-count{
        font-size: 20px;
    }
    .transiton-count{
        font-size: 16px;
    }
    .vue-home .transiton-count .transiton-tps{
        font-size: 12px;
        font-weight: 300;
        margin: 5px;
    }

    /* 这是新更新的样式 */
    .vue-home .txs .li{
        display: flex;

    }
    .vue-home .txs .li .txs-img{
        width: 43px;
        height: 43px;
    }
    .vue-home .li .txs-content{
        flex: 1;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 20px 0;
        overflow: hidden;
    }
   .vue-home .li .txs-content  .txs-content-item{
        display: flex;
    }
    .vue-home .txs-content-item .txs-tit{
        display: inline-block;
        height: 20px;
        width: 50px;
    }
    .vue-home .txs-content-item  .txs-item-content,
    .vue-home .txs-content-item  .txs-hash{
        /* max-width: 300px; */
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        flex: 1;
        text-align: left;
        margin-right: 20px;
    }
    .vue-home .txs-content-item  .txs-time{
        width: 80px;
        height: 20px;
        text-align: right;
        margin-right: 10px;
    }
    .vue-home .blocks .li{
        display: flex;
    }
    .vue-home  .blocks .right{
       flex: 1;
       overflow: hidden;
       margin-right: 20px;
    }
    .vue-home  .blocks .right .li-item-miner{
        display: inline-block;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>
