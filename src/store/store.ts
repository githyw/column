import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from '@/hooks/helper'
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
interface ListProps<P> {
  [id: string]: P;
}
// 定义vuex数据接口的类型
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  Loading: boolean;
  columns: { data: ListProps<ColumnlProps>; currentPage: number; total: number };
  posts: { data: ListProps<PostProps>; loadedColumns: string[] };
  user: UserProps;
}
// 封装一个请求函数,通过method控制获取的是post请求还是get请求默认get请求
const asyncAndCOmmit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }

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
    columns: { data: {}, currentPage: 0, total: 0 },
    // 每个单独页面的数据
    posts: { data: {}, loadedColumns: [] },
    // 控制登录按钮
    user: { isLogin: false }
  },
  mutations: {
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
      console.log(newPost.data)
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
      // state.columns.data = arrToObj(rawData.data.list)
      // state.columns.isLoaded = true
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list) }
      state.posts.loadedColumns.push(columnId)
    },
    fetchPost (state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
    },
    updatePost (state, { data }) {
      console.log(data)
      state.posts.data[data._id] = data
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
    fetchColumns ({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        return asyncAndCOmmit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCOmmit(`/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    fetchPosts ({ state, commit }, cid) {
      if (!state.posts.loadedColumns.includes(cid)) {
        return asyncAndCOmmit(`/columns/${cid}/posts`, 'fetchPosts', commit, { method: 'get' }, cid)
      }
    },
    fetchPost ({ state, commit }, cid) {
      const currentPost = state.posts.data[cid]
      if (!currentPost || !currentPost.content) {
        return asyncAndCOmmit(`/posts/${cid}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
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
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    // 通过id获取columns数据
    getColumnById: (state) => (id: string) => {
      console.log(id)
      console.log(state.columns.data)
      return state.columns.data[id]
    },
    // 通过columns的id获取所有posts的数据列表
    getPortById: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    // 通过id获取posts数据
    getPostById: (state) => (cid: string) => {
      console.log(state.posts)
      return state.posts.data[cid]
    }
  }
})
export default store
