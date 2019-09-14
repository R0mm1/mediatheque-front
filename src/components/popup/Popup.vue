<template>
    <div class="med_popup">
        <div class="popup_header">
            <slot name="popup_header"></slot>
        </div>
        <div class="popup_body">
            <div class="popup_loader" :class="{no_loading: loaded}">
                <Loader></Loader>
            </div>
            <slot name="popup_body"></slot>
        </div>
        <div class="popup_footer">
            <slot name="popup_footer"></slot>
        </div>
    </div>
</template>

<script>
    import Loader from "../widgets/Loader";

    export default {
        name: "popup",
        components: {Loader},
        props: {
            loaded: {type: Boolean, default: false}
        }
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
        position: relative;
        flex: 1;
        display: flex;
        overflow: hidden;
    }

    .popup_footer {
        height: 2.5rem;
        padding: 5px;
        display: flex;
        justify-content: flex-end;
    }

    .popup_loader{
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #f8f5ef;
        z-index: 1;
        text-align: center;
        transition: opacity .3s;

        &.no_loading{
            opacity: 0;
            visibility: hidden;
        }
    }
</style>
