<template>
    <div class="med_popup">
        <div class="popup_header">
            <slot name="popup_header"></slot>
        </div>
        <div class="popup_body">
            <slot name="popup_body"></slot>
        </div>
        <div class="popup_footer">
            <slot name="popup_footer"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "popup"
    }
</script>

<style scoped lang="scss">
    .med_popup {
        display: flex;
        flex-direction: column;
        position: absolute;
        z-index: 3;
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        margin: 10px;
        box-shadow: 1px 1px 5px black;
        background-color: #f8f5ef;
    }

    .popup_header {
        height: 4rem;
        display: flex;
    }

    .popup_body {
        flex: 1;
        display: flex;
        overflow: auto;
    }

    .popup_footer {
        height: 2.5rem;
        padding: 5px;
        display: flex;
        justify-content: flex-end;
    }
</style>