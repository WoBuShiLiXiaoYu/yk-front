import {createRouter, createWebHistory} from "vue-router"

let router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component : () => import('../view/LoginView.vue')
        },
        {
            path: "/dashboard",
            component : () => import('../view/DashboardView.vue'),
            children: [
                {
                    path: "",
                    component : () => import('../view/StatisticView.vue'),
                },
                {
                    path: "user",
                    component : () => import('../view/UserView.vue'),
                },
                {
                    // 动态路由
                    path: "user/:id",
                    component : () => import('../view/UserDetailView.vue'),
                },
                {
                    path: "activity",
                    component : () => import('../view/ActivityView.vue'),
                },
                {
                    path: "activity/add",
                    component : () => import('../view/ActivityRecordView.vue'),
                },
                {
                    path: "activity/edit/:id",
                    component : () => import('../view/ActivityRecordView.vue'),
                },
                {
                    path: "activity/detail/:id",
                    component : () => import('../view/ActivityDetailView.vue'),
                },
                {
                    path: "clue",
                    component : () => import('../view/ClueView.vue'),
                },
                {
                    path: "clue/add",
                    component : () => import('../view/ClueRecordView.vue'),
                },
                {
                    path: "clue/edit/:id",
                    component : () => import('../view/ClueRecordView.vue'),
                },
                {
                    path: "clue/detail/:id",
                    component : () => import('../view/ClueDetailView.vue'),
                },
                {
                    path: "customer",
                    component : () => import('../view/CustomerView.vue'),
                },
                {
                    path: "customer/detail/:id",
                    component : () => import('../view/CustomerDetailView.vue'),
                },
                {
                    path: "tran",
                    component : () => import('../view/TranView.vue'),
                },
                {
                    path: "product",
                    component : () => import('../view/ProductView.vue'),
                },
                {
                    path: "dictype",
                    component : () => import('../view/DicTypeView.vue'),
                },
                {
                    path: "dicvalue",
                    component : () => import('../view/DicValueView.vue'),
                },
                {
                    path: "system",
                    component : () => import('../view/SystemView.vue'),
                },
            ]
        }
    ]
})

export default router;