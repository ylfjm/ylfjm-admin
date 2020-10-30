<template>
    <div>
        <div class="search_box">
            <el-form :inline="true" :model="formSearch" ref="formSearch">
                <el-form-item class="submit_btn">
                    <el-button
                            @click="onSearch"
                            icon="el-icon-search"
                            size="small"
                            type="primary"
                            plain>
                        查询
                    </el-button>
                    <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="small"
                            @click="showCreateDialog">
                        新增域名组
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
                    :header-cell-style="{backgroundColor: '#B3BFD0',fontSize: '14px',color: '#333333'}"
                    stripe
            >
                <el-table-column
                        type="index"
                        :index="index => index + 1 + (formSearch.pageNum - 1) * formSearch.pageSize"
                        label="序号"
                        fixed="left"
                        align="center"
                        width="70"
                ></el-table-column>
                <el-table-column
                        prop="apiUrl"
                        min-width="200"
                        show-overflow-tooltip
                        label="接口域名"
                ></el-table-column>
                <el-table-column
                        prop="imgUrl"
                        min-width="200"
                        label="图片域名"
                ></el-table-column>
                <el-table-column
                        prop="shareUrl"
                        min-width="200"
                        show-overflow-tooltip
                        label="分享域名"
                ></el-table-column>
                <el-table-column
                        prop="env"
                        min-width="150"
                        label="环境"
                ></el-table-column>
                <el-table-column
                        prop="version"
                        min-width="100"
                        show-overflow-tooltip
                        label="版本号"
                ></el-table-column>
                <el-table-column
                        fixed="right"
                        width="100"
                        label="操作"
                        align="center"
                >
                    <template slot-scope="scope">
                        <el-row type="flex" justify="center">
                            <el-button type="danger" size="mini" @click="deleteIOSDomain(scope.row)">删除</el-button>
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
                title="新增域名组"
                :visible="createDialogVisible"
                :form="form"
                :hideDialog="hideCreateDialog"
                @changeFieldValue="changeFieldValue"
                :submit="submitCreate"
                :columns="columns"
                :loading="createLoading"
                :error="error"
        />
    </div>
</template>
<script>
    import CreateDialogForm from '@/components/common/CreateDialogForm'

    export default {
        data() {
            return {
                formSearch: {
                    pageNum: 1,
                    pageSize: 10
                },
                searchLoading: false,
                total: 0,
                pages: 0,
                tableList: [],
                error: false,
                createDialogVisible: false,
                createLoading: false,
                form: {
                    apiUrl: '',
                    imgUrl: '',
                    shareUrl: '',
                    env: 'test',
                },
                columns: [
                    {
                        label: '接口域名',
                        fieldName: 'apiUrl',
                        type: 'input',
                        rules: [{required: true, message: '请输入接口域名', trigger: 'blur'}]
                    },
                    {
                        label: '图片域名',
                        fieldName: 'imgUrl',
                        type: 'input',
                        rules: [{required: true, message: '请输入图片域名', trigger: 'blur'}]
                    },
                    {
                        label: '分享域名',
                        fieldName: 'shareUrl',
                        type: 'input',
                        rules: [{required: true, message: '请输入分享域名', trigger: 'blur'}]
                    }
                ],

            }
        },
        methods: {
            //新增修改弹窗回传值
            changeFieldValue(data) {
                console.log("222---"+JSON.stringify(data))
                this[data.type][data.fieldName] = data.value
            },
            async onSearch() {
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
                    pageNum: this.formSearch.pageNum,
                    pageSize: this.formSearch.pageSize
                }
                this.searchLoading = true
                const res = await this.$service.getAppUrlList(formData)
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
                this.createDialogVisible = true
                this.error = false
            },
            hideCreateDialog() {
                this.createDialogVisible = false
                this.error = false
            },
            async submitCreate(data) {
                console.log("111---"+JSON.stringify(data))
                // this.createLoading = true
                // const res = await this.$service.addDepartment({
                //     ...data
                // })
                // this.createLoading = false
                // if (res.code === 20000) {
                //     this.createDialogVisible = false
                //     this.error = false
                //     this.searchCommon()
                // } else {
                //     this.error = res.message || true
                // }
            },
            //删除
            deleteIOSDomain(row) {
                this.$confirm('您选择了1条数据，是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await this.$service.deleteIOSDomain({
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
        created() {
            this.searchCommon()
        },
        components: {
            CreateDialogForm,
        }
    }
</script>
<style scoped lang="stylus"></style>
