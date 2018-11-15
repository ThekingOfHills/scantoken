<style>
    .vue-oops .image {
        height: 400px;
    }

    .vue-oops .keyword {
        font-size: 25px;
        overflow-wrap: break-word;
    }
</style>
<template>
    <div class="container vue-oops">
        <div class=text-center>
            <h1>Oops!</h1>
            <h3>The search string you entered was:</h3>
            <div class=keyword>{{ $root.search }}</div>
            <h4>Sorry! This is an invalid search string.</h4>
        </div>
        <div class=image></div>
    </div>
</template>
