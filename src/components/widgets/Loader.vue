<template>
    <img :src="'/images/loaders/'+type+'.svg'">
</template>

<script>
    export default {
        name: "Loader",
        props: {
            type: {
                default: 'b'
            }
        }
    }
</script>

<style scoped>
</style>