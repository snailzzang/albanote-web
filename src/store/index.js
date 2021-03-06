import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

// const baseURL = 'http://albabasic-dev.us-west-2.elasticbeanstalk.com'
const baseURL = 'http://localhost:8000'
const api = axios.create({
  baseURL: baseURL
})
api.defaults.withCredentials = true

const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = 'Token ' + token
}

Vue.prototype.$api = api

export default new Vuex.Store({
  state: {
    token: null,
    user: null,
    members: null,
    allMembers: null,
    works: [],
    timetables: null
  },
  mutations: {
    LOGIN (state, token) {
      state.token = token
    },
    LOGOUT (state) {
      state.token = null
      localStorage.removeItem('token')
    },
    USER (state, user) {
      state.user = user
    },
    MEMBERS (state, members) {
      state.members = members
    },
    ALL_MEMBERS_OF_BUSINESS (state, members) {
      state.allMembers = members
    },
    UPDATE_MEMBER (state, member) {
      let index = state.allMembers.findIndex(m => {
        return m.id === member.id
      })
      state.allMembers.splice(index, 1, member)
    },
    ADDMEMBER (state, member) {
      state.members.push(member)
    },
    WORKS (state, works) {
      state.works = works
    },
    ADDWORKS (state, works) {
      state.works.unshift(works)
    },
    REMOVE_WORK (state, workId) {
      let index = state.works.findIndex(w => {
        return w.id === workId
      })
      state.works.splice(index, 1)
    },
    TIMETABLES (state, timetables) {
      state.timetables = timetables
    }
  },
  actions: {
    LOGIN ({ commit }, { username, password }) {
      return axios.post(`${baseURL}/rest-auth/login/`, { username, password })
        .then(res => {
          localStorage.setItem('token', res.data.key)
          commit('LOGIN', res.data.key)
        })
    },
    LOGOUT ({ commit }) {
      commit('LOGOUT')
    },
    SIGNUP ({ commit }, { username, password1, password2 }) {
      return axios.post(`${baseURL}/rest-auth/registration/`, { username, password1, password2 })
        .catch(e => {
          console.log(e)
          alert('회원가입에 실패했습니다.')
        })
    },
    USER ({ commit }) {
      return api.get(`/api/v1/users/me/`).then(res => commit('USER', res.data))
    },
    MEMBERS ({ commit }) {
      return api.get(`/api/v1/members/`).then(res => commit('MEMBERS', res.data))
        .catch(err => console.log(err))
    },
    UPDATE_MEMBER ({ commit }, member) {
      commit('UPDATE_MEMBER', member)
    },
    ALL_MEMBERS_OF_BUSINESS ({ commit }, businessId) {
      return api.get(`/api/v1/members/all_members_of_business/?business=${businessId}`)
        .then(res => commit('ALL_MEMBERS_OF_BUSINESS', res.data))
        .catch(err => console.log(err))
    },
    TIMETABLES ({ commit }, businessId) {
      let url = `/api/v1/timetables`
      if (businessId) {
        url = `${url}/?business=${businessId}`
      }
      return api.get(url).then(res => commit('TIMETABLES', res.data))
        .catch(err => console.log(err))
    },
    WORKS ({ commit }, businessId, month) {
      let url = `/api/v1/attendances`
      if (businessId) {
        url = `${url}/?business=${businessId}`
      }
      return api.get(url).then(res => commit('WORKS', res.data))
        .catch(err => console.log(err))
    },
    ADDWORKS ({ commit }, form) {
      return api.post(`/api/v1/attendances/`, form).then(res => commit('ADDWORKS', res.data))
    },
    REMOVE_WORK ({ commit }, id) {
      commit('REMOVE_WORK', id)
    },
    ADDBUSINESS ({ commit }, form) {
      return api.post(`/api/v1/businesses/`, form).then(res => commit('ADDMEMBER', res.data.member))
    }
  },
  modules: {
  }
})
