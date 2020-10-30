import Vue from 'vue'
import VueRouter from 'vue-router'

//登录
import Login from "./pages/login/Login"
//主页
import Home from "./pages/home/Home"
import Console from "./pages/console/Console.vue"

//系统管理
import Admin from "./pages/system/Admin"
import Role from "./pages/system/Role"
import Department from "./pages/system/Department"
import Menu from "./pages/system/Menu"
import Permission from "./pages/system/Permission"

import Applications from "./pages/release/Applications"

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', redirect: '/console'},
        {
            path: '/login',
            name: 'login',
            components: {login: Login}
        },
        //主页
        {
            path: "/console",
            name: "console",
            component: Console
        },
        {
            path: '/home',
            name: 'home',
            component: Home
        },
        //系统管理
        {
            path: '/admin',
            name: 'admin',
            component: Admin
        },
        {
            path: "/role",
            name: "role",
            component: Role
        },
        {
            path: "/department",
            name: "department",
            component: Department
        },
        {
            path: '/menu',
            name: 'menu',
            component: Menu
        },
        {
            path: "/permission",
            name: "permission",
            component: Permission
        },
        {
            path: "/applications",
            name: "applications",
            component: Applications
        },
    ]
})
router.beforeEach((to, from, next) => {
    // if (to.path === '/login') {
    //     localStorage.removeItem('userInfo');
    // }
    // console.log("path===" + to.fullPath);
    // // let menus = localStorage.getItem('menus') ? JSON.parse(localStorage.getItem('menus')) : [];
    // if (!localStorage.getItem('userInfo') && to.fullPath !== '/login') {
    //     next('/login')
    // } else if (to.fullPath === '/login') {
    //     next();
    // }
    // // else if (GetByUrl(menus, to.fullPath)) {
    // //     next();
    // // }
    // else if (to.fullPath === '/home') {
    //     next();
    // }
    next()
    // next(false);
})
export default router
// const GetByUrl = function (data = [], url = '/') {
//     let path = '/' + url.split('/')[1];
//     let flag = false;
//     let map = (d, u) => {
//         d.forEach(item => {
//             if (item.url === u) {
//                 flag = true
//             } else if (item.subMenus) {
//                 map(item.subMenus, u)
//             }
//         });
//     };
//     map(data, path);
//     return flag;
// };

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}