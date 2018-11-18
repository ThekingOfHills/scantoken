
<template>
    <div class="container vue-tx" v-bind:triggerComputed=urlChange>
        <vue-tab-buttons class=mt20 v-bind:arr=tabButtons v-bind:tab.sync=tab></vue-tab-buttons>
        <div class=mt20></div>

        <div class=tab v-show="tab == 1">
            <h3>Transaction Information</h3>
            <div class="table-list" v-if=tx>
                <div class="list-item">
                    <h4 class="name">TxHash:</h4>
                    <div class="list-item-content">{{ tx.hash }}</div>
                </div>
                <div class="list-item">
                    <h4 class="name">TxReceipt Status:</h4>
                    <div class="list-item-content">
                        <span class="fail" v-if="tx.status == 0">fail ( {{ tx.executeError }} )</span>
                        <span class="success" v-else-if="tx.status == 1">success</span>
                        <span v-else> pending</span>
                    </div>
                </div>
                <div class="list-item">
                    <h4 class="name">Block Height:</h4>
                    <div class="list-item-content">
                        <span v-if="tx.isPending">pending</span>
                        <span v-else>
                            <router-link v-if=tx.block v-bind:to='fragApi + "/block/" + tx.block.height'>{{tx.block.height}}</router-link>
                        </span>
                    </div>
                </div>
                <div class="list-item">
                    <h4 class="name">TimeStamp:</h4>
                    <div class="list-item-content">{{ timeConversion(Date.now() - tx.timestamp) }} ago ({{ new Date(tx.timestamp).toUTCString()}})</div>
                </div>
                <div class="list-item">
                    <h4 class="name">From:</h4>
                    <div class="list-item-content">
                        <router-link v-if=tx.from v-bind:to='fragApi + "/address/" + tx.from.hash'>{{ tx.from.hash }}</router-link>
                    </div>
                </div>
                <div class="list-item">
                    <h4 class="name">To:</h4>
                    <div class="list-item-content">
                        <router-link v-if=tx.to v-bind:to='fragApi + "/address/" + tx.to.hash'>{{ tx.to.hash }}</router-link>
                    </div>
                </div>
                <div class="list-item">
                    <h4 class="name">Value:</h4>
                    <div class="list-item-content">
                        {{ numberAddComma(tx.value/1000000000000000000) }} Tch
                    </div>
                </div>
                <div class="list-item">
                    <h4 class="name">Gas Limit:</h4>
                    <div>{{ numberAddComma(tx.gasLimit) }}</div>
                </div>
                <div class="list-item">
                    <h4 class="name">Gas Used By Txn:</h4>
                    <div class="list-item-content">{{ tx.isPending == true ? 'pending' : tx.gasUsed }}</div>
                </div>
                <div class="list-item">
                    <h4 class="name">Gas Price:</h4>
                    <div class="list-item-content">{{ toWei(tx.gasPrice) }}</div>
                </div>
                <div class="list-item">
                    <h4 class="name">Actual Tx Cost/Fee:</h4>
                    <div class="list-item-content">{{ toWei(tx.txFee) }}</div>
                </div>
                <div class="list-item">
                    <h4 class="name">Nonce:</h4>
                    <div class="list-item-content">{{ tx.nonce }}</div>
                </div>
                <div class="list-item">
                    <h4 class="name">Transaction Type:</h4>
                    <div  class="list-item-content">
                        <span v-if=" tx.type == 'deploy' ">{{ txType }} ( contract address: <router-link v-if=tx.to v-bind:to='fragApi + "/address/" + tx.contractAddress'> {{tx.contractAddress}} </router-link>)</span>
                        <span v-else>{{ txType }}</span>
                    </div>
                </div>
                <div class="list-item">
                    <h4 class="name">Payload Data:</h4>
                    <div  class="list-item-content">
                        <span v-if="tx.type == 'binary'" class=text>{{ tx.data }}</span>
                        <span v-else class=code>
                            <pre><code class=language-javascript v-html=formatCode></code></pre>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class=tab v-show="tab == 2">
            <h3>Internal Transactions</h3>
        </div>

        <div class=tab v-show="tab == 3">
            <h3>Event Logs</h3>
        </div>
    </div>
</template>
<script>
    var jsBeautify = require("js-beautify").js_beautify,
        prism = require("prismjs"),
        api = require("@/assets/api"),
        utility = require("@/assets/utility");

    require("prismjs/themes/prism.css");

    module.exports = {
        components: {
            "vue-tab-buttons": require("@/components/vue-tab-buttons").default
        },
        computed: {
            formatCode() {
                var lang = prism.languages.javascript;

                if (this.tx.data)
                    if (this.tx.type == "deploy")
                        return prism.highlight(jsBeautify(JSON.parse(this.tx.data).Source), lang);
                    else if (this.tx.type == "call")
                        return prism.highlight(jsBeautify(this.tx.data), lang);

                return "0x0";
            },
            txType() {
                // type=binary      【前端显示：Normal】
                // type=deploy      【前端显示：deploy contract】
                // type=call        【前端显示：call contract】
                // type=candidate   【前端显示：dpos candidate】
                // type=delegate    【前端显示：dpos delegate】
                if (this.tx) switch (this.tx.type) {
                    default:
                    case "binary": return "normal";
                    case "deploy": return "deploy contract";
                    case "call": return "call contract";
                    case "candidate": return "dpos candidate";
                    case "delegate": return "dpos delegate";
                } else
                    return "";
            },
            urlChange() {
                api.getTx(this.$route.params.id, o => {
                    this.tx = o;
                }, xhr => {
                    this.$router.replace((this.$route.params.api ? "/" + this.$route.params.api : "") + "/404!" + this.$route.fullPath);
                });
            }
        },
        data() {
            return {
                fragApi: this.$route.params.api ? "/" + this.$route.params.api : "",
                tab: 0,
                tabButtons: ["Overview"],
                tx: null
            };
        },
        methods: {
            numberAddComma(n) {
                return utility.numberAddComma(n);
            },
            timeConversion(ms) {
                return utility.timeConversion(ms);
            },
            toWei(n) {
                return utility.toWei(n);
            }
        }
    };
</script>
<style>
    .vue-tx .table tbody tr td {
        border: 0;
    }

    .vue-tx td.code {
        background-color: #f8f9fa;
    }

    .vue-tx td.text {
        white-space: pre-line;
    }
    .vue-tx .fail {
        color:red;
    }
    .vue-tx .success {
        color:green;
    }

    /* 更新的样式 */
    .vue-tx .list-item{
        box-sizing: border-box;
        width: 100vw;
        padding:10px 0;
        word-break: break-all; 
        word-wrap:break-word;
    }
    @media (min-width: 991px) {
        .vue-tx .list-item{
            display: flex;
        }
        .vue-tx .list-item .name{
            width: 160px;
        }
    }
    .vue-tx .list-item .name{
        font-size: 13px;
        color: #000;
        margin-bottom: 0;
    }
    .vue-tx .list-item .list-item-content{
        padding-right: 15px;
        word-break: break-all; 
        word-wrap:break-word;
    }
    </style>