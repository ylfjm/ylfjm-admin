<template>
    <div v-if="type === 'input'">
        <el-form-item :label="label" :prop="fieldName" :rules="rules">
            <el-input
                    @change="changeValue"
                    :maxlength="column.maxlength"
                    :disabled="column.disabled"
                    :type="column.textType || 'text'"
                    size="small"
                    :opinput="column.focus"
                    v-model="value"
                    :placeholder="column.placeholder || ''"
            ></el-input>
            <span class="suffix" v-show="column.suffix && column.suffix !== ''">{{ column.suffix }}</span>
        </el-form-item>
    </div>
    <div v-else-if="type === 'inputNumber'">
        <el-form-item :label="label" :prop="fieldName" :rules="rules">
            <el-input-number
                    @change="changeValue"
                    :min="0"
                    :precision="0"
                    controls-position="right"
                    size="small"
                    v-model="value"
            ></el-input-number>
        </el-form-item>
    </div>
    <div v-else-if="type === 'number'">
        <el-form-item
                :label="label"
                :prop="fieldName"
                :rules="rules"
                class="specialWidth3"
        >
            <el-input
                    @change="changeValue"
                    :maxlength="column.maxlength"
                    :disabled="column.disabled"
                    :type="column.textType || 'text'"
                    size="small"
                    v-model.number="value"
                    @keydown.native="inputLimit"
                    :placeholder="column.placeholder || ''"
                    onkeyup="value=value.replace(/[^\d]/g,'') "
            ></el-input>
            <span class="suffix" v-show="column.suffix && column.suffix !== ''">{{ column.suffix }}</span>
        </el-form-item>
    </div>
    <div v-else-if="type === 'textarea'">
        <el-form-item :label="label" :prop="fieldName" :rules="rules">
            <el-input
                    type="textarea"
                    size="small"
                    :rows="3"
                    :placeholder="column.placeholder || ''"
                    @change="changeValue"
                    v-model="value"
            ></el-input>
        </el-form-item>
    </div>
    <div v-else-if="type === 'select'">
        <el-form-item :label="label" :prop="fieldName" :rules="rules">
            <el-select
                    @change="changeValue"
                    clearable
                    size="small"
                    v-model="selectValue"
            >
                <el-option
                        v-for="item in column.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                ></el-option>
            </el-select>
        </el-form-item>
    </div>
    <div v-else-if="type === 'radio'">
        <el-form-item :label="label" :prop="fieldName" :rules="rules">
            <el-radio-group @change="changeValue" v-model="selectValue">
                <el-radio
                        v-for="item in column.options"
                        :key="item.value"
                        :label="item.value"
                >
                    {{ item.label }}
                </el-radio>
            </el-radio-group>
        </el-form-item>
    </div>
    <div v-else-if="type === 'autoSelect'">
        <el-form-item :label="label" :prop="fieldName" :rules="rules">
            <AutoSelectForm
                    @selectCb="changeValueChild"
                    size="small"
                    :multiple="column.multiple"
                    :defaultValue="value"
                    :key="fieldName"
                    :fieldName="fieldName"
                    :dataType="dataType || ''"
            ></AutoSelectForm>
        </el-form-item>
    </div>
    <div v-else-if="type === 'autoCascader'">
        <el-form-item :label="label" :prop="fieldName" :rules="rules">
            <AutoCascaderForm
                    @selectCb="changeValueChild"
                    size="small"
                    :defaultValue="value"
                    :key="fieldName"
                    :checkStrictly="column.checkStrictly"
                    :fieldName="fieldName"
                    :dataType="dataType || ''"
            ></AutoCascaderForm>
        </el-form-item>
    </div>
    <div v-else-if="type === 'upload'">
        <el-form-item :label="label" :prop="fieldName" :rules="rules">
            <UploadImage
                    @selectCb="changeValueChild"
                    :defaultValue="value"
                    :multiple="column.multiple"
                    :folder="column.folder"
                    :key="fieldName"
                    :fieldName="fieldName"
            ></UploadImage>
            <span class="suffix" v-show="column.suffix && column.suffix !== ''">{{ column.suffix }}</span>
        </el-form-item>
    </div>
    <div v-else-if="type === 'shenshiqu'">
        <el-form-item :label="label" :prop="fieldName" :rules="rules">
            <ShengShiQuForm
                    @selectCb="changeValueChild"
                    :defaultValue="value"
                    :key="fieldName"
                    :fieldName="fieldName"
            ></ShengShiQuForm>
        </el-form-item>
    </div>
</template>
<script>
    import AutoSelectForm from './AutoSelectForm'
    import AutoCascaderForm from './AutoCascaderForm'
    import UploadImage from './UploadImage'
    import ShengShiQuForm from './ShengShiQuForm'

    export default {
        name: 'customFormItem',
        data() {
            return {
                value: this.defaultValue || '',
                selectValue: this.defaultValue || ''
            }
        },
        props: {
            label: String,
            fieldName: String,
            type: String,
            changeFieldValue: Function,
            column: Object,
            dataType: String,
            defaultValue: {},
            rules: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            changeValue(value) {
                this.$emit('changeFieldValue', {
                    fieldName: this.fieldName,
                    value: value
                })
            },
            changeValueChild(value) {
                this.$emit('changeFieldValue', {
                    fieldName: this.fieldName,
                    value: value.value
                })
            },
            inputLimit(e) {
                let num = e.target.value || ''
                let code = e.which || e.keyCode
                let str =
                    e.key && e.key !== 'Unidentified' ? e.key : num.substr(num.length - 1)
                // console.log('|type:' + e.type + '|code:' + code + '|str:' + str + '|value:' + num)
                if (code === '8') {
                    return true
                }
                if (/[^\d]/g.test(num)) {
                    // console.log(1)
                    return true
                } else {
                    return false
                }
            }
        },
        watch: {
            defaultValue: function (n) {
                this.selectValue = n
                this.value = n
            }
        },
        components: {
            AutoSelectForm,
            UploadImage,
            AutoCascaderForm,
            ShengShiQuForm
        }
    }
</script>
<style scoped lang="stylus">
    .suffix
        color #97999F
        font-size 14px
</style>
