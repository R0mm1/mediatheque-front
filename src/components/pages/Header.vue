<template>
    <header id="vueHeader">
        <div id="mainLogo">
            <img src="/images/logo.png" alt="Médiathèque"/>
        </div>

        <Menu v-if="!noUser"/>
        <div id="customHeaderMessage">{{customHeaderMessage}}</div>

        <User v-if="!noUser"/>
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
    @import "../../assets/scss/breakpoints";

    #vueHeader {
        position: relative;
        display: flex;
        flex: 1;
        background-color: $shade2;
        height: 100px;
        z-index: 10;

        @include phone-portrait{
            height: 50px;
        }

        #mainLogo {
            display: inline-block;
            background-color: $shade3;

            img {
                height: 80px;
                margin: 10px;

                @include phone-portrait{
                    height: 30px;
                }
            }
        }

        #customHeaderMessage{
            margin: auto;
            color: #fff;
            font-size: 3rem;

            @include phone-portrait{
                font-size: 2rem;
            }
        }

        #mainMenu {
            flex: 1;
        }
    }
</style>
