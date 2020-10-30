<template>
    <div>
        <div class="search_box">
            <el-form :inline="true" :model="formSearch" ref="formSearch">
                <el-form-item label="姓名" prop="realName" class="specialWidth50">
                    <el-input
                            v-model="formSearch.realName"
                            size="small"
                            placeholder="请输入姓名"
                            clearable
                            @clear="onSearch"
                    ></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleId" class="specialWidth50">
                    <AutoSelectForm
                            @selectCb="selectCb"
                            :defaultValue="formSearch.roleId"
                            key="roleId"
                            fieldName="roleId"
                            dataType="role"
                            :size="'small'"
                    />
                </el-form-item>
                <el-form-item label="部门" prop="deptId" class="specialWidth50">
                    <AutoSelectForm
                            @selectCb="selectCb"
                            :defaultValue="formSearch.deptId"
                            key="deptId"
                            fieldName="deptId"
                            dataType="dept"
                            :size="'small'"
                    ></AutoSelectForm>
                </el-form-item>
                <el-form-item label="状态" prop="forbidden" class="specialWidth50">
                    <el-select v-model="formSearch.forbidden" size="small" clearable @clear="onSearch">
                        <el-option key="true" label="被禁用" value="true"></el-option>
                        <el-option key="false" label="可用" value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="submit_btn">
                    <el-button
                            @click="onSearch"
                            icon="el-icon-search"
                            size="small"
                            type="primary"
                            plain>
                        查询
                    </el-button>
                    <el-button size="small" @click="refresh">
                        <i class="el-icon-refresh"></i>
                        重置
                    </el-button>
                    <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="small"
                            @click="showCreateDialog">
                        新增用户
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_content">
            <el-table
                    ref="multipleTable"
                    :data="tableList"
                    tooltip-effect="dark"
                    v-loading="searchLoading"
                    style="width: 100%"
                    :header-cell-style="{backgroundColor: '#B3BFD0', fontSize: '14px', color: '#333333'}"
                    stripe
            >
                <el-table-column
                        type="index"
                        :index="index => index + 1 + (formSearch.pageNum - 1) * formSearch.pageSize"
                        label="序号"
                        align="center"
                        fixed="left"
                        width="70"
                ></el-table-column>
                <el-table-column
                        prop="userName"
                        min-width="130"
                        show-overflow-tooltip
                        label="用户名"
                ></el-table-column>
                <el-table-column
                        prop="realName"
                        min-width="130"
                        show-overflow-tooltip
                        label="姓名"
                ></el-table-column>
                <!--<el-table-column prop="sex" min-width="60" label="性别">
                    <template slot-scope="scope">
                        <div v-show="scope.row.sex === 1">男</div>
                        <div v-show="scope.row.sex === 2">女</div>
                    </template>
                </el-table-column>-->
                <el-table-column prop="phone" min-width="100" label="手机号">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.phone? scope.row.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2'): ''}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="roleIds"
                        min-width="150"
                        show-overflow-tooltip
                        label="角色"
                >
                    <template slot-scope="scope">
                        <SelectTableDataForm
                                :value="scope.row.roleIds"
                                dataType="role"
                        ></SelectTableDataForm>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="deptName"
                        min-width="150"
                        show-overflow-tooltip
                        label="部门"
                ></el-table-column>
                <el-table-column
                        prop="email"
                        min-width="100"
                        show-overflow-tooltip
                        label="邮箱"
                ></el-table-column>
                <el-table-column
                        prop="createTime"
                        min-width="150"
                        label="创建时间"
                ></el-table-column>
                <el-table-column
                        prop="creator"
                        min-width="120"
                        show-overflow-tooltip
                        label="创建者"
                ></el-table-column>
                <el-table-column
                        prop="updateTime"
                        min-width="150"
                        label="修改时间"
                ></el-table-column>
                <el-table-column
                        prop="updater"
                        min-width="120"
                        show-overflow-tooltip
                        label="修改者"
                ></el-table-column>
                <el-table-column prop="enable" label="是否启用" min-width="100">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.forbidden"
                                :active-value="false"
                                :inactive-value="true"
                                @change="changeEnable(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="remark"
                        min-width="150"
                        show-overflow-tooltip
                        label="备注"
                ></el-table-column>
                <el-table-column
                        fixed="right"
                        width="150"
                        label="操作"
                        align="center"
                >
                    <template slot-scope="scope">
                        <el-row type="flex" justify="center">
                            <!--<el-button type="primary" size="mini" @click="showUserDetail(scope.row)">查看</el-button>-->
                            <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
                            <el-button type="danger" size="mini" @click="deleteAdmin(scope.row)">删除</el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination_box">
                <div class="pagination_box_content">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            class="pagination_content"
                            :current-page="formSearch.pageNum"
                            layout="total, prev, pager, next, jumper"
                            :page-size="formSearch.pageSize"
                            :total="total"
                    ></el-pagination>
                </div>
            </div>
        </div>
        <CreateDialogForm
                width="40%"
                title="新增用户"
                :visible="createDialogVisible"
                :form="form"
                :hideDialog="hideCreateDialog"
                @changeFieldValue="changeFieldValue"
                :submit="addAdmin"
                :columns="columns"
                :loading="createAdminLoading"
                :error="error"
        />
        <UpdateDialogForm
                width="40%"
                title="修改用户"
                :visible="updateDialogVisible"
                :hideDialog="hideUpdateDialog"
                @changeFieldValue="changeFieldValue"
                :submit="updateAdmin"
                :updateItem="updateItem"
                :columns="updateColumns"
                :loading="updateAdminLoading"
                :error="error"
        />
    </div>
