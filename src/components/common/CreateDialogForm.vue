<template>
    <el-dialog
            :width="width"
            :title="title"
            :visible.sync="visible"
            :before-close="hideDialog"
            :append-to-body="true"
    >
        <div slot="title">
            <div class="page_title">{{ title }}</div>
        </div>
        <div class="form_create">
            <el-form
                    :model="form"
                    :label-width="formLabelWidth"
                    ref="createDialogForm"
                    size="small"
                    :label-position="labelPosition"
            >
                <CustomFormItem
                        v-for="column in columns"
                        :key="column.label"
                        :rules="column.rules"
                        :label="column.label"
                        :fieldName="column.fieldName"
                        :defaultValue="form[column.fieldName]"
                        :type="column.type"
                        :column="column"
                        :dataType="column.dataType"
                        @changeFieldValue="changeField"
                        :modal-append-to-body="false"
                ></CustomFormItem>
            </el-form>
        </div>
        <div slot="footer" class="slot_footer">
            <el-button @click="hideDialog">取 消</el-button>
            <el-button
                    class="slot_footer_submit_btn"
                    type="primary"
                    @click="currentSubmit"
                    :loading="loading"
            >
                确 定
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
    import CustomFormItem from './CustomFormItem'

    export default {
        name: 'createDialogForm',
        data() {
            return {}
        },
        props: {
            title: String,
            visible: Boolean,
            hideDialog: Function,
            submit: Function,
            columns: Array,
            loading: Boolean,
            error: {},
            form: Object,
            width: {
                default: '50%'
            },
            formLabelWidth: {
                default: '30%'
            },
            labelPosition: {
                default: 'right'
            },
            changeFieldValue: Function
        },
        methods: {
            changeField(data) {
                this.$emit('changeFieldValue', {
                    ...data,
                    type: 'form'
                })
            },
            currentSubmit() {
                this.$refs['createDialogForm'].validate(valid => {
                    if (valid) {
                        // console.warn('测试提交', this.form)
                        this.submit(this.form)
                    } else {
                        return false
                    }
                })
            }
        },
        watch: {
            loading: function (n, o) {
                if (o && !n) {
                    if (this.error) {
                        this.$notify.error({
                            title: '提示',
                            message: typeof this.error === 'boolean' ? '新增失败' : this.error,
                        })
                    } else {
                        this.$notify({
                            title: '提示',
                            type: 'success',
                            message: '新增成功',
                        })
                        this.$refs['createDialogForm'].resetFields()
                    }
                }
            }
        },
        components: {
            CustomFormItem
        }
    }
</script>
