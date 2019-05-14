<template>
    <div id="med_page">

        <div id="med_page_header">
            <slot name="med_page_header">
                <Header :no-user="noUser" :custom-header-message="customHeaderMessage"></Header>
            </slot>
        </div>

        <div id="med_page_body">
            <slot name="med_page_body"></slot>
        </div>

        <div id="med_page_footer">
            <slot name="med_page_footer"></slot>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Page",
        props: {
            noUser: {default: false},
            customHeaderMessage: {default: ''}
        },
        components: {
            Header: () => import('./Header')
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