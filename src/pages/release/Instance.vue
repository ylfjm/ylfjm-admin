<template>
    <div>
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
        <el-row>
            <div style="margin-left: 80px;">
                <el-card shadow="always" style="margin: 10px 15px 20px 15px; float: left; width: 330px;" v-for="app in applicationList" :key="app.instanceId">
                    <div slot="header">
                        <span>{{app.appName}}</span>
                    </div>
                    <el-row>
                        <el-col :span="19">
                            <div style="line-height: 28px;">{{app.instanceId}}</div>
                        </el-col>
                        <el-col :span="5" style="align-items: end;">
                            <el-button type="warning" size="mini" @click="statusUpdate(app, 'OUT_OF_SERVICE')" v-if="app.status==='UP'">
                                暂停
                            </el-button>
                            <el-button type="primary" size="mini" @click="statusUpdate(app, 'UP')" v-if="app.status==='OUT_OF_SERVICE'">
                                启动
                            </el-button>
                        </el-col>
                    </el-row>
                </el-card>
            </div>
        </el-row>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                applicationCount: 0,
                instanceCount: 0,
                statusText: 'all up',
                applicationList: [],
                intervalId: '',
            }
        },
        methods: {
            async searchCommon() {
                const res = await this.$service.getApplications()
                if (res.code === 20000) {
                    this.applicationList = res.data || []
                    this.applicationCount = this.applicationList.length;
                    this.instanceCount = this.applicationList.length;
                    let count = 0;
                    this.applicationList.map(item => {
                        if (item.status === 'UP') {
                            count++;
                        }
                    })
                    if (this.applicationList.length > count) {
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
    .el-card .el-card__header {
        background-color: #1AE6BD;
        color: white;
        font-weight: bold;
    }
    .el-card .el-card__header div span {
        font-size: 18px;
        /*font-weight: bold;*/
    }
</style>
