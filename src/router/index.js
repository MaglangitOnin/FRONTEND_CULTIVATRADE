import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/Admin/AdminLoginView.vue'),
    },
    {
      path: '/adminHome',
      name: 'adminHome',
      component: () => import('../views/Admin/AdminHomeView.vue'),
    },
    {
      path: '/sellerApplication',
      name: 'sellerApplication',
      component: () => import('../views/Admin/SellerApplicationView.vue'),
    },
    {
      path: '/sellerProfile',
      name: 'sellerProfile',
      component: () => import('../views/Admin/SellerProfileView.vue'),
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../views/Admin/InventoryView.vue'),
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('../views/Admin/ProductView.vue'),
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('../views/Admin/ReportView.vue'),
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: () => import('../views/Admin/MarketplaceView.vue'),
    },
    {
      path: '/sellerHome',
      name: 'sellerHome',
      component: () => import('../views/Seller/SellerHomeView.vue'),
    },
  ],
});

export default router;
