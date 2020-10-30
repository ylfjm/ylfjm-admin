<template>
    <div>
        <div class="search_box">
            <el-form :inline="true" :model="formSearch" ref="formSearch">
                <el-form-item label="菜单层级" prop="name" class="specialWidth80">
                    <el-select
                            v-model="formSearch.level"
                            size="small"
                            clearable
                            @clear="onSearch"
                    >
                        <el-option key="1" label="一级菜单" value="1"></el-option>
                        <el-option key="2" label="二级菜单" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单名称" prop="name" class="specialWidth80">
                    <el-input
                            v-model="formSearch.name"
                            size="small"
                            placeholder="请输入菜单名称"
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
                            icon="el-icon-plus"
                            size="small"
                            @click="showCreateDialog">
                        添加菜单
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
                                min-width="100"
                                show-overflow-tooltip
                                label="菜单名"
                        ></el-table-column>
                        <el-table-column
                                prop="icon"
                                min-width="100px"
                                label="菜单图标"
                        >
                            <template slot-scope="scope">
                                <!--<img
                                        class="menu_icon"
                                        v-if="scope.row.level===1"
                                        :src="scope.row.icon ? require('@/assets/'+scope.row.icon) : ''"
                                        alt="菜单图标"
                                />-->
                                <el-image
                                        style="width: 20px; height: 20px;"
                                        v-if="scope.row.level===1"
                                        :src="scope.row.icon ? require('@/assets/'+scope.row.icon) : ''"
                                        fit="cover">
                                </el-image>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="url"
                                min-width="150"
                                show-overflow-tooltip
                                label="菜单url"
                        ></el-table-column>
                        <el-table-column
                                prop="pidName"
                                min-width="150"
                                show-overflow-tooltip
                                label="上级菜单"
                        ></el-table-column>
                        <el-table-column
                                prop="description"
                                label="描述"
                                min-width="150"
                                show-overflow-tooltip
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
                                width="150"
                                label="操作"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-row type="flex" justify="center">
                                    <!--<el-button type="primary" size="mini" @click="showMenuDetail(scope.row)">查看</el-button>-->
                                    <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
                                    <el-button type="danger" size="mini" @click="deleteMenu(scope.row)">删除</el-button>
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
                title="添加菜单"
                :visible="createDialogVisible"
                :form="form"
                :hideDialog="hideCreateDialog"
                @changeFieldValue="changeFieldValue"
                :submit="addMenu"
                :columns="columns"
                :loading="createMenuLoading"
                :error="error"
        />
        <UpdateDialogForm
                width="40%"
                title="修改菜单"
                :visible="updateDialogVisible"
                :hideDialog="hideUpdateDialog"
                @changeFieldValue="changeFieldValue"
                :submit="updateMenu"
                :updateItem="updateItem"
                :columns="columns"
                :loading="updateMenuLoading"
                :error="error"
        />
    </div>
