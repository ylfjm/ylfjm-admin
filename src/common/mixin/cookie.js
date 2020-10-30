import CryptoJS from 'crypto-js'

const key = CryptoJS.enc.Utf8.parse('1234123412ABCDEF') //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412') //十六位十六进制数作为密钥偏移量

export default {
    methods: {
        setCookie(c_name, value, expiredays) {
            let exdate = new Date()
            exdate.setDate(exdate.getDate() + expiredays)
            document.cookie =
                c_name +
                '=' +
                escape(value) +
                (expiredays == null ? '' : ';expires=' + exdate.toGMTString())
        },
        getCookie(c_name) {
            if (document.cookie.length > 0) {
                let c_start = document.cookie.indexOf(c_name + '=')
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1
                    let c_end = document.cookie.indexOf(';', c_start)
                    if (c_end == -1) c_end = document.cookie.length
                    return unescape(document.cookie.substring(c_start, c_end))
                }
            }
            return ''
        },
        delCookie(c_name) {
            let exp = new Date()
            exp.setTime(exp.getTime() - 1)
            let cval = this.getCookie(c_name)
            if (cval != null)
                document.cookie = c_name + '=' + cval + ';expires=' + exp.toGMTString()
        },
        //解密方法
        Decrypt(word) {
            let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
            let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
            let decrypt = CryptoJS.AES.decrypt(srcs, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            })
            let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
            return decryptedStr.toString()
        },
        //加密方法
        Encrypt(word) {
            let srcs = CryptoJS.enc.Utf8.parse(word)
            let encrypted = CryptoJS.AES.encrypt(srcs, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            })
            return encrypted.ciphertext.toString().toUpperCase()
        }
    }
}
