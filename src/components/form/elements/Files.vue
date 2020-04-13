<template>
    <FormElement :label="label" :name="name" container-custom-classes="form_element_files">

        <template v-slot:element_content>

            <SimpleList :elements="cListElements" :actions="cListRowActions"></SimpleList>

            <div class="files_buttons">
                <Button v-if="!isFileLoading && !cMaxFilesReached" :button-descriptor="buttonAddDescriptor"
                        v-on:click.native="displayFileChooser"></Button>
            </div>

            <Loader class="loader" v-if="isFileLoading" type="s"></Loader>

            <input ref="inputFile" type="file" :name="name" v-on:change="addFile"/>

        </template>

    </FormElement>
</template>

<script>
    import FormElement from "../FormElement";
    import Loader from "../../widgets/Loader";
    import MedFile from "../../../assets/js/medFile";
    import SimpleList, {Element, Action} from "../../widgets/SimpleList";
    import ButtonDescriptor from "../../../assets/ts/form/ButtonDescriptor";
    import Button from "./Button";

    export default {
        name: "Files",
        components: {Button, SimpleList, Loader, FormElement},
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
                isFileLoading: false
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

                const getButtonDescriptor = (name, faIcon) => {
                    return (new ButtonDescriptor(name)).setFaIcon(faIcon);
                };

                if (typeof this.onFileRemoved === 'function') {
                    actions.push(new Action(getButtonDescriptor('fileRemove', 'fas fa-trash-alt'), this.onFileRemoved));
                }
                if (this.cIsDownloadEnabled) {
                    actions.push(new Action(getButtonDescriptor('fileDownload', 'fas fa-file-download'), this.downloadFile));
                }
                return actions;
            },
            buttonAddDescriptor() {
                return new ButtonDescriptor('add', 'Ajouter');
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

        > .element_content {
            margin-top: 5px;
        }

        .form_element_button2 .element_content {
            display: flex;
            justify-content: end;
        }
    }
</style>
