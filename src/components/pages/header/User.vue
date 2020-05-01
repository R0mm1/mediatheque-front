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
    @import "../../../assets/scss/breakpoints";

    #headerUserElement {
        padding: 10px 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        @include phone-portrait{
            padding: 10px 5px;
        }

        .form_element_button {
            $dimension: 30px;
            $dimension-phone-portrait: 24px;

            border-radius: 50%;
            height: $dimension;
            width: $dimension;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 25px;
            color: #2b2b2b;

            @include phone-portrait{
                height: $dimension-phone-portrait;
                width: $dimension-phone-portrait;
                border-radius: 5px;
            }

            label {
                height: $dimension;
                line-height: $dimension;
                width: initial !important;
                margin-left: 0 !important;

                @include phone-portrait{
                    height: $dimension-phone-portrait;
                    line-height: $dimension-phone-portrait;
                }
            }
        }
    }
</style>