</template>
<script>
    import AutoSelectForm from '@/components/common/AutoSelectForm'
    import CreateDialogForm from '@/components/common/CreateDialogForm'
    import UpdateDialogForm from '@/components/common/UpdateDialogForm'
    import SelectTableDataForm from '@/components/common/SelectTableDataForm'
    import {mapState} from 'vuex'
    import CryptoJS from 'crypto-js'

    export default {
        name: 'adminPage',
        data() {
            return {
                formSearch: {
                    sysType: 2,
                    realName: '',
                    deptId: '',
                    roleId: '',
                    forbidden: '',
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                pages: 0,
                tableList: [],
                error: false,
                createDialogVisible: false,
                createAdminLoading: false,
                updateDialogVisible: false,
                updateAdminLoading: false,
                updateItem: {},
                oldRow: {},
                form: {
                    userName: '',
                    password: '',
                    realName: '',
                    sex: '',
                    phone: '',
                    deptId: '',
                    roleIds: [],
                    remark: ''
                },
                columns: [
                    {
                        label: '用户名',
                        fieldName: 'userName',
                        type: 'input',
                        rules: [{required: true, message: '请填写用户名', trigger: 'blur'}]
                    },
                    {
                        label: '密码',
                        fieldName: 'password',
                        type: 'input',
                        textType: 'password',
                        rules: [
                            {required: true, validator: this.checkPassword, trigger: 'blur'}
                        ]
                    },
                    {
                        label: '姓名',
                        fieldName: 'realName',
                        type: 'input',
                        rules: [{required: true, message: '请填写姓名', trigger: 'blur'}]
                    },
                    {
                        label: '性别',
                        fieldName: 'sex',
                        type: 'radio',
                        options: [
                            {value: '1', label: '男'},
                            {value: '2', label: '女'}
                        ],
                        rules: []
                    },
                    {
                        label: '手机号',
                        fieldName: 'phone',
                        type: 'input',
                        rules: [
                            {
                                validator: this.checkPhone,
                                trigger: ['blur', 'change'],
                                message: '请输入正确的手机号'
                            }
                        ]
                    },
                    {
                        label: '邮箱',
                        fieldName: 'email',
                        type: 'input',
                        rules: []
                    },
                    {
                        label: '部门',
                        fieldName: 'deptId',
                        type: 'autoSelect',
                        dataType: 'dept',
                        rules: [{required: true, message: '请选择部门', trigger: 'blur'}]
                    },
                    {
                        label: '角色',
                        fieldName: 'roleIds',
                        type: 'autoSelect',
                        dataType: 'role',
                        multiple: true,
                        rules: [{required: true, message: '请选择角色', trigger: 'blur'}]
                    },
                    {
                        label: '文字描述',
                        fieldName: 'remark',
                        type: 'textarea',
                        rules: []
                    }
                ],
                updateColumns: [
                    {
                        label: '用户名',
                        fieldName: 'userName',
                        type: 'input',
                        rules: [{required: true, message: '请填写用户名', trigger: 'blur'}]
                    },
                    {
                        label: '密码',
                        fieldName: 'password',
                        type: 'input',
                        textType: 'password',
                        rules: [
                            {required: true, validator: this.checkPassword, trigger: 'blur'}
                        ]
                    },
                    {
                        label: '姓名',
                        fieldName: 'realName',
                        type: 'input',
                        rules: [{required: true, message: '请填写姓名', trigger: 'blur'}]
                    },
                    {
                        label: '性别',
                        fieldName: 'sex',
                        type: 'radio',
                        options: [
                            {value: '1', label: '男'},
                            {value: '2', label: '女'}
                        ],
                        rules: []
                    },
                    {
                        label: '手机号',
                        fieldName: 'phone',
                        type: 'input',
                        rules: [
                            {
                                validator: this.checkPhone,
                                trigger: ['blur', 'change'],
                                message: '请输入正确的手机号'
                            }
                        ]
                    },
                    {
                        label: '邮箱',
                        fieldName: 'email',
                        type: 'input',
                        rules: []
                    },
                    {
                        label: '部门',
                        fieldName: 'deptId',
                        type: 'autoSelect',
                        dataType: 'dept',
                        rules: [{required: true, message: '请选择部门', trigger: 'blur'}]
                    },
                    {
                        label: '角色',
                        fieldName: 'roleIds',
                        type: 'autoSelect',
                        dataType: 'role',
                        multiple: true,
                        rules: [{required: true, message: '请选择角色', trigger: 'blur'}]
                    },
                    {
                        label: '文字描述',
                        fieldName: 'remark',
                        type: 'textarea',
                        rules: []
                    }
                ],
                searchLoading: false,
                autoHeight: 500
            }
        },
        computed: {
            ...mapState({
                autoSelectData: state => state.common.autoSelectData,
                mainHeight: state => state.mainHeight
            })
        },
        methods: {
            //密码校验
            checkPassword(rule, value, callback) {
                const phoneReg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-z]|[A-Z]|[0-9]){6,}$/
                if (!value) {
                    return callback(new Error('密码不能为空'))
                }
                setTimeout(() => {
                    if (phoneReg.test(value) && value.length > 7) {
                        callback()
                    } else {
                        callback(
                            new Error(
                                '密码需要大小写字母、数字、特殊字符任意两组组成且长度最少八位'
                            )
                        )
                    }
                }, 100)
            },
            //手机号验证
            checkPhone(rule, value, callback) {
                if (!value) {
                    return callback()
                } else {
                    const reg = /^[1][3,4,5,7,8][0-9]{9}$/
                    if (reg.test(value)) {
                        callback()
                    } else {
                        return callback(new Error('请输入正确的手机号'))
                    }
                }
            },
            //新增修改弹窗回传值
            changeFieldValue(data) {
                this[data.type][data.fieldName] = data.value
            },
            //重置
            refresh() {
                this.$refs['formSearch'].resetFields()
                this.onSearch()
            },
            async onSearch() {
                this.formSearch.pageNum = 1
                this.searchCommon()
            },
            selectCb(data) {
                this.formSearch[data.fieldName] = data.value
                this.onSearch()
            },
            //分页
            handleCurrentChange(pageNum) {
                this.formSearch.pageNum = pageNum
                this.searchCommon()
            },
            async searchCommon() {
                let formData = {
                    sysType: this.formSearch.sysType,
                    realName: this.formSearch.realName.trim(),
                    deptId: this.formSearch.deptId,
                    roleId: this.formSearch.roleId,
                    forbidden: this.formSearch.forbidden,
                    pageNum: this.formSearch.pageNum,
                    pageSize: this.formSearch.pageSize
                }
                this.searchLoading = true
                const res = await this.$service.getAdminList(formData)
                this.searchLoading = false
                if (res.code === 20000) {
                    this.formSearch.pageNum = res.data.pageNum
                    this.formSearch.pageSize = res.data.pageSize
                    this.total = res.data.total
                    this.pages = res.data.pages
                    this.tableList = res.data.result || []
                } else {
                    this.$notify.error({
                        title: '提示',
                        message: res.message ? res.message : '查询失败',
                    })
                }
            },
            //新增
            showCreateDialog() {
                this.$store.dispatch('common/getAutoSelectData', {dataType: 'role'})
                this.$store.dispatch('common/getAutoSelectData', {dataType: 'dept'})
                this.createDialogVisible = true
                this.error = false
            },
            hideCreateDialog() {
                this.createDialogVisible = false
                this.error = false
            },
            async addAdmin(data) {
                this.autoSelectData['dept'].map(item => {
                    if (item.value === data.deptId) {
                        data.deptName = item.label
                    }
                })
                this.createAdminLoading = true
                const res = await this.$service.addAdmin({
                    ...data,
                    password: CryptoJS.MD5(data.password.trim()).toString()
                })
                this.createAdminLoading = false
                if (res.code === 20000) {
                    this.createDialogVisible = false
                    this.error = false
                    this.searchCommon()
                } else {
                    this.error = res.message || false
                }
            },
            //修改
            showUpdateDialog(row) {
                this.$store.dispatch('common/getAutoSelectData', {dataType: 'role'})
                this.$store.dispatch('common/getAutoSelectData', {dataType: 'dept'})
                this.updateDialogVisible = true
                this.error = false
                this.$nextTick(function () {
                    this.oldRow = {...row}
                    this.updateItem = {
                        ...row,
                        deptId: String(row.deptId),
                        sex: String(row.sex),
                        roleIds: row.roleIds.length === 0 ? [] : row.roleIds,
                        password: row.password || ''
                    }
                })
            },
            /*Decrypt(word) {
                let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
                let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
                let decrypt = CryptoJS.AES.decrypt(srcs, key, {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                })
                let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
                return decryptedStr.toString()
            },*/
            hideUpdateDialog() {
                this.updateDialogVisible = false
                this.error = false
                this.updateItem = {}
                this.oldRow = {}
            },
            async updateAdmin(data) {
                let formData = {...data}
                this.autoSelectData['dept'].map(item => {
                    if (item.value === formData.deptId) {
                        formData.deptName = item.label
                    }
                })
                if (
                    formData.password &&
                    formData.password !== '' &&
                    formData.password !== this.oldRow.password
                ) {
                    formData.password = CryptoJS.MD5(formData.password).toString()
                } else {
                    formData.password = null
                }
                this.updateAdminLoading = true
                const res = await this.$service.updateAdmin(formData)
                this.updateAdminLoading = false
                if (res.code === 20000) {
                    this.searchCommon()
                    this.updateDialogVisible = false
                    this.error = false
                    this.updateItem = {}
                    this.oldRow = {}
                } else {
                    this.error = res.message || false
                }
            },
            //是否启用
            async changeEnable(row) {
                const res = await this.$service.changeAdminStatus({
                    id: row.id
                })
                if (res.code === 20000) {
                    this.$notify({
                        title: '提示',
                        type: 'success',
                        message: '操作成功',
                    })
                } else {
                    this.tableList = this.tableList.map(item => {
                        if (item.id === row.id) {
                            return Object.assign({}, item, {
                                forbidden: !row.forbidden
                            })
                        }
                        return item
                    })
                    this.$notify.error({
                        title: '提示',
                        message: res.message ? res.message : '操作失败',
                    })
                }
            },
            //删除
            deleteAdmin(row) {
                this.$confirm('您选择了1条数据，是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await this.$service.deleteAdmin({
                        id: row.id
                    })
                    if (res.code === 20000) {
                        this.$notify({
                            title: '提示',
                            type: 'success',
                            message: '删除成功',
                        })
                        this.searchCommon()
                    } else {
                        this.$notify.error({
                            title: '提示',
                            message: res.message ? res.message : '删除失败',
                        })
                    }
                }).catch(() => {
                });
            },
        },
        created() {
            if (this.$route.params.deptId) {
                this.formSearch.deptId = this.$route.params.deptId;
            } else if (this.$route.params.roleId) {
                this.formSearch.roleId = this.$route.params.roleId;
            }
            this.searchCommon()
        },
        mounted() {
            this.$nextTick(function () {
                //56为全选导出数据列表高度
                // this.autoHeight = this.mainHeight - this.$el.querySelector('.search_box').clientHeight
            })
        },
        watch: {},
        components: {
            AutoSelectForm,
            CreateDialogForm,
            UpdateDialogForm,
            SelectTableDataForm
        }
    }
</script>
