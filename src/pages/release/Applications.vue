<template>
    <div>
        <!--<div class="search_box">
            <el-form :inline="true">
                <el-form-item class="submit_btn">
                    <el-button
                            @click="onSearch"
                            icon="el-icon-search"
                            size="small"
                            type="primary"
                            plain>
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </div>-->
        <el-row>
            <el-col :span="8">
                <div class="apps-status">
                    <div class="apps-status-title">APPLICATIONS</div>
                    <div class="apps-status-content">{{applicationCount}}</div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="apps-status">
                    <div class="apps-status-title">INSTANCES</div>
                    <div class="apps-status-content">{{instanceCount}}</div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="apps-status">
                    <div class="apps-status-title">STATUS</div>
                    <div class="apps-status-content" style="color: #32CD32;" v-if="statusText==='all up'">{{statusText}}</div>
                    <div class="apps-status-content" v-if="statusText!=='all up'">{{statusText}}</div>
                </div>
            </el-col>
        </el-row>
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
                        :index="index => index + 1"
                        label="序号"
                        fixed="left"
                        align="center"
                        width="70"
                ></el-table-column>
                <el-table-column
                        prop="ipAddr"
                        min-width="100"
                        show-overflow-tooltip
                        label="IP"
                ></el-table-column>
                <el-table-column
                        prop="port"
                        min-width="80"
                        label="端口号"
                >
                    <template slot-scope="scope">
                        <div style="color: #409EFF; font-size: 14px;">{{scope.row.port}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="appName"
                        min-width="180"
                        show-overflow-tooltip
                        label="服务名称"
                ></el-table-column>
                <el-table-column
                        prop="status"
                        min-width="150"
                        label="状态"
                >
                    <template slot-scope="scope">
                        <div style="color: #409EFF; font-size: 14px;" v-show="scope.row.status==='STARTING'">{{scope.row.status}}</div>
                        <div style="color: #67C23A; font-size: 14px;" v-show="scope.row.status==='UP'">{{scope.row.status}}</div>
                        <div style="color: #F56C6C; font-size: 14px;" v-show="scope.row.status==='OUT_OF_SERVICE'">{{scope.row.status}}</div>
                        <div style="color: #F56C6C; font-size: 14px;" v-show="scope.row.status==='DOWN'">{{scope.row.status}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="lastRenewalDate"
                        min-width="150"
                        show-overflow-tooltip
                        label="最近一次续约时间"
                ></el-table-column>
                <el-table-column
                        prop="lastUpdatedDate"
                        min-width="150"
                        show-overflow-tooltip
                        label="上次修改时间"
                ></el-table-column>
                <el-table-column
                        prop="registrationDate"
                        min-width="150"
                        show-overflow-tooltip
                        label="注册时间"
                ></el-table-column>
                <!--<el-table-column
                        prop="serviceUpDate"
                        min-width="150"
                        show-overflow-tooltip
                        label="上线时间"
                ></el-table-column>-->
                <el-table-column
                        fixed="right"
                        width="100"
                        label="操作"
                        align="center"
                >
                    <template slot-scope="scope">
                        <el-row type="flex" justify="center">
                            <el-button type="warning" size="mini" @click="statusUpdate(scope.row, 'OUT_OF_SERVICE')" v-if="scope.row.status==='UP'">
                                暂停
                            </el-button>
                            <el-button type="primary" size="mini" @click="statusUpdate(scope.row, 'UP')" v-if="scope.row.status==='OUT_OF_SERVICE'">
                                启动
                            </el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                applicationCount: 0,
                instanceCount: 0,
                statusText: 'all up',
                searchLoading: false,
                tableList: [],
                error: false,
                intervalId: '',
            }
        },
        methods: {
            async searchCommon() {
                this.searchLoading = true
                const res = await this.$service.getApplications()
                this.searchLoading = false
                if (res.code === 20000) {
                    this.tableList = res.data || []
                    this.applicationCount = this.tableList.length;
                    this.instanceCount = this.tableList.length;
                    let count = 0;
                    this.tableList.map(item => {
                        if (item.status === 'UP') {
                            count++;
                        }
                    })
                    if (this.tableList.length > count) {
                        this.statusText = count + ' available'
                    } else {
                        this.statusText = 'all up'
                    }
                } else {
                    this.$notify.error({
                        title: '提示',
                        message: res.message ? res.message : '查询失败',
                    })
                }
            },
            async statusUpdate(row, newStatus) {
                const res = await this.$service.applicationStatusUpdate({
                    appName: row.appName,
                    instanceId: row.instanceId,
                    newStatus: newStatus,
                })
                if (res.code === 20000) {
                    this.$notify({
                        title: '提示',
                        type: 'success',
                        message: '操作成功',
                    })
                    this.searchCommon()
                } else {
                    this.$notify.error({
                        title: '提示',
                        message: res.message ? res.message : '操作失败',
                    })
                }
            },
        },
        created() {
            this.searchCommon()
            this.intervalId = setInterval(() => {
                this.searchCommon()
            }, 10000)
        },
        beforeDestroy() {
            clearInterval(this.intervalId)
        },
        components: {}
    }
</script>
<style >
    .apps-status {
        height: 100px;
    }
    .apps-status .apps-status-title {
        height: 30px;
        line-height: 30px;
        text-align: center;
    }
    .apps-status .apps-status-content {
        height: 35px;
        line-height: 35px;
        text-align: center;
        font-size: 28px;
    }
</style>
