<template>
    <FormElement :label="label" :name="name" :container-custom-classes="'form_element_wysiwyg'"
                 :label-custom-classes="labelCustomClasses" :no-label="noLabel">

        <template v-slot:element_content>
            <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
        </template>

    </FormElement>
</template>

<script>
    import CKEditor from '@ckeditor/ckeditor5-vue';
    import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
    import FormElement from "../FormElement";

    export default {
        name: "Wysiwyg",
        components: {ckeditor: CKEditor.component, FormElement},
        props: {
            labelCustomClasses: {default: ''},
            label: {default: ''},
            name: {default: ''},
            noLabel: {default: false, type: Boolean},
            content: {default: '', type: String}
        },
        data() {
            return {
                editor: ClassicEditor,
                editorData: '',
                editorConfig: {}
            }
        },
        watch: {
            editorData(newContent) {
                this.$emit('content-changed', newContent);
            },
            content(newValue) {
                this.editorData = newValue;
            }
        },
    }
</script>

<style lang="scss">
    @import "../../../assets/scss/colors";

    .form_element_wysiwyg {
        .ck.ck-toolbar {
            background: transparent !important;
            border-color: $shade1 !important;
        }

        .ck.ck-content {
            border: 1px solid transparent !important;
            box-shadow: none !important;
            background: transparent !important;
            transition: all .3s;
        }

        &:hover .ck.ck-content {
            border: 1px solid $shade1 !important;
            border-bottom-left-radius: 2px !important;
            border-bottom-right-radius: 2px !important;
        }
    }
</style>