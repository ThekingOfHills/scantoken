
var Vue = require("vue").default,
    VueRouter = require("vue-router").default,
    vApp = {},
    vAppConfig = require("@/assets/app-config"),
    vRouter = new VueRouter({ routes: require("@/assets/routes") });

import ElementUI from 'element-ui';

require("bootstrap");
require("bootstrap/dist/css/bootstrap.min.css");
import 'element-ui/lib/theme-chalk/index.css';
require("font-awesome/css/font-awesome.min.css");
require("./index.css");


Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(ElementUI);
vRouter.beforeEach(onBeforeEach);

vApp = new Vue({
    components: {
        "vue-footer": require("@/components/vue-footer").default,
        "vue-header": require("@/components/vue-header").default,
        "vue-modal": require("@/components/vue-modal").default
    },
    data: {
        search: "",
        showModalLoading: false,
        urlBefore404: ""
    },
    el: ".vue",
    router: vRouter
});

////////////////////////////////////////////////////////////
//
// api prefix

function onBeforeEach(to, from, next) {
    var apiPrefix, first, params, path;

    for (first in vAppConfig.apiPrefixes) break;

    if (to.name == "*") {
        vApp.urlBefore404 = to.fullPath;
        path = (from.params.api ? "/" + from.params.api : "") + "/404";
    } else if (to.params.api)
        if (to.params.api in vAppConfig.apiPrefixes)
            if (to.params.api == first) {
                // mainnet/xxx -> /xxx
                to.params.api = undefined;
                path = vRouter.resolve({ params: to.params }, to).resolved.fullPath;
            } else
                apiPrefix = vAppConfig.apiPrefixes[to.params.api].url;
        else {
            vApp.urlBefore404 = to.fullPath;
            path = (from.params.api ? "/" + from.params.api : "") + "/404";
        }
    else
        apiPrefix = vAppConfig.apiPrefixes[first].url;

    sessionStorage.apiPrefix = apiPrefix;
    next(path);
}
