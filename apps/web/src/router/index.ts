// src/router/index.ts
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: AppLayout,
        children: [{
            path: '',
            name: 'Home',
            component: () => import('@/pages/Dashboard.vue'),
            meta: {
                title: 'Dashboard'
            }
        },
            {
                path: '/webhooks',
                name: 'Webhooks',
                component: () => import('@/pages/Webhooks.vue'),
                meta: {
                    title: 'Webhooks'
                }
            },
            {
                path: '/crons',
                name: 'Crons',
                component: () => import('@/pages/Crons.vue'),
                meta: {
                    title: 'Cron Jobs'
                }
            },
            {
                path: '/monitoring',
                name: 'Monitoring',
                component: () => import('@/pages/Monitoring.vue'),
                meta: {
                    title: 'Monitoring'
                }
            },
            {
                path: '/logs',
                name: 'Logs',
                component: () => import('@/pages/Logs.vue'),
                meta: {
                    title: 'Logs'
                }
            },
            {
                path: '/organizations',
                name: 'Organizations',
                component: () => import('@/pages/Organizations.vue'),
                meta: {
                    title: 'Organizations'
                }
            },
            {
                path: '/settings',
                name: 'Settings',
                component: () => import('@/pages/Settings.vue'),
                meta: {
                    title: 'Settings'
                }
            },
            // 404
            {
                path: '/:pathMatch(.*)*',
                name: 'NotFound',
                component: () => import('@/pages/NotFound.vue'),
                meta: {
                    title: '404 - Page not found'
                }
            }
        ]
    }
];

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return {top: 0};
    }
});

// Navigation guards
router.beforeEach((to, from, next) => {
    // Mettre à jour le titre de la page
    document.title = `${to.meta.title || 'Octopus'} | Octopus`;
    next();
});

export default router;
