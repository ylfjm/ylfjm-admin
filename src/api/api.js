import axios from 'axios'
import qs from 'qs'

import router from '@/router'

const config = {
    timeout: 50000
}
const service = axios.create(config)

export default class Api {
    static axiosPost(url = '', data = {}, params = {}) {
        return new Promise(function (resolve, reject) {
            service({
                method: 'post',
                url,
                data,
                params,
                paramsSerializer: params => {
                    return qs.stringify(params, {indices: false})
                }
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    resolve(err)
                })
        })
    }

    static axiosGet(url = '', data = {}, params = {}) {
        return new Promise(function (resolve, reject) {
            service({
                method: 'get',
                url,
                data,
                params,
                paramsSerializer: params => {
                    return qs.stringify(params, {indices: false})
                }
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    resolve(err)
                })
        })
    }

    static axiosPut(url = '', data = {}, params = {}) {
        return new Promise(function (resolve, reject) {
            service({
                method: 'put',
                url,
                data,
                params,
                paramsSerializer: params => {
                    return qs.stringify(params, {indices: false})
                }
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    resolve(err)
                })
        })
    }

    static axiosDelete(url = '', data = {}, params = {}) {
        return new Promise(function (resolve, reject) {
            service({
                method: 'delete',
                url,
                data,
                params,
                paramsSerializer: params => {
                    return qs.stringify(params, {indices: false})
                }
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    resolve(err)
                })
        })
    }

    static axiosPatch(url = '', data = {}, params = {}) {
        return new Promise(function (resolve, reject) {
            service({
                method: 'patch',
                url,
                data,
                params,
                paramsSerializer: params => {
                    return qs.stringify(params, {indices: false})
                }
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    resolve(err)
                })
        })
    }

    static axiosDownLoad(url = '', data = {}, params = {}, type = 'POST') {
        return new Promise(function (resolve, reject) {
            service({
                method: type,
                url: url,
                data,
                params,
                paramsSerializer: params => {
                    return qs.stringify(params, {indices: false})
                },
                responseType: 'blob'
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    resolve(err)
                })
        })
    }
}
// 添加请求拦截器
service.interceptors.request.use(
    function (request) {
        // 在发送请求之前做些什么
        request.url = (process.env.VUE_APP_APIURL || '') + request.url
        request.headers = {
            admin_token: localStorage.getItem('admin_token') || ''
        }
        if (request.params) {
            request.params = deleteNullKey(request.params)
        }
        return Promise.resolve(request)
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
service.interceptors.response.use(
    function (response) {
        // console.log(JSON.stringify(response))
        if (response.status === 200 && response.headers.admin_token) {
            localStorage.setItem('admin_token', response.headers.admin_token)
        }
        // 对响应数据做点什么
        // response.data = Object.assign(
        //     {token: response.headers.admin_token},
        //     {res: response.data},
        //     {status: response.status}
        // )
        response.data = Object.assign(response.data)
        return Promise.resolve(response)
    },
    function (err) {
        // console.log(JSON.stringify(err.response));
        let resData = {}
        let data = {}
        // 对响应错误做点什么
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    data.message = '错误请求'
                    data.code = 40400
                    break
                case 401:
                    data.message = err.response.data
                    data.code = 40401
                    setTimeout(() => {
                        router.push('/login')
                    }, 1000)
                    break
                case 403:
                    data.message = '拒绝访问'
                    data.code = 40403
                    break
                case 404:
                    data.message = '请求资源不存在'
                    data.code = 40404
                    break
                case 500:
                    data.message = '服务器端出错'
                    data.code = 40500
                    break
                default:
                    data.message = '连接错误'
                    data.code = 50000
            }
        } else {
            data.message = '连接到服务器发生错误'
            data.status = 50000
        }
        resData.data = data

        return Promise.resolve(resData)
    }
)

const deleteNullKey = obj => {
    const temp = {}
    Object.keys(obj).forEach(item => {
        if (obj[item] === 0 || !!obj[item]) {
            temp[item] = obj[item]
        }
    })
    return temp
}
