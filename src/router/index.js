import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import MisionesView from '../views/MisionesView.vue'
import ProfileView from '../views/ProfileView.vue'
import BestiaryView from '../views/BestiaryView.vue'
import TavernView from '../views/TavernView.vue'
import BattleView from '../views/BattleView.vue'
import GraveyardView from '../views/GraveyardView.vue'
import CampView from '../views/CampView.vue' // Importamos el campamento

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView, meta: { requiresAuth: false } },
    { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/tareas', name: 'tareas', component: MisionesView, meta: { requiresAuth: true } },
    { path: '/perfil', name: 'perfil', component: ProfileView, meta: { requiresAuth: true } },
    { path: '/bestiario', name: 'bestiario', component: BestiaryView, meta: { requiresAuth: true } },
    { path: '/heroes', name: 'taberna', component: TavernView, meta: { requiresAuth: true } },
    { path: '/battle', name: 'battle', component: BattleView, meta: { requiresAuth: true } },
    { path: '/cementerio', name: 'cementerio', component: GraveyardView, meta: { requiresAuth: true } },
    { path: '/campamento', name: 'campamento', component: CampView, meta: { requiresAuth: true } } // Añadida la ruta
  ]
})

// Guard de rutas para validar autenticación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authStore.token) {
    // Si la ruta requiere autenticación y no hay token, redirige al login
    next({ name: 'login' })
  } else if (to.path === '/' && authStore.token) {
    // Si está en login pero ya tiene token, redirige al dashboard
    next({ name: 'dashboard' })
  } else {
    // Permite el acceso
    next()
  }
})

export default router