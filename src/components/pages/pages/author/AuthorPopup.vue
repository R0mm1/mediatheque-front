<template>
    <Popup id="authorPopup" :loaded="loaded">
        <template v-slot:popup_header>
            <div class="header_separator"></div>
            <InputButton v-on:click.native="$emit('popup-wanna-close')"
                         :label-custom-classes="'fas fa-times'" :custom-classes="['button_close']"/>
        </template>

        <template v-slot:popup_body>
            <Group>
                <template v-slot:group_name>
                    Informations
                </template>

                <template v-slot:group_content>
                    <InputText name="firstname" label="Prénom" v-model="firstname"/>
                    <InputText name="lastname" label="Nom" v-model="lastname"/>
                </template>
            </Group>
        </template>

        <template v-slot:popup_footer>
            <InputButton name="save" value="Enregistrer" type="submit" v-on:click.native="save"
                         v-if="isModified"/>
        </template>

    </Popup>
</template>

<script>
    const config = require('../../../../../mediatheque');

    import Popup from "../../../popup/Popup";
    import InputText from '../../../form/elements/InputText';
    import InputButton from '../../../form/elements/InputButton';
    import Group from "../../../popup/Group";

    import authorModule from "../../../../assets/ts/store/AuthorModule";

    export default {
        name: "AuthorPopup",
        components: {Group, Popup, InputText, InputButton},
        props: {
            authorId: {default: null}
        },
        data() {
            return {
                loaded: false
            }
        },
        methods: {
            save() {
                authorModule.save()
                    .then(() => {
                        this.$toasted.show("L'auteur a été sauvegardé", {
                            ...config.default.notification_settings,
                            type: 'success',
                            icon: 'fa-check',
                        });
                        this.$emit('author-saved');
                    })
                    .catch(error => {
                        console.error(error);
                        alert("Une erreur s'est produite et l'auteur n'a pas pu être sauvegardé");
                    })
            },
        },
        computed: {
            firstname: {
                get() {
                    return authorModule.author.firstname;
                },
                set(firstname) {
                    authorModule.setFirstname(firstname);
                }
            },
            lastname: {
                get() {
                    return authorModule.author.lastname;
                },
                set(lastname) {
                    authorModule.setLastname(lastname);
                }
            },
            isModified() {
                return authorModule.flagService.flags.isModified;
            }
        },
        watch: {
            authorId(newAuthorId) {
                if (newAuthorId) {
                    authorModule.get(newAuthorId);
                }
            }
        },
        created() {
            if (this.authorId) {
                authorModule.get(this.authorId);
            } else {
                authorModule.new();
            }
            this.loaded = true;
        }
    }
</script>

<style lang="scss">
    #authorPopup {
        .header_separator {
            flex: 1;
        }

        .button_close {
            width: 4rem;
            margin: 0;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: center;

            label {
                font-size: 2rem;
            }
        }
    }
</style>
