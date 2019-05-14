<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        components: {}
    }
</script>

<style>
    html {
        height: 100%;
    }

    body {
        margin: 0;
        height: 100%;
        font-family: sans-serif;
    }

    #app {
        height: 100%;
    }
</style>
