<template>
    <div id="med_popup_tab">
        <slot name="tab_content"></slot>
    </div>
</template>

<script>
    export default {
        name: "Tab"
    }
</script>

<style scoped lang="scss">
    #med_popup_tab {
        width: 100%;
        display: flex;
        overflow: auto;
        flex: 1;
    }
</style>
