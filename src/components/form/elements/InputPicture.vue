<template>
    <FormElement :name="name" :container-custom-classes="'form_element_picture'">

        <template v-slot:element_label><span></span></template>

        <template v-slot:element_content>
            <div class="picture_preview" v-on:click="displayFileChooser"
                 :style="'background-image: url('+pictureSrc+')'">
                <Loader class="loader" v-if="isPictureLoading" :type="'s'"></Loader>
                <div class="preview_default" v-if="displayDefault && !isPictureLoading">
                    <i class="far fa-image"></i>
                </div>
            </div>
            <div class="picture_buttons">
                <InputButton :label-custom-classes="'fas fa-file-upload'"
                             v-on:click.native="displayFileChooser"></InputButton>
                <InputButton :label-custom-classes="'fas fa-file-download'" v-if="false"></InputButton>
                <!--todo: à faire -->
                <InputButton :label-celementustom-classes="'fas fa-trash-alt'" v-on:click.native="clear"></InputButton>
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
            src: {type: String, required: true},
            autofillSrcOnChange: {Boolean, default: false}
        },
        data() {
            return {
                pictureSrc: '',
                displayDefault: true,
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

                this.displayDefault = false;

                if (this.autofillSrcOnChange) {
                    this.pictureSrc = URL.createObjectURL(file);
                }

                this.$emit('picture-changed', file);

                this.isPictureLoading = false;
            },
            clear() {
                this.displayDefault = true;
            },
            setSrc(newSrc) {
                this.pictureSrc = newSrc;
                this.displayDefault = (newSrc.length === 0);
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
            height: 30px;
            position: absolute;
            right: 0;
            bottom: 10px;
        }
    }

    .picture_buttons {
        text-align: center;
    }
</style>