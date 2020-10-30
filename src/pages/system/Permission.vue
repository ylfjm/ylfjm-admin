<template>
    <div>
        <div class="search_box">
            <el-form :inline="true" :model="formSearch" ref="formSearch">
                <el-form-item label="权限名称" prop="name" class="specialWidth80">
                    <el-input
                            v-model="formSearch.name"
                            size="small"
                            placeholder="请输入权限名称"
                            clearable
                            @clear="onSearch"
                    ></el-input>
                </el-form-item>
                <el-form-item label="权限CODE" prop="code" class="specialWidth100">
                    <el-input
                            v-model="formSearch.code"
                            size="small"
                            placeholder="请输入权限CODE"
                            clearable
                            @clear="onSearch"
                    ></el-input>
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
                            :style="{visibility: formSearch.checkMenuId === '' ? 'hidden' : 'visible'}"
                            icon="el-icon-plus"
                            size="small"
                            @click="showCreateDialog">
                        添加权限
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-container>
            <el-aside width="200px" class="aside_box">
                <div class="aside_title">系统目录结构</div>
                <el-tree
                        :data="menuList"
                        :props="defaultProps"
                        class="terminal_tree"
                        highlight-current
                        check-on-click-node
                        node-key="id"
                        :default-expanded-keys="[0]"
                        @node-click="handleCheckChange"
                ></el-tree>
            </el-aside>
            <el-container class="table_content">
                <div style="width: 100%">
                    <el-table
                            :data="tableList"
                            tooltip-effect="dark"
                            v-loading="searchLoading"
                            style="width: 100%"
                            :header-cell-style="{backgroundColor: '#B3BFD0',fontSize: '14px',color: '#333333'}"
                            stripe
                    >
                        <el-table-column
                                type="index"
                                :index="index => index + 1 + (formSearch.pageNum - 1) * formSearch.pageSize"
                                width="70"
                                fixed="left"
                                align="center"
                                label="序号"
                        ></el-table-column>
                        <el-table-column
                                prop="name"
                                min-width="150"
                                show-overflow-tooltip
                                label="权限名称"
                        ></el-table-column>
                        <el-table-column
                                prop="code"
                                min-width="150"
                                show-overflow-tooltip
                                label="权限CODE"
                        ></el-table-column>
                        <el-table-column
                                prop="method"
                                min-width="100"
                                show-overflow-tooltip
                                label="权限方法"
                        ></el-table-column>
                        <el-table-column
                                prop="menuName"
                                min-width="150"
                                show-overflow-tooltip
                                label="菜单名称"
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
                        <el-table-column
                                fixed="right"
                                label="操作"
                                width="150"
                                align="center">
                            <template slot-scope="scope">
                                <el-row type="flex" justify="center">
                                    <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
                                    <el-button type="danger" size="mini" @click="deletePermission(scope.row)">删除</el-button>
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
            </el-container>
        </el-container>
        <CreateDialogForm
                width="40%"
                title="添加权限"
                :visible="createDialogVisible"
                :form="form"
                :hideDialog="hideCreateDialog"
                @changeFieldValue="changeFieldValue"
                :submit="addPermission"
                :columns="columns"
                :loading="createPermissionLoading"
                :error="error"
        />
        <UpdateDialogForm
                width="40%"
                title="修改权限"
                :visible="updateDialogVisible"
                :hideDialog="hideUpdateDialog"
                @changeFieldValue="changeFieldValue"
                :submit="updatePermission"
                :updateItem="updateItem"
                :columns="columns"
                :loading="updatePermissionLoading"
                :error="error"
        />
    </div>
