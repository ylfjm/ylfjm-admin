<template>
    <div>
        <el-upload
                action="String"
                list-type="picture-card"
                :size="size"
                :accept="accept"
                :limit="limit"
                :on-remove="handleRemove"
                :before-upload="beforeImageUpload"
                :file-list="fileList"
                :multiple="multiple"
                :on-exceed="onExceed"
                :http-request="upload"
        >
            <i class="el-icon-plus" v-loading="loading"></i>
        </el-upload>
    </div>
</template>
<script>
    import config from '@/api/config'

    export default {
        name: 'uploadImage',
        data() {
            return {
                fileList: [],
                config,
                loading: false
            }
        },
        props: {
            dataType: String,
            fieldName: String,
            selectCb: Function,
            defaultValue: {},
            multiple: {
                type: Boolean,
                default: false
            },
            size: {
                type: String,
                default: 'mini'
            },
            folder: {
                type: String,
                default: 'system'
            },
            accept: {
                type: String,
                default: 'image/jpeg,image/png'
            },
            limit: {
                type: Number,
                default: 1
            }
        },
        methods: {
            async onExceed(files, fileList) {
                let list = fileList
                // console.log('exceed1', list)
                list.shift()
                // console.log('exceed2', list)
                let formData = new FormData()
                formData.append('file', files[0])
                formData.append('folder', this.folder)
                // console.log('exceed3', formData)
                this.loading = true
                const res = await this.$service.uploadSingle(formData)
                this.loading = false
                if (res.status < 400) {
                    list.push({
                        uid: files[0].uid,
                        name: files[0].name,
                        size: files[0].size,
                        type: files[0].type,
                        url:
                            res.res.path && res.res.path.indexOf('http') > -1
                                ? res.res.path
                                : config.uploadDomain + res.res.path
                    })
                    this.$emit('selectCb', {
                        fieldName: this.fieldName,
                        value: list
                    })
                } else {
                    this.$message.error(res.data ? res.data : '上传失败')
                }
            },
            handleRemove(file, fileList) {
                this.$emit('selectCb', {
                    fieldName: this.fieldName,
                    value: fileList
                })
            },
            async upload(fileData) {
                let formData = new FormData()
                formData.append('file', fileData.file)
                formData.append('folder', this.folder)
                this.loading = true
                const res = await this.$service.uploadSingle(formData)
                this.loading = false
                if (res.status < 400) {
                    // console.warn('内部的图片上传', config.uploadDomain + res.res.path)
                    this.fileList.push({
                        uid: fileData.file.uid,
                        name: fileData.file.name,
                        size: fileData.file.size,
                        type: fileData.file.type,
                        url:
                            res.res.path && res.res.path.indexOf('http') > -1
                                ? res.res.path
                                : config.uploadDomain + res.res.path
                    })
                } else {
                    this.$message.error(res.data ? res.data : '上传失败')
                }
            },
            beforeImageUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
                const isLt1M = file.size / 1024 < 500

                if (!isJPG) {
                    this.$message.error('上传图片格式只能是 PNG,JPG 格式!')
                }
                if (!isLt1M) {
                    this.$message.error('上传图片大小不能超过 500KB!')
                }
                return isJPG && isLt1M
            }
        },
        watch: {
            defaultValue: function (n = '') {
                // console.log('defaultValue', n)
                if (typeof n !== 'string' && JSON.stringify(n).includes('url')) {
                    this.fileList = n
                } else if (typeof n === 'string' || !JSON.stringify(n).includes('url')) {
                    this.fileList = []
                }
            },
            fileList: function (n) {
                if (n && n.length !== 0) {
                    this.$emit('selectCb', {
                        fieldName: this.fieldName,
                        value: n
                    })
                }
            }
        }
    }
</script>
