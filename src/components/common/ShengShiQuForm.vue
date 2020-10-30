<template>
    <el-cascader
            :size="size"
            :options="provinceCityCountyData || []"
            clearable
            :placeholder="placeholder"
            :change-on-select="changeOnSelect"
            :value="value"
            :props="props"
            @change="change"
            :disabled="forbidSelect"
    ></el-cascader>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        name: 'shengShiQuForm',
        data() {
            return {
                value: this.defaultValue || [],
                props: {
                    value: 'id',
                    label: 'name',
                    children: 'children'
                }
            }
        },
        props: {
            fieldName: String,
            selectCb: Function,
            defaultValue: {},
            size: {
                type: String,
                default: 'mini'
            },
            changeOnSelect: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: '请选择'
            },
            forbidSelect: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            change(value) {
                this.$emit('selectCb', {
                    fieldName: this.fieldName,
                    value: value
                })
            }
        },
        computed: {
            ...mapState({
                provinceCityCountyData: state => state.common.provinceCityCountyData
            })
        },
        async mounted() {
            if (
                !this.provinceCityCountyData ||
                this.provinceCityCountyData.length === 0
            ) {
                this.$store.dispatch('common/getProvinceCityCounty', {})
            }
        },
        watch: {
            defaultValue: async function (n) {
                this.value = n ? n : []
            }
        }
    }
</script>
