const defaultState = {
  priceData: []
}

const state = { ...defaultState }

const mutations = {
  UPDATE_PRICE_DATA (state) {
  },
  RESET (state) {
  }
}

const actions = {
  onInit ({ commit }) {
    commit('RESET')
  }
  // async onStartLoading$ ({ commit }) {
  //   try {
  //     const result = await $api.fetchDatabase()
  //     fsm.$emit('load-success', result)
  //   } catch (error) {
  //     fsm.$emit('load-error', error.message)
  //   }
  // },
  // onLoadSuccess$ ({ commit }, result) {
  //   commit('UPDATE_PRICE_DATA', result)
  // },
  // onLoadError$ ({ commit, dispatch }, message) {
  //   dispatch('error', message)
  // }
}

export default {
  state,
  mutations,
  actions
}
