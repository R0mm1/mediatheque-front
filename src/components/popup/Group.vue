<template>
    <div class="med_popup_group">
        <div class="group_header">
            <h2 class="group_name">
                <slot name="group_name"></slot>
            </h2>

            <div class="group_customActions">
                <slot name="group_customActions"></slot>
            </div>
        </div>

        <div class="group_content">
            <slot name="group_content"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Group"
    }
</script>

<style scoped lang="scss">
    .med_popup_group {
        margin: 10px;
        display: flex;
        flex-direction: column;
    }

    .group_header {
        $headerHeight: 1.7rem;

        display: flex;
        height: $headerHeight;
        margin-bottom: 7px;

        .group_name {
            flex: 1;
            line-height: $headerHeight;
        }

        .group_customActions .form_element_button {
            height: 1.7rem;
            margin: 0;
            padding: 0;
            line-height: $headerHeight;
            width: $headerHeight;
            text-align: center;
        }
    }

    .group_name {
        border-left: 3px solid #e4dccc;
        padding-left: 5px;
        margin: 0;
        font-size: 1.2rem;
        font-weight: 500;
    }
    
    .group_content{
        position: relative;
        flex: 1;
    }
</style>