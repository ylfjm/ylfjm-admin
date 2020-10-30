import config from '@/api/config'

export default {
    methods: {
        getUploadUrl(data) {
            if (data && data.length !== 0) {
                return data[0].url.split(config.uploadDomain)[1]
            } else {
                return ''
            }
        },
        getUploadUrlList(data) {
            if (data && data.length !== 0) {
                return data
                    .map(item => {
                        return item.url.split(config.uploadDomain)[1]
                    })
                    .toString()
            } else {
                return ''
            }
        },
        getDefaultUpload(data) {
            if (data && data !== '') {
                return [
                    {
                        uid: new Date().valueOf(),
                        url: config.uploadDomain + data
                    }
                ]
            } else {
                return []
            }
        }
    }
}
