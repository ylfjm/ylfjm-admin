<template>
    <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-width="0"
            class="login-container"
    >
        <div class="title">系统登录</div>
        <el-form-item prop="userName">
            <el-input
                    type="text"
                    v-model="form.userName"
                    placeholder="请输入账号"
            ></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input
                    type="password"
                    v-model="form.password"
                    placeholder="请输入密码"
            ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" class="login-button" @click="submitForm">
                登 录
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import CryptoJS from 'crypto-js'

    export default {
        name: 'login',
        data() {
            return {
                form: {
                    userName: '',
                    password: ''
                },
                rules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}]
                }
            }
        },
        methods: {
            submitForm() {
                this.$refs['form'].validate(async valid => {
                    if (valid) {
                        const loading = this.$loading({
                            lock: true,
                            text: '努力加载中...',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.4)'
                        })
                        // this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        //     loading.close();
                        // });
                        const res = await this.$service.adminLogin({
                            userName: this.form.userName.trim(),
                            password: CryptoJS.MD5(this.form.password.trim()).toString(),
                            sysType: 2
                        })
                        if (res.code === 20000) {
                            // console.log(res.data)
                            let admin = res.data
                            let menus = admin.menus.map(item => {
                                return Object.assign({}, item, {
                                    childUrls: item.subMenus
                                        ? item.subMenus.map(c => {
                                            return c.url
                                        })
                                        : []
                                })
                            })
                            this.$store.commit('setAdmin', admin)
                            this.$store.commit('setMenuList', menus)
                            localStorage.setItem('admin', JSON.stringify(admin))
                            localStorage.setItem('menuList', JSON.stringify(menus))
                            this.$router.push('/console')
                        } else {
                            this.$notify.error({
                                title: '提示',
                                message: res.message ? res.message : '登录失败',
                            })
                        }

                        loading.close()
                    } else {
                        this.$notify.error({
                            title: '提示',
                            message: '登录失败',
                        })
                        return false
                    }
                })
            }
        },
        created() {
            let lett = this;
            document.onkeydown = function (e) {
                var key = window.event.keyCode;
                if (key === 13) {
                    lett.submitForm();
                }
            }
        },
    }
</script>

<style lang="stylus">
    .login-container
        -webkit-border-radius 5px;
        border-radius 5px;
        -moz-border-radius 5px;
        margin 180px auto;
        width 400px;
        padding 35px 35px 15px 35px;

        .title
            margin 0 auto 40px auto;
            text-align center;
            font-size 24px;
            color #9fa0a9;

        .el-input .el-input__inner
            height 54px !important;
            line-height 54px !important;
            padding 0 24px !important;
            font-size 16px !important;

        .el-button.login-button
            width 100% !important;
            font-size 18px !important;

            span
                height 28px !important;
                line-height 28px !important;
</style>
