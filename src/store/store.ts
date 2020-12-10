import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
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
  author?: string | UserProps;
  column?: string;
  avatar?: ImageProps;
  isHTML?: boolean;
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
// 封装一个请求函数,通过method控制获取的是post请求还是get请求默认get请求
const asyncAndCOmmit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }) => {
  const { data } = await axios(url, config)
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
      console.log(newPost.data)
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
    fetchPost (state, rawData) {
      state.posts = [rawData.data]
    },
    deletePost (state, { data }) {
      state.posts = state.posts.filter(post => post._id !== data._id)
    },
    updatePost (state, { data }) {
      console.log(data)
      state.posts = state.posts.map(post => {
        console.log(post)
        if (post._id === data._id) {
          return data
        } else {
          return post
        }
      })
    },
    // 控制加载页面动画
    setLoading (state, status) {
      state.Loading = status
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    // 控制登录状态
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    // 获取登录账号的token并将其存入浏览器缓存中
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    // 退出登陆时清除token并清除浏览器缓存中的token
    logout (state) {
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.commit.Authorization
    }
  },
  actions: {
    fetchColumns (context) {
      return asyncAndCOmmit('/columns', 'fetchColumns', context.commit)
    },
    fetchColumn ({ commit }, cid) {
      return asyncAndCOmmit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      return asyncAndCOmmit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchPost ({ commit }, cid) {
      return asyncAndCOmmit(`/posts/${cid}`, 'fetchPost', commit)
    },
    // 更新文章单个页面数据
    updatePost ({ commit }, { id, payload }) {
      console.log(id, payload)
      return asyncAndCOmmit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    fetchCurrentUser ({ commit }) {
      return asyncAndCOmmit('/user/current', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return asyncAndCOmmit('/user/login', 'login', commit, { method: 'post', data: payload })
    },
    // 新建文章页面数据
    createPost ({ commit }, payload) {
      return asyncAndCOmmit('/posts', 'createPost', commit, { method: 'post', data: payload })
    },
    deletePost ({ commit }, id) {
      return asyncAndCOmmit(`/posts/${id}`, 'deletePost', commit, { method: 'delete' })
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    // 通过id获取columns数据
    getColumnById: (state) => (id: string) => {
      console.log(id)
      console.log(state.columns)
      return state.columns.find(e => e._id === id)
    },
    // 通过columns的id获取所有posts的数据列表
    getPortById: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    },
    // 通过id获取posts数据
    getPostById: (state) => (cid: string) => {
      console.log(state.posts)
      const id = state.posts.find(e => e._id === cid)
      console.log(id)
      return id
    }
  }
})
export default store
