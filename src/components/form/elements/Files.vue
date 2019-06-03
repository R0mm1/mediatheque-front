<template>
    <FormElement :label="label" :name="name" container-custom-classes="form_element_files">

        <template v-slot:element_content>

            <div v-for="file in files" :key="file.id" class="file_row">
                <div class="name">{{file.name}}</div>
                <InputButton name="delete" label-custom-classes="fas fa-trash-alt"
                             v-if="typeof onFileRemoved === 'function'"
                             v-on:click.native="onFileRemoved(file.id)"></InputButton>
                <InputButton name="download" label-custom-classes="fas fa-file-download"
                             v-on:click.native="downloadFile(file.id)" v-if="cIsDownloadEnabled"></InputButton>
            </div>

            <InputButton v-if="!isFileLoading" name="add" value="Ajouter" :disabled="cMaxFilesReached"
                         v-on:click.native="displayFileChooser"></InputButton>

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

    export default {
        name: "Files",
        components: {Loader, InputButton, FormElement},
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
            }
        }
    }
</script>

<style scoped>

</style>