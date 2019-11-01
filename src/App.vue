<template>
    <v-app id="app">
        <router-view></router-view>
    </v-app>
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
        overflow-y: hidden !important;
    }

    body {
        margin: 0;
        height: 100%;
    }

    body, .v-application{
        font-family: sans-serif !important;
    }

    #app {
        height: 100%;
    }

    *:not(.v-input) {
        box-sizing: unset;
    }
</style>
