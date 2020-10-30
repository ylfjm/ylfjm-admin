<template>
    <div id="app">
        <el-container
                v-if="!$route.path.includes('/login')"
                class="container-el"
                direction="vertical"
        >
            <el-header>
                <Header></Header>
            </el-header>
            <el-container style="overflow: hidden;">
                <el-aside :width="isCollapse ? 'auto' : '233px'" class="aside">
                    <Aside></Aside>
                </el-aside>
                <el-main :class="isCollapse ? 'main collapseClose' : 'main'">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
        <router-view name="login"></router-view>
    </div>
</template>

<script>
    import Aside from '@/components/layout/Aside.vue'
    import Header from '@/components/layout/Header.vue'
    import {mapState} from 'vuex'

    export default {
        name: 'App',
        data() {
            return {
                activeIndex: '1'
            }
        },
        computed: {
            ...mapState({
                isCollapse: state => state.isCollapse
            })
        },
        mounted() {
            if (!this.$route.path.includes('/login')) {
                // console.log("123---" + this.$el.querySelector('.main').clientHeight)
                this.$store.commit('saveMainHeight', this.$el.querySelector('.main').clientHeight)
            }
        },
        components: {
            Aside,
            Header
        }
    }
</script>

<style scoped lang="stylus">
    .el-header
        padding: 0;
        height: 50px;
</style>
