import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/modules/auth';
import Home from '@/views/Home.vue';
import Login from '@/views/auth/Login.vue';
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { authenticating, user } = useAuth();

  if (
    authenticating.value === false &&
    to.meta.requiresAuth === true &&
    !user?.value
  ) {
    next({ name: 'login' });
  } else if ((to.name == 'login' || to.name == 'register') && user!.value) {
    next({ name: 'home' });
  } else next();
});

export default router;
