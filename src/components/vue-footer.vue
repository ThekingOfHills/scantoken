<style>
    .vue-footer {
        background-color: #222;
        margin-top: 30px;
        overflow: auto;
    }

    .vue-footer a {
        color: inherit;
    }

    .vue-footer h4 {
        margin-bottom: 20px;
        padding: 20px 0 10px;
        text-align: center;
    }

    .vue-footer .container {
        margin-bottom: 30px;
    }

    .vue-footer .fa {
        text-align: center;
        width: 14px;
    }
</style>
<template>
    <div class=vue-footer>
        <div class=container>
            <h4>About</h4>
            <div class="justify-content-center row">
                <!--<div class=col-1><img src="/static/img/logo2.png" height="65px" width="65px"></div>-->
                <div class=col-2></div>
                <div class=col-4 style="text-align: center">
                    <div>
                        <span class="fa fa-facebook-f" aria-hidden=true></span>
                        <a target=_blank href=#>Facebook</a>
                    </div>
                    <div>
                        <span class="fa fa-slack" aria-hidden=true></span>
                        <a target=_blank href=#>Slack</a>
                    </div>
                    <div>
                        <span class="fa fa-twitter" aria-hidden=true></span>
                        <a target=_blank href=#>Twitter</a>
                    </div>
                </div>
                <div class=col-4 style="text-align: center">
                    <div>
                        <span class="fa fa-github" aria-hidden=true></span>
                        <a target=_blank href=https://github.com>Github.com</a>
                    </div>
                    <div>
                        <span class="fa fa-github" aria-hidden=true></span>
                        <a target=_blank href=https://github.com>Issue</a>
                    </div>
                    <div>
                        <span class="fa fa-github" aria-hidden=true></span>
                        <a target=_blank href=https://github.com>Commit</a>
                    </div>
                    <!--</div>-->
                </div>
                <div class=col-2></div>
            </div>
        </div>
    </div>
</template>
