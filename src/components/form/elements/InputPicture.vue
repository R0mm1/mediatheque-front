<template>
    <FormElement :name="name" container-custom-classes="form_element_picture">

        <template v-slot:element_label><span></span></template>

        <template v-slot:element_content>
            <div class="picture_preview" v-on:click="displayFileChooser"
                 :style="'background-image: url('+pictureSrc+')'">
                <Loader class="loader" v-if="isPictureLoading" type="s"></Loader>
                <div class="preview_default" v-if="!hasPictureLoaded && !isPictureLoading">
                    <i class="far fa-image"></i>
                </div>
            </div>
            <div class="picture_buttons">
                <InputButton label-custom-classes="fas fa-file-upload" b-style="negative"
                             v-on:click.native="displayFileChooser"></InputButton>
                <InputButton label-custom-classes="fas fa-file-download" b-style="negative"
                             v-on:click.native="download" :disabled="!hasPictureLoaded"></InputButton>
                <InputButton label-custom-classes="fas fa-trash-alt" b-style="negative"
                             v-on:click.native="clear" :disabled="!hasPictureLoaded"></InputButton>
            </div>
            <input ref="inputFile" type="file" :name="name" v-on:change="reloadPreview">
        </template>

    </FormElement>
</template>

<script>
    import FormElement from './../FormElement';
    import InputButton from './InputButton';
    import Loader from '../../widgets/Loader';

    export default {
        name: "InputPicture",
        components: {Loader, InputButton, FormElement},
        props: {
            name: {type: String, default: ''},
            src: {type: Promise, required: true},
            autofillSrcOnChange: {Boolean, default: false}
        },
        data() {
            return {
                pictureSrc: '',
                isPictureLoading: false
            }
        },
        methods: {
            displayFileChooser() {
                this.$refs.inputFile.click();
            },
            reloadPreview(e) {
                this.isPictureLoading = true;

                let file = e.target.files[0];

                if (this.autofillSrcOnChange) {
                    this.pictureSrc = URL.createObjectURL(file);
                }

                this.$emit('picture-changed', file);

                this.isPictureLoading = false;
            },
            clear() {
                if (!this.hasPictureLoaded) {
                    return;
                }

                this.pictureSrc = '';
                this.$emit('picture-changed', undefined);
            },
            download() {
                if (!this.hasPictureLoaded) {
                    return;
                }

                let a = document.createElement('a');
                a.href = this.pictureSrc;
                a.download = 'picture';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            },
            setSrc(newSrc) {
                this.isPictureLoading = true;
                Promise.resolve(newSrc)
                    .then(src => {
                        this.pictureSrc = src;
                        this.isPictureLoading = false;
                    })
                    .catch(error => {
                        console.error(error);
                        this.isPictureLoading = false;
                    });
            }
        },
        computed: {
            hasPictureLoaded() {
                return this.pictureSrc.length > 0;
            }
        },
        watch: {
            src(newSrc) {
                this.setSrc(newSrc);
            }
        },
        created() {
            this.setSrc(this.src);
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/scss/colors";
    @import "../../../assets/scss/breakpoints";

    input[type="file"] {
        display: none;
    }

    .picture_preview {
        display: flex;
        width: 160px;
        height: 251px;
        margin: auto;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        position: relative;

        .preview_default {
            margin: auto;
            font-size: 5rem;
            color: #4d4d4d;
        }

        .loader {
            height: 50px;
            margin: auto;
        }
    }

    .picture_buttons {
        display: flex;
        justify-content: center;
        border-top: 1px solid $shade2;
        padding-top: 7px;
        margin-top: 10px;

        @include phone-portrait {
            border-top: none;
            padding-top: 0;
            flex-direction: column;
            margin-right: 25px;
            margin-top: 0;
        }

        .form_element_button {
            width: 15px;
            margin: 0 3px;
            height: 15px;
            text-align: center;
            border-radius: 5px;

            @include phone-portrait {
                margin: 3px 0;
            }
        }
    }
</style>

<style lang="scss">
    @import "../../../assets/scss/breakpoints";

    @include phone-portrait {
        .form_element_picture {
            > .element_content {
                display: flex;
                flex-direction: row;
            }

            > .element_label {
                display: none;
            }
        }
    }
</style>
