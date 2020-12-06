import { createStore, Commit } from 'vuex'
import axios from 'axios'
export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}
// 定义控制登录按钮数据类型
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
}
// 给avatar数据定义数据类型
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}
// 定义首页数据类型数据类型(Array类型)
export interface ColumnlProps {
  _id: string;
  title: string;
  avatar: ImageProps;
  description: string;
}
// 定义单独页面数据接口类型(Array类型)
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  author?: string;
  column: string;
  avatar?: ImageProps;

}
export interface GlobalErrorProps {
  status?: boolean;
  message?: string;
}
// 定义vuex数据接口的类型
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  Loading: boolean;
  columns: ColumnlProps[];
  posts: PostProps[];
  user: UserProps;
}
// 封装一个请求函数
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: string) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false, message: '' },
    // 账号密码存储地
    token: localStorage.getItem('token') || '',
    // 未加载出来时显示加载图标
    Loading: false,
    // 首页数据信息展示
    columns: [],
    // 每个单独页面的数据
    posts: [],
    // 控制登录按钮
    user: { isLogin: false }
  },
  mutations: {
    createPost (state, newPost) {
      state.posts.push(newPost.data)
      console.log(state.posts)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts (state, rawData) {
      state.posts = rawData.data.list
    },
    setLoading (state, status) {
      state.Loading = status
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      console.log(rawData)
      localStorage.setItem('token', token)
      console.log(token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout (state) {
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.commit.Authorization
    }
  },
  actions: {
    fetchColumns (context) {
      return getAndCommit('/columns', 'fetchColumns', context.commit)
    },
    fetchColumn ({ commit }, cid) {
      return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      return getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchPost ({ commit }, cid) {
      return getAndCommit(`/post/${cid}`, 'fetchPost', commit)
    },
    fetchCurrentUser ({ commit }) {
      return getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    createPost ({ commit }, payload) {
      return postAndCommit('/posts', 'createPost', commit, payload)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      console.log(id)
      console.log(state.columns)
      return state.columns.find(e => e._id === id)
    },
    getPortById: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    },
    getPostById: (state) => (cid: string) => {
      return state.posts.find(e => e._id === cid)
    }
  }
})
export default store