</template>
<script>
    import CreateDialogForm from '@/components/common/CreateDialogForm'
    import UpdateDialogForm from '@/components/common/UpdateDialogForm'
    import uploadMixin from '@/common/mixin/uploadMixin'
    import config from '@/api/config'
    import {mapState} from 'vuex'

    export default {
        name: 'menuPage',
        mixins: [uploadMixin],
        data() {
            return {
                config,
                formSearch: {
                    pageNum: 1,
                    pageSize: 10,
                    checkMenuId: '',
                    name: '',
                    level: ''
                },
                total: 0,
                pages: 0,
                tableList: [],
                error: false,
                createDialogVisible: false,
                createMenuLoading: false,
                updateDialogVisible: false,
                updateMenuLoading: false,
                updateItem: {},
                form: {
                    name: '',
                    url: '',
                    icon: '',
                    pid: [],
                    description: '',
                    sorts: 0
                },
                columns: [
                    {
                        label: '菜单名',
                        fieldName: 'name',
                        type: 'input',
                        rules: [{required: true, message: '请填写菜单名', trigger: 'blur'}]
                    },
                    {
                        label: '菜单url',
                        fieldName: 'url',
                        type: 'input',
                        rules: [{required: true, message: '请填写菜单url', trigger: 'blur'}]
                    },
                    {
                        label: '菜单图标',
                        fieldName: 'icon',
                        type: 'upload',
                        folder: 'system',
                        rules: []
                    },
                    {
                        label: '父级',
                        fieldName: 'pid',
                        type: 'autoCascader',
                        dataType: 'menu',
                        checkStrictly: true,
                        rules: []
                    },
                    {
                        label: '描述',
                        fieldName: 'description',
                        type: 'textarea',
                        rules: []
                    },
                    {
                        label: '排序',
                        fieldName: 'sorts',
                        type: 'inputNumber',
                        rules: [{required: true, message: '请填写排序', trigger: 'blur'}]
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
                this.formSearch.checkMenuId = '';
                this.formSearch.pageNum = 1
                this.searchCommon()
            },
            //重置
            refresh() {
                this.formSearch.checkMenuId = '';
                this.$refs['formSearch'].resetFields()
                this.onSearch()
            },
            //新增修改弹窗回传值
            changeFieldValue(data) {
                this[data.type][data.fieldName] = data.value
            },
            async handleCheckChange(data) {
                this.formSearch.checkMenuId = data.id
                this.formSearch.name = '';
                this.formSearch.level = '';
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
                    pid: this.formSearch.checkMenuId,
                    name: this.formSearch.name.trim(),
                    level: this.formSearch.level,
                    pageNum: this.formSearch.pageNum,
                    pageSize: this.formSearch.pageSize,
                }
                this.searchLoading = true
                const res = await this.$service.getMenuList(formData)
                this.searchLoading = false
                if (res.code === 20000) {
                    this.formSearch.pageNum = res.data.pageNum
                    this.formSearch.pageSize = res.data.pageSize
                    this.total = res.data.total
                    this.pages = res.data.pages
                    this.tableList = res.data.result
                        ? res.data.result.map(item => {
                            return Object.assign({}, item, {
                                pidName: this.getPidName(this.menuList, item.pid)
                            })
                        })
                        : []
                } else {
                    this.$notify.error({
                        title: '提示',
                        message: res.message ? res.message : '搜索失败',
                    })
                }
            },
            //新增
            showCreateDialog() {
                this.$store.dispatch('common/getAutoCascaderData', {dataType: 'menu'})
                this.createDialogVisible = true
                this.error = false
            },
            hideCreateDialog() {
                this.createDialogVisible = false
                this.error = false
            },
            async addMenu(data) {
                this.createMenuLoading = true
                const res = await this.$service.addMenu({
                    ...data,
                    pid: data.pid[data.pid.length - 1],
                    icon: this.getUploadUrl(data.icon)
                })
                this.createMenuLoading = false
                if (res.code === 20000) {
                    this.createDialogVisible = false
                    this.error = false
                    this.createLoad()
                } else {
                    this.error = res.message || true
                }
            },
            //获取父级id
            getPidArr(list, id) {
                let arr = []
                let map = (l, i) => {
                    l.forEach(item => {
                        if (item.id === i) {
                            arr.push(i)
                            map(list, item.pid)
                        } else if (item.subMenus) {
                            map(item.subMenus, i)
                        }
                        return
                    })
                }
                map(list, id)
                return arr.reverse()
            },
            //获取父级name
            getPidName(list, id) {
                let name = ''
                let map = (l, i) => {
                    l.forEach(item => {
                        if (item.id === i) {
                            name = item.name
                        } else if (item.subMenus) {
                            map(item.subMenus, i)
                        }
                        return
                    })
                }
                map(list, id)
                return name
            },
            //修改
            showUpdateDialog(row) {
                this.$store.dispatch('common/getAutoCascaderData', {dataType: 'menu'})
                this.updateDialogVisible = true
                this.error = false
                this.$nextTick(function () {
                    this.updateItem = {
                        ...row,
                        icon: this.getDefaultUpload(row.icon),
                        pid: this.getPidArr(this.menuList, row.pid)
                    }
                })
            },
            hideUpdateDialog() {
                this.updateDialogVisible = false
                this.error = false
                this.updateItem = {}
            },
            async updateMenu(data) {
                this.updateMenuLoading = true
                const res = await this.$service.updateMenu({
                    ...data,
                    pid: data.pid[data.pid.length - 1],
                    icon: this.getUploadUrl(data.icon)
                })
                this.updateMenuLoading = false
                if (res.code === 20000) {
                    this.createLoad()
                    this.updateDialogVisible = false
                    this.error = false
                    this.updateItem = {}
                } else {
                    this.error = res.message || true
                }
            },
            //删除
            deleteMenu(row) {
                this.$confirm('您选择了1条数据，是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await this.$service.deleteMenu({
                        id: row.id
                    })
                    if (res.code === 20000) {
                        this.$notify({
                            title: '提示',
                            type: 'success',
                            message: '删除成功',
                        })
                        this.createLoad()
                    } else {
                        this.$notify.error({
                            title: '提示',
                            message: res.message ? res.message : '删除失败',
                        })
                    }
                }).catch(() => {
                });
            },
            async createLoad() {
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
            }
        },
        created() {
            this.createLoad()
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

    .menu_icon
        width 80px
</style>
