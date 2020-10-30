<template>
    <div>
        <div class="box-card">
            <h2 class="title">项目总览</h2>
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <h3 class="grid_title" style="background:rgba(236,104,121,1);">系统管理员</h3>
                        <div class="grid_box">
                            <div class="grid_li">
                                <router-link to="/console">
                                    <div class="grid_li">系统管理员数量 <span class="grid_text">{{(data.adminCount||0)}}</span></div>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <h3 class="grid_title" style="background:rgba(244,187,94,1);">部门</h3>
                        <div class="grid_box">
                            <div class="grid_li">
                                <router-link to="/console">
                                    <div class="grid_li">部门数量 <span class="grid_text">{{(data.departmentCount||0)}}</span>
                                    </div>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <h3 class="grid_title" style="background:rgba(109,198,81,1);">管理员角色</h3>
                        <div class="grid_box">
                            <div class="grid_li">
                                <router-link to="/console">
                                    <div class="grid_li">角色数量 <span class="grid_text">{{(data.roleCount||0)}}</span></div>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <h3 class="grid_title" style="background:rgba(89,117,217,1);">系统菜单</h3>
                        <div class="grid_box">
                            <div class="grid_li">
                                <router-link to="/console">
                                    <div class="grid_li">菜单数量 <span class="grid_text">{{(data.menuCount||0)}}</span></div>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="box-card">
            <h2 class="title">常用功能</h2>
            <el-card class="box-card">
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="4">
                        <div class="img_btn" @click="modalTip">
                            <img class="bg_img" src="@/assets/images/console_bg.png" alt="图标">
                            <img class="click_img" src="@/assets/images/icon_video@2x.png" alt="图标">
                            <p class="link_text">视频发布</p>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="img_btn" @click="modalTip">
                            <img class="bg_img" src="@/assets/images/console_bg.png" alt="图标">
                            <img class="click_img" src="@/assets/images/icon_txt@2x.png" alt="图标">
                            <p class="link_text">文章发布</p>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="img_btn" @click="modalTip">
                            <img class="bg_img" src="@/assets/images/console_bg.png" alt="图标">
                            <img class="click_img" src="@/assets/images/yingshou@2x.png" alt="图标">
                            <p class="link_text">营收概况</p>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="img_btn" @click="modalTip">
                            <img class="bg_img" src="@/assets/images/console_bg.png" alt="图标">
                            <img class="click_img" src="@/assets/images/weibiaoti-@2x.png" alt="图标">
                            <p class="link_text">客户管理</p>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="img_btn" @click="modalTip">
                            <img class="bg_img" src="@/assets/images/console_bg.png" alt="图标">
                            <img class="click_img" src="@/assets/images/fenxi.png" alt="图标">
                            <p class="link_text">数据分析</p>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'consolePage',
        data() {
            return {
                data: {}
            }
        },
        methods: {
            async getDashboardData() {
                const res = await this.$service.getDashboardData()
                if (res.code === 20000 && res.data) {
                    this.data = res.data
                } else {
                    this.$notify.error({
                        title: '提示',
                        message: (res.message ? res.message : "查询失败"),
                    });
                }
            },
            modalTip() {
                this.$alert('该版本暂不支持此功能', '提示', {
                    confirmButtonText: '确定'
                });
            }
        },
        created() {
            this.getDashboardData()
        }
    }
</script>
<style scoped lang="stylus">
    .box-card + .box-card
        margin 30px 0 0 0

    .title
        font-size: 18px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 40px;
        margin 0 0 15px 0

    .grid-content
        height: 300px;
        background: rgba(255, 255, 255, 1);

        .grid_title
            font-size: 16px;
            font-family: PingFangSC-Medium;
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
            line-height: 48px;
            text-align center
            height: 48px;

        .grid_box
            border-radius: 2px;
            padding 20px 50px

            .grid_li
                font-size: 14px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(28, 110, 231, 1);
                line-height: 20px;
                cursor pointer

                .grid_text
                    font-size: 14px;
                    font-family: PingFangSC-Regular;
                    font-weight: 400;
                    color: rgba(208, 2, 27, 1);
                    line-height: 20px;
                    float right

            .grid_li + .grid_li
                margin 25px 0 0 0

    .img_btn
        width: 164px;
        height: 164px;
        position relative

        .bg_img
            width 100%
            height 100%

        .click_img
            position absolute
            top: 33px
            left 50px
            width: 64px;
            height: 64px;
            border-radius: 4px;

        .link_text
            position absolute
            left: 50px;
            top: 105px;
            font-size: 16px;
            font-family: PingFangSC-Medium;
            font-weight: 500;
            color: rgba(137, 136, 142, 1);
            line-height: 22px;
</style>