</template>
<script>
    import CreateDialogForm from '@/components/common/CreateDialogForm'
    import UpdateDialogForm from '@/components/common/UpdateDialogForm'
    import {mapState} from 'vuex'

    export default {
        name: 'permissionPage',
        data() {
            return {
                formSearch: {
                    pageNum: 1,
                    pageSize: 10,
                    checkMenuId: 0,
                    name: '',
                    code: '',
                },
                total: 0,
                pages: 0,
                tableList: [],
                error: false,
                createDialogVisible: false,
                createPermissionLoading: false,
                updateDialogVisible: false,
                updatePermissionLoading: false,
                updateItem: {},
                form: {
                    name: '',
                    code: '',
                    method: ''
                },
                columns: [
                    {
                        label: '权限名称',
                        fieldName: 'name',
                        type: 'input',
                        rules: [
                            {required: true, message: '请填写权限名称', trigger: 'blur'}
                        ]
                    },
                    {
                        label: '权限CODE',
                        fieldName: 'code',
                        type: 'input',
                        rules: [
                            {required: true, message: '请填写权限CODE', trigger: 'blur'}
                        ]
                    },
                    {
                        label: '权限方法',
                        fieldName: 'method',
                        type: 'input',
                        rules: [
                            {required: true, message: '请填写权限方法', trigger: 'blur'}
                        ]
                    }
                ],
                searchLoading: false,
                defaultProps: {
                    children: 'subMenus',
                    label: 'name',
                    value: 'id'
                },
                menuList: [],
                autoHeight: 500
            }
        },
        methods: {
            onSearch() {
                this.formSearch.checkMenuId = 0
                this.formSearch.pageNum = 1
                this.searchCommon()
            },
            //重置
            refresh() {
                this.formSearch.checkMenuId = 0
                this.$refs['formSearch'].resetFields()
                this.onSearch()
            },
            //新增修改弹窗回传值
            changeFieldValue(data) {
                this[data.type][data.fieldName] = data.value
            },
            async handleCheckChange(data) {
                this.formSearch.checkMenuId = data.id
                this.formSearch.name = ''
                this.formSearch.code = ''
                this.formSearch.pageNum = 1
                this.searchCommon()
            },
            //分页
            handleCurrentChange(pageNum) {
                this.formSearch.pageNum = pageNum
                this.searchCommon()
            },
            async searchCommon() {
                let formData = {
                    menuId: this.formSearch.checkMenuId,
                    name: this.formSearch.name.trim(),
                    code: this.formSearch.code.trim(),
                    pageNum: this.formSearch.pageNum,
                    pageSize: this.formSearch.pageSize,
                }
                this.searchLoading = true
                const res = await this.$service.getPermissionList(formData)
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
                        message: res.message ? res.message : '搜索失败',
                    })
                }
            },
            //新增
            showCreateDialog() {
                this.createDialogVisible = true
                this.error = false
            },
            hideCreateDialog() {
                this.createDialogVisible = false
                this.error = false
            },
            async addPermission(data) {
                this.createPermissionLoading = true
                const res = await this.$service.addPermission({
                    ...data,
                    menuId: this.formSearch.checkMenuId
                })
                this.createPermissionLoading = false
                if (res.code === 20000) {
                    this.createDialogVisible = false
                    this.error = false
                    this.searchCommon()
                } else {
                    this.error = res.message || true
                }
            },
            //修改
            showUpdateDialog(row) {
                this.updateDialogVisible = true
                this.error = false
                this.$nextTick(function () {
                    this.updateItem = {...row}
                })
            },
            hideUpdateDialog() {
                this.updateDialogVisible = false
                this.error = false
                this.updateItem = {}
            },
            async updatePermission(data) {
                this.updatePermissionLoading = true
                const res = await this.$service.updatePermission(data)
                this.updatePermissionLoading = false
                if (res.code === 20000) {
                    this.searchCommon()
                    this.updateDialogVisible = false
                    this.error = false
                    this.updateItem = {}
                } else {
                    this.error = res.message || true
                }
            },
            //删除
            deletePermission(row) {
                this.$confirm('您选择了1条数据，是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await this.$service.deletePermission({
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
            }
        },
        async created() {
            const res = await this.$service.getMenuTree({})
            if (res.code === 20000) {
                this.menuList = [
                    {
                        id: 0,
                        name: '管理系统',
                        subMenus: res.data
                    }
                ]
            }
            this.searchCommon()
        },
        mounted() {
            this.$nextTick(function () {
                //56为全选导出数据列表高度
                // this.autoHeight = this.mainHeight - 28
            })
        },
        computed: {
            ...mapState({
                mainHeight: state => state.mainHeight
            })
        },
        components: {
            CreateDialogForm,
            UpdateDialogForm,
        }
    }
</script>
<style scoped lang="stylus">
    .aside_box
        margin: 17px 17px 17px 0
        border: 1px solid #E6E6E6
        background-color: #fff
        border-radius: 4px

    .aside_title
        background-color #fff
        line-height 52px
        font-size 16px
        font-weight 500
        color rgba(51, 51, 51, 1)
        padding-left 20px
        border-bottom 1px solid #E6E6E6

    .terminal_tree
        font-size 14px
        font-weight 500
        line-height 20px
        letter-spacing 1px
        padding 14px
</style>
