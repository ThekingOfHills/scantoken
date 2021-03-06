
var { ajax, ajaxSplitAction, getEthereumaiNetHost } = require("@/assets/utility");

module.exports = {
    // get api/account?
    // - p      - 页码, 默认 1
    getAccount(p, done, fail) {
        ajax1("account", { p }, function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }, fail);
    },


    // get api/address?
    // - p      - 页码, 默认 1
    // - part   - mine
    // get api/address/
    // - <hash>
    getAddress(t, done, fail) {
        // wtf - webpack 对 if (typeof t == "object") 报异常
        if (eval('typeof t == "object"')){
            ajax1("address", t, d, fail);
        }else{
            ajax1("address/" + t, null, d, fail);
        }
            

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },
    getTransactionByContract(t, netname, done, fail) {
        var host =  getEthereumaiNetHost(netname)
        ajax('POST ' + host + '/user/getTransactionByContract', t, done, fail)
    },

    // get api/token:id
    getTokenInfo(t, done, fail) {
        // wtf - webpack 对 if (typeof t == "object") 报异常
        if (eval('typeof t == "object"')){
            ajax("http://159.138.5.32:8080/tokens", t, d, fail);
        }else{
            ajax("http://159.138.5.32:8080/tokens/" + t, null, d, fail);
        }
            
        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },
    // get tokenTransfers info
    getTokenTransfer(id,p=1,done,fail){
        ajax(`http://159.138.5.32:8080/tokens/${id}/transfers?p=${p}` , null, d, fail);
        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },
    // get tokenHolders info
    getTokenHolders(id,p=1,done,fail){
        ajax(`http://159.138.5.32:8080/tokens/${id}/holders?p=${p}` , null, d, fail);
        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },
    getTokenTransferFilter(id,filter,pageNum=1,done,fail){
        ajax(`http://159.138.5.32:8080/tokens/${id}/transfers?p=${pageNum}&a=${filter}` , null, d, fail);
        // console.log(`http://159.138.5.32:8080/tokens/${id}/transfers?p=${p}&a=${filter}`);
      
        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },
    // get api/block?
    // - p      - 页码, 默认 1
    // - m      - miner hash
    // - type   - 目前只有 latest
    // get api/block/
    // - <id or hash>
    getBlock(t, done, fail) {
        // wtf - webpack 对 if (typeof t == "object") 报异常
        if (eval('typeof t == "object"'))
            ajax1("block", t, d, fail);
        else
            ajax1("block/" + t, null, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },

    // get api/market_cap
    getMarketCap(done, fail) {
        ajax1("market_cap", null, function (s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }, fail);
    },

    getSearch(q, done, fail) {
        ajax1("search", { q }, function (s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }, fail);
    },

    // get api/tx?
    // - a          - address hash
    // - block      - block height
    // - isPending
    // - p          - 页码, 默认 1
    // - type       - 目前只有 latest
    // get api/tx/
    // - cnt_static
    // - <id or hash>
    getTx(t, done, fail) {
        // wtf - webpack 对 if (typeof t == "object") 报异常
        if (eval('typeof t == "object"'))
            ajax1("tx", t, d, fail);
        else
            ajax1("tx/" + t, null, d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },

    getSummerInfo(t, done, fail) {
        // wtf - webpack 对 if (typeof t == "object") 报异常
        ajax1("summerInfo",null,d, fail);

        function d(s, xhr) {
            var o = JSON.parse(s);

            if (o.code == 0)
                done(o.data);
            else if (typeof fail == "function")
                fail(xhr);
        }
    },



};

function ajax1(action, args, done, fail) {
    var a = ajaxSplitAction(action);
    return ajax(a[0] + " " + sessionStorage.apiPrefix + a[1], args, done, fail);
}
