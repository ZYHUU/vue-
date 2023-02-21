import Vue from "vue";
// import Vuex from 'vuex'
// 引入自己实现的vuex
import Vuex from "../vuex.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    num: 0,
  },
  getters: {
    getNum(state) {
      return state.num;
    },
  },
  mutations: {
    incre(state, payload) {
      state.num += payload;
    },
    minus(state, payload) {
      state.num -= payload;
    },
  },
  actions: {
    asyncIncre({ commit }, payload) {
      // 模拟异步操作
      setTimeout(() => {
        commit("incre", payload);
      }, 1000);
    },
  },
});
