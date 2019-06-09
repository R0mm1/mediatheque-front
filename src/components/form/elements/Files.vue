<template>
    <FormElement :label="label" :name="name" container-custom-classes="form_element_files">

        <template v-slot:element_content>

            <SimpleList :elements="cListElements" :actions="cListRowActions"></SimpleList>

            <div class="files_buttons">
                <InputButton v-if="!isFileLoading" name="add" value="Ajouter" :disabled="cMaxFilesReached"
                             v-on:click.native="displayFileChooser"></InputButton>
            </div>

            <Loader class="loader" v-if="isFileLoading" type="s"></Loader>

            <input ref="inputFile" type="file" :name="name" v-on:change="addFile"/>

        </template>

    </FormElement>
</template>

<script>
    import FormElement from "../FormElement";
    import InputButton from "./InputButton";
    import Loader from "../../widgets/Loader";
    import MedFile from "../../../assets/js/medFile";
    import SimpleList, {Element, Action} from "../../widgets/SimpleList";

    export default {
        name: "Files",
        components: {SimpleList, Loader, InputButton, FormElement},
        props: {
            label: {default: '', type: String},
            name: {default: '', type: String},
            maxFiles: {default: () => null, type: Number},
            downloadAction: {default: () => false, type: Function},
            files: {type: Array, required: true},
            onFileAdded: {type: Function, required: true},
            onFileRemoved: {type: Function}
        },
        data() {
            return {
                isFileLoading: false,
                listRowActions: [
                    new Action('fas fa-trash-alt', this.onFileRemoved)
                ]
            }
        },
        methods: {
            displayFileChooser() {
                if (!this.cMaxFilesReached) {
                    this.$refs.inputFile.click();
                }
            },
            addFile(e) {
                this.isFileLoading = true;
                let file = new MedFile(e.target.files[0], e.target.files[0].name, null, true);
                Promise.resolve(this.onFileAdded(file))
                    .then(() => {
                        this.isFileLoading = false;
                    });
            },
            downloadFile(fileId) {
                if (this.cIsDownloadEnabled) {
                    this.downloadAction(fileId);
                }
            }
        },
        computed: {
            cIsDownloadEnabled() {
                return (typeof this.downloadAction === 'function');
            },
            cMaxFilesReached() {
                if (this.maxFiles === null) {
                    return false;
                }
                return Object.keys(this.files).length >= this.maxFiles;
            },
            cListElements() {
                return this.files.map(medFile => {
                    return new Element(medFile.id, medFile.name);
                });
            },
            cListRowActions() {
                let actions = [];
                if (typeof this.onFileRemoved === 'function') {
                    actions.push(new Action('fas fa-trash-alt', this.onFileRemoved));
                }
                if (this.cIsDownloadEnabled) {
                    actions.push(new Action('fas fa-file-download', this.downloadFile));
                }
                return actions;
            }
        }
    }
</script>

<style scoped>
    input[type='file'] {
        display: none;
    }

    .files_buttons .form_element_button {
        float: right;
    }
</style>

<style lang="scss">
    .form_element_files {
        > .element_label {
            line-height: 2rem;
        }

        .element_content {
            margin-top: 5px;
        }
    }
</style>