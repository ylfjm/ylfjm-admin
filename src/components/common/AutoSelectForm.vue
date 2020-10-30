<template>
    <el-select
            v-model="value"
            :disabled="disabled"
            clearable
            :placeholder="placeholder"
            @change="change"
            :size="size"
            :multiple="multiple"
    >
        <el-option
                v-for="item in autoSelectData[dataType]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
        ></el-option>
    </el-select>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        name: 'autoSelectForm',
        data() {
            return {
                value: this.defaultValue
            }
        },
        props: {
            dataType: String,
            fieldName: String,
            selectCb: Function,
            defaultValue: {},
            multiple: Boolean,
            disabled: {
                type: Boolean,
                default: false
            },
            size: {
                type: String,
                default: 'mini'
            },
            placeholder: {
                type: String,
                default: '请选择'
            }
        },
        computed: {
            ...mapState({
                autoSelectData: function (state) {
                    // console.log('feng',state)
                    // console.error('qing',state.common.autoSelectData)
                    if (!state.common.autoSelectData[this.dataType]) {
                        return {
                            [this.dataType]: []
                        }
                    }
                    return state.common.autoSelectData
                }
            })
        },
        methods: {
            change(value) {
                // this.$set(form, item.valueName, $event)
                this.$emit('selectCb', {
                    fieldName: this.fieldName,
                    value
                })
            }
        },
        mounted() {
            if (!this.autoSelectData[this.dataType] || this.autoSelectData[this.dataType].length === 0) {
                this.$store.dispatch('common/getAutoSelectData', {
                    dataType: this.dataType
                })
            }
        },
        watch: {
            defaultValue: function (n) {
                this.value = n
            }
        }
    }
</script>
