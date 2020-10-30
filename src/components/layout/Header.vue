<template>
    <div>
        <div class="header">
            <div class="grid-left">
                <div class="system_title">
                    <img src="@/assets/images/logo.png" alt="logo"/>YLFJM管理系统
                </div>
            </div>
            <div class="collapse_btn" @click="toggleCollapse">
                <img v-show="!isCollapse" src="@/assets/images/icon_hidden@2x.png" alt="toggle"/>
                <img v-show="isCollapse" src="@/assets/images/icon_open@2x.png" alt="toggle"/>
            </div>
            <div class="grid-right">
                <div class="persons">
                    <!--<div class="avator">
                        <img src="@/assets/images/head_img.jpg"/>
                    </div>-->
                    <div class="selects">
                        <!--<span class="el-dropdown-link">
                          {{ admin.realName }}
                            &lt;!&ndash;<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>&ndash;&gt;
                        </span>-->
                        <el-dropdown trigger="click" @command="handleCommand">
                            <span class="el-dropdown-link">
                            {{ admin.realName }}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>个人资料</el-dropdown-item>
                                <el-dropdown-item divided command="loginOut">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <!--<div class="power" @click="loginOut">
                    <img src="@/assets/images/icon_power.png" alt="power"/>
                </div>-->

            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        name: 'headerLayout',
        data() {
            return {
                datas: [
                    {
                        type: 'el-icon-share',
                        count: 10
                    },
                    {
                        type: 'el-icon-share',
                        count: 10
                    },
                    {
                        type: 'el-icon-share',
                        count: 10
                    }
                ],
            }
        },
        computed: {
            ...mapState({
                admin: state => state.admin,
                isCollapse: state => state.isCollapse
            })
        },
        methods: {
            toggleCollapse() {
                this.$store.commit('toggleCollapse')
            },
            //注销
            loginOut() {
                this.$confirm('是否确认退出当前账号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    localStorage.removeItem('admin')
                    localStorage.removeItem('admin_token')
                    localStorage.removeItem('menuList')
                    this.$router.push('/login')
                }).catch(() => {
                });
            },
            handleCommand(command) {
                if (command === 'loginOut') {
                    this.$confirm('是否确认退出当前账号?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        localStorage.removeItem('admin')
                        localStorage.removeItem('admin_token')
                        localStorage.removeItem('menuList')
                        this.$router.push('/login')
                    }).catch(() => {
                    });
                }
            },
        }
    }
</script>
<style scoped lang="stylus">
    .header
        background: rgba(30, 30, 30, 1);
        box-shadow: 0px 2px 2px 0px rgba(230, 230, 230, 1);
        overflow: hidden;

        .grid-left
            float: left;

            .system_title
                width: 233px;
                height: 50px;
                line-height: 50px;
                font-family: PingFangSC-Medium;
                color: rgba(255, 255, 255, 1);
                font-weight: 500;
                font-size: 22px;

                img
                    font-size: 20px;
                    width: 25px;
                    height: 25px;
                    margin: 14px 14px 11px 14px;
                    vertical-align: top;

        .collapse_btn
            float: left;
            height: 50px;
            width: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;

            img
                width: 18px;
                height: 18px;
                margin: 17px 17px 15px 15px;

        .grid-right
            float: right;
            padding-top: 8px;
            padding-right: 45px;
            display: flex;
            justify-content: flex-start;

            ul
                li
                    width: 30px;
                    height: 30px;
                    text-align: center;
                    border-radius: 15px;
                    display: inline-block;
                    margin: 0 15px;
                    background: rgba(255, 255, 255, 1);
                    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.3);
                    cursor: pointer;

                    img
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;

            .v-line
                width: 1px;
                height: auto;
                margin: 0px 32px;
                background: rgba(232, 232, 232, 1);

            .persons
                display: flex;

                /*.avator
                    width: 34px;
                    height: 34px;
                    margin-top: 0;
                    margin-right: 10px;

                    img
                        width: 100%;
                        border-radius: 17px;*/

                .selects
                    line-height: 34px;
                    height: 100%;
                    color: #fff;
                    font-size: 16px;

                    & > div
                        text-align: center;

                    .el-dropdown-link
                        display: inline-block;
                        margin: 0 8px;
                        cursor: pointer;
                        font-size: 16px;
                        color: #fff;

                    .el-icon-arrow-down
                        font-size: 16px;


    /*.power
        width: 30px;
        height: 30px;
        border-radius: 14px;
        display: inline-block;
        text-align: center
        margin-left 33px
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.3);
        cursor pointer

        img
            width 100%
            height 100%
            vertical-align middle*/
</style>
