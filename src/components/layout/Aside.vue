<template>
    <div>
        <el-menu
                :router="true"
                background-color="#4A4B4E"
                :collapse-transition="false"
                unique-opened
                :default-active="activeIndex"
                text-color="#B3BFD0"
                active-text-color="#3589FB"
                :collapse="isCollapse"
                class="menu"
        >
            <el-submenu
                    v-for="submenus in menuList"
                    :index="String(submenus.url)"
                    :id="submenus.childUrls.includes(activeIndex) ? 'activeClass' : null"
                    :key="submenus.id"
            >
                <template slot="title">
                    <!--<img v-show="submenus.icon&&submenus.icon!==''"
                                   class="el-icon-location" style="height: 20px;width: 20px;margin-right: 16px;"
                                   :src="submenus.icon?config.baseURL+submenus.icon:''" alt="icon">-->
                    <img
                            :src="require('@/assets/'+submenus.icon)"
                            alt="toggle"
                            class="el-icon-location"
                            style="height: 20px;width: 20px;margin-right: 16px;"
                    />
                    <span>{{ submenus.name }}</span>
                </template>
                <el-menu-item
                        v-for="menus in submenus.subMenus"
                        :index="menus.url"
                        :key="menus.id"
                >
                    <!--{{ menus.name }}-->
                    <span style="margin-left: 16px;">{{ menus.name }}</span>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex'
    import config from '@/api/config'

    export default {
        name: 'asideLayout',
        data() {
            return {
                config,
                activeIndex: '/console'
            }
        },
        computed: {
            ...mapState({
                menuList: state => state.menuList,
                isCollapse: state => state.isCollapse,
                activeMenuList: state => state.activeMenuList
            })
        },
        methods: {
            /*...mapMutations({
                setChooseMenu: 'setChooseMenu',
                setActiveMenuList: 'setActiveMenuList'
            })*/
        },
        watch: {
            '$route.path': function (n) {
                this.menuList.forEach(item => {
                    item.subMenus && item.subMenus.forEach(current => {
                        if (n === current.url) {
                            this.activeIndex = current.url
                        }
                    })
                })
            }
        }
    }
</script>
<style lang="stylus">
    .menu
        padding 0 5px 0 5px !important
        border none !important
</style>
