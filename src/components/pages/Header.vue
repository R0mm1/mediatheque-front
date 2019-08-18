<template>
    <header id="vueHeader">
        <div id="mainLogo">
            <img src="/images/logo.png" alt="Médiathèque"/>
        </div>

        <Menu v-if="!noUser"></Menu>
        <div id="customHeaderMessage">{{customHeaderMessage}}</div>

        <User v-if="!noUser"></User>
    </header>
</template>

<script>
    export default {
        name: "Header",
        props: {
            noUser: {default: false},
            customHeaderMessage: {default: ''}
        },
        components: {
            Menu: () => import('./header/Menu'),
            User: () => import('./header/User')
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/scss/colors";

    #vueHeader {
        display: flex;
        flex: 1;
        background-color: $shade2;
        height: 100px;

        #mainLogo {
            display: inline-block;
            background-color: $shade3;

            img {
                height: 80px;
                margin: 10px;
            }
        }

        #customHeaderMessage{
            margin: auto;
            color: #fff;
            font-size: 3rem;
        }

        #mainMenu {
            flex: 1;
        }
    }
</style>