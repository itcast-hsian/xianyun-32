// 导入下载的本地存储的插件
import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  window.onNuxtReady(() => {
    createPersistedState({
        key: 'store',
    })(store)
  })
}