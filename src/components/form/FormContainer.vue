<template>
    <div class="med_form">
        <h2 class="form_title">
            <slot name="form_title"></slot>
        </h2>

        <form class="form_body">
            <slot name="form_body"></slot>

            <div class="body_actions">

                <div class="action_cancel">
                    <slot name="action_cancel">
                        <InputButton v-on:click.native="cancelAction" :value="cancelLabel"></InputButton>
                    </slot>
                </div>

                <div class="action_separator"></div>

                <div class="action_validate">
                    <slot name="action_validate">
                        <InputButton v-on:click.native="validate" :value="validateLabel" type="submit"
                                     :disabled="!isValid"></InputButton>
                    </slot>
                </div>

            </div>
        </form>
    </div>
</template>

<script>

    export default {
        name: "FormContainer",
        components: {
            InputButton: () => import("../form/elements/InputButton")
        },
        props: {
            validateLabel: {default: 'Valider'},
            cancelLabel: {default: 'Annuler'},
            validateAction: {
                default: () => {
                }
            },
            cancelAction: {
                default: () => {
                }
            },
            validationMethod: {
                default: () => true,
                type: Function
            }
        },
        methods: {
            validate(e) {
                if (this.isValid) {
                    this.validateAction();
                    e.preventDefault();
                }
            }
        },
        computed: {
            isValid() {
                return this.validationMethod();
            }
        }
    }
</script>

<style scoped lang="scss">
    .form_title {
        font-size: 1.1rem;
        font-weight: 500;
        margin: 0 0 5px 0;
        border-bottom: 1px solid #e4dccc;
        padding-bottom: 3px;
    }

    .body_actions {
        display: flex;

        .action_separator {
            flex: 1;
        }
    }
</style>