<template>
    <el-cascader
            :size="size"
            :options="autoCascaderData[dataType]"
            clearable
            :props="{checkStrictly: checkStrictly}"
            :placeholder="placeholder"
            :value="value"
            :disabled="disabled"
            @change="change"
    ></el-cascader>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        name: 'autoCascaderForm',
        data() {
            return {
                value: []
            }
        },
        props: {
            dataType: String,
            fieldName: String,
            selectCb: Function,
            defaultValue: {},
            checkStrictly: {
                type: Boolean,
                default: false
            },
            props: {},
            size: {
                type: String,
                default: 'mini'
            },
            placeholder: {
                type: String,
                default: '请选择'
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            ...mapState({
                autoCascaderData: function (state) {
                    if (!state.common.autoCascaderData[this.dataType]) {
                        return {
                            [this.dataType]: []
                        }
                    }
                    return state.common.autoCascaderData
                }
            })
        },
        methods: {
            change(value) {
                this.$emit('selectCb', {
                    fieldName: this.fieldName,
                    value: value
                })
            }
        },
        mounted() {
            if (!this.autoCascaderData[this.dataType] || this.autoCascaderData[this.dataType].length === 0) {
                this.$store.dispatch('common/getAutoCascaderData', {
                    dataType: this.dataType
                })
            }
        },
        watch: {
            defaultValue: function (n) {
                if (n) {
                    const _arr = []
                    n.forEach(item => {
                        _arr.push(Number(item))
                    })
                    this.value = _arr ? _arr : []
                }
            }
        }
    }
</script>
<style scoped lang="stylus">
    .el-scrollbar
        overflow hidden
</style>