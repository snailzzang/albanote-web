import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Business from '../views/Business.vue'
import AddBusiness from '../views/AddBusiness.vue'
import AddMember from '../views/AddMember.vue'
import AddTimetable from '../views/AddTimetable.vue'
import AddHoliday from '../views/AddHoliday.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'login', component: Login },
  { path: '/signup', name: 'signup', component: Signup },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/business/:id', name: 'business', component: Business, meta: { requiresAuth: true } },
  { path: '/business/:id/add-member', name: 'add-member', component: AddMember, meta: { requiresAuth: true } },
  { path: '/business/:id/add-timetable', name: 'add-timetable', component: AddTimetable, meta: { requiresAuth: true } },
  { path: '/business/:id/add-holiday', name: 'add-holiday', component: AddHoliday, meta: { requiresAuth: true } },
  { path: '/add-business/', name: 'add-business', component: AddBusiness, meta: { requiresAuth: true } }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => {
    return record.meta.requiresAuth
  })
  store.state.token = localStorage.getItem('token')
  if (!requiresAuth || store.state.token) {
    return next()
  }
  return next('/login')
})
export default router
