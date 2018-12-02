
<template>
    <nav class="navbar navbar-expand-lg navbar-light vue-header" style="background-color: #FFFFFF;border-bottom: solid 2px #eee">
        <div class=container>
            <div>
                <router-link :to="fragApi + '/'" class=navbar-brand>
                    <img src=/static/img/logo.png width=210 alt="">
                </router-link>
            </div>

            <button class=navbar-toggler type=button data-toggle=collapse data-target=#navbarSupportedContent aria-controls=navbarSupportedContent aria-expanded=false aria-label="Toggle navigation">
                <span class=navbar-toggler-icon></span>
            </button>
            <div class="collapse navbar-collapse" id=navbarSupportedContent>
                <ul class="navbar-nav mr-auto">
                    <li class=nav-item :class="{ active: $route.meta.headerActive == 1 }">
                        <router-link :to="fragApi + '/'" class=nav-link>HOME
                            <span class=sr-only>(current)</span>
                        </router-link>
                    </li>
                    <li class="dropdown nav-item" :class="{ active: $route.meta.headerActive == 2 }">
                        <a class="nav-link dropdown-toggle" href=# id=header-dropdown-blockchain role=button data-toggle=dropdown aria-haspopup=true aria-expanded=false>BLOCKCHAIN</a>
                        <div class=dropdown-menu aria-labelledby=header-dropdown-blockchain>
                            <router-link class=dropdown-item :to="fragApi + '/txs'">View Txns</router-link>
                            <router-link class=dropdown-item :to="fragApi + '/txs/pending'">View Pending Txns</router-link>
                            <router-link class=dropdown-item :to="fragApi + '/blocks'">View Blocks</router-link>
                        </div>
                    </li>
                    <li class=nav-item :class="{ active: $route.meta.headerActive == 3 }">
                        <router-link class=nav-link :to="fragApi + '/accounts'">ACCOUNT</router-link>
                    </li>
                    <!--
                    <li class="dropdown nav-item">
                        <a class="nav-link dropdown-toggle" href=# id=header-dropdown-misc role=button data-toggle=dropdown aria-haspopup=true aria-expanded=false>{{ MenuMisc }}</a>
                        <div class=dropdown-menu aria-labelledby=header-dropdown-misc>
                            <a v-for="(o, i) in apiPrefixes" class=nav-link href=# v-on:click.prevent=apiSwitch(i)>
                                <span class="fa fa-check" :class="{ 'visibility-hidden': paramsApi != i }" aria-hidden=true></span>
                                {{ o.name }}
                            </a>
                        </div>
                    </li>
                    -->
                </ul>
                <form class=form-inline v-on:submit.prevent="onSubmit">
                    <div style="display: inline; height: 31px;" class="clearfix">
                     <input class="form-control mr-sm-2 search-input" v-model="search" maxlength="66" placeholder="Search by Address / Txhash / Block / Token" autocomplete="off">
                     <button class="btn-u" type="submit" >GO</button>
                    </div>
                </form>
            </div>
        </div>
    </nav>
</template>
<script>
    var api = require("@/assets/api"),
        appConfig = require("@/assets/app-config");

    module.exports = {
        data() {
            return {
                apiPrefixes: null,
                fragApi: "",
                paramsApi: "",
                search: "",
                MenuMisc:"MISC"
            };
        },
        methods: {
            apiSwitch(s) {
                var api = this.$route.params.api || "";
                if (api != s) {
                    this.$router.replace("/" + s);
                    location.reload();
                }
            },
            onSubmit() {
                this.$root.showModalLoading = true;
                api.getSearch(this.search, o => {
                    this.$root.showModalLoading = false;
                    this.search = "";
                    // 判断了这里的type 然后在进行跳转的到这个数据的请求鹅具体位置
                    console.log(o);
                    if (o.type == "block")
                        this.$router.push(this.fragApi + "/block/" + o.q);
                    else if (o.type == "address")
                        this.$router.push(this.fragApi + "/address/" + o.q);
                    else if (o.type == "tx")
                        this.$router.push(this.fragApi + "/tx/" + o.q);
                    else if(o.type == 'token')
                        this.$router.push(this.fragApi + "/tokens/" + o.q);
                    else {
                        this.$root.search = o.q;
                        this.$router.push((this.$route.params.api ? "/" + this.$route.params.api : "") + "/oops");
                    }
                }, () => {
                    this.$root.search = this.search;
                    this.$root.showModalLoading = false;
                    this.search = "";
                    this.$router.push((this.$route.params.api ? "/" + this.$route.params.api : "") + "/oops");
                });
            }
        },
        mounted() {
            var paramsApi = this.$route.params.api, apiPrefixes = {}, i, first = true;

            for (i in appConfig.apiPrefixes)
                if (first) {
                    apiPrefixes[""] = appConfig.apiPrefixes[i];
                    first = false;
                } else
                    apiPrefixes[i] = appConfig.apiPrefixes[i];

            if (!(paramsApi in apiPrefixes))
                paramsApi = "";

            paramsApi == 'testnet' ? this.MenuMisc = 'TESTNET' : this.MenuMisc = 'MAINNET';
            this.apiPrefixes = apiPrefixes;
            this.fragApi = paramsApi ? "/" + paramsApi : "";
            this.paramsApi = paramsApi;

            require("jquery")("[data-toggle=tooltip]").tooltip();
        }
    };
</script>
<style >

    .clearfix:after{
        content:".";
        display:block;
        height:0;
        clear:both;
        visibility:hidden
    }

    @media (min-width: 576px){
        .mr-sm-2, .mx-sm-2 {
            margin-right: 0!important;
        }
    }
    .vue-header a {
        color: inherit;
    }

    .vue-header .dev-version {
        color: #2a88ff;
        left: -15px;
        padding: 5px;
        position: relative;
        top: 10px;
    }

    .vue-header .btn-group-toggle {
        margin-left: 20px;
    }

    .vue-header .btn-group-toggle label {
        padding: 0 10px;
    }

    .vue-header .visibility-hidden {
        visibility: hidden;
    }
    .form-inline .search-input{
        width: 300px;  
        height: 31px;
        font-size: inherit; padding: 1px;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        float: left;
    }

    .btn-u {
        /* background: #3498db; */
        background: #6610f2;
        border: 0;
        color: #fff;
        cursor: pointer;
        white-space: nowrap;

        height: 31px; 
        width: 41px;
        margin-left: -1px;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    @media (min-width: 992px) {
        .vue-header .navbar-nav>li>a {
            border-bottom: 2px solid transparent;
        }

        .vue-header .navbar-nav>li>a:hover,
        .vue-header .navbar-nav>li.active>a,
        .vue-header .navbar-nav>li.show>a {
            /* border-bottom-color: #3498db; */
            border-bottom-color: #6610f2;
        }

        .vue-header.navbar.navbar-default .navbar-nav>li>a {
            background-color: initial;
        }
    }

    @media (max-width: 991px) {
        .vue-header .form-inline {
            align-items: center;
            display: flex;
        }
        .vue-header .form-inline input {
            
        }
    }
    @media (max-width: 370px){
        .form-inline .search-input{
            width: 245px;
        }
    }
</style>
