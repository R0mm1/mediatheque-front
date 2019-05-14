<template>
    <FormElement :label="label" :name="name" container-custom-classes="form_element_files">

        <template v-slot:element_content>

            <div v-for="file in files" :key="file.id" class="file_row">
                <div class="name">{{file.name}}</div>
                <InputButton name="delete" label-custom-classes="fas fa-trash-alt"
                             v-on:click.native="$emit('file-removed', file.id)"></InputButton>
                <InputButton name="download" label-custom-classes="fas fa-file-download"
                             v-on:click.native="downloadFile(file.id)" v-if="cIsDownloadEnabled"></InputButton>
            </div>

            <InputButton v-if="!isFileLoading" name="add" value="Ajouter" :disabled="cMaxFilesReached"></InputButton>

            <Loader class="loader" v-if="isFileLoading" type="s"></Loader>

            <input ref="inputFile" type="file" :name="name" v-on:change="addFile">

        </template>

    </FormElement>
</template>

<script>
    import FormElement from "../FormElement";
    import InputButton from "./InputButton";
    import Loader from "../../widgets/Loader";

    export default {
        name: "Files",
        components: {Loader, InputButton, FormElement},
        props: {
            label: {default: '', type: String},
            name: {default: '', type: String},
            maxFiles: {default: () => false, type: Number},
            downloadAction: {default: () => false, type: Function},
            files: {type: Array, required: true},
            onFileAdded: {type: Function, required: true}
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
                let file = new FileObject(e.target.files[0].name);
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
                if (this.maxFiles === false) {
                    return false;
                }
                return Object.keys(this.files).length >= this.maxFiles;
            }
        }
    }


    /**
     * Object representing a file
     * @param name string
     * @param id string
     */
    let FileObject = function (name, id) {
        this.name = name;
        this.id = id ? id : +new Date();
    };

    export {FileObject};
</script>

<style scoped>

</style>