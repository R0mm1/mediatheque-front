<template>
    <div id="headerUserElement">
        <InputButton :name="'userAccount'" :label-custom-classes="'fas fa-user-circle'"
                     v-on:click.native="goToAccount"/>
    </div>
</template>

<script>
    import InputButton from "../../form/elements/InputButton";

    export default {
        name: "User",
        components: {InputButton},
        methods: {
            goToAccount: function () {
                window.location = '/account'
            }
        }
    }
</script>

<style lang="scss">
    #headerUserElement {
        padding: 10px 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .form_element_button {
            $dimension: 30px;

            border-radius: 50%;
            height: $dimension;
            width: $dimension;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 25px;
            color: #2b2b2b;

            label {
                height: $dimension;
                line-height: $dimension;
                width: initial !important;
                margin-left: 0 !important;
            }
        }
    }
</style>
