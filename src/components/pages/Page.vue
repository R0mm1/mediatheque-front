<template>
    <div id="med_page" :class="cClass">

        <div id="med_page_header">
            <slot name="med_page_header">
                <Header :no-user="noUser" :custom-header-message="customHeaderMessage"/>
            </slot>
        </div>

        <div id="med_page_body">
            <slot name="med_page_body"/>
        </div>

        <div id="med_page_footer">
            <slot name="med_page_footer"/>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Page",
        props: {
            noUser: {default: false, type: Boolean},
            customHeaderMessage: {default: '', type: String},
            name: {default: null, type: String}
        },
        data(){
          return {
              class: ''
          }
        },
        components: {
            Header: () => import('./Header')
        },
        computed: {
            cClass(){
                let classes = [];
                if(this.name !== null){
                    classes.push(this.name);
                }
                return classes;
            }
        }
    }
</script>

<style scoped>
    #med_page {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    #med_page_body {
        overflow: auto;
        position: relative;
        flex: 1;
    }
</style>
