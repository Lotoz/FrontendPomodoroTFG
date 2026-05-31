import { createRouter, createWebHistory } from 'vue-router'
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
    { path: '/', name: 'login', component: LoginView },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
    { path: '/tareas', name: 'tareas', component: MisionesView },
    { path: '/perfil', name: 'perfil', component: ProfileView },
    { path: '/bestiario', name: 'bestiario', component: BestiaryView },
    { path: '/heroes', name: 'taberna', component: TavernView },
    { path: '/battle', name: 'battle', component: BattleView },
    { path: '/cementerio', name: 'cementerio', component: GraveyardView },
    { path: '/campamento', name: 'campamento', component: CampView } // Añadida la ruta
  ]
})

export default router