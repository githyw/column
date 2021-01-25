import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from '@/hooks/helper'
import createMessage from '@/hooks/createMessage'
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
// columns接口定义
export interface GlobalColumnsProps {
  data: ListProps<ColumnlProps>;
  currentPage: number;
  total: number;
}
// posts接口定义
export interface GlobalPostsProps {
  data: ListProps<PostProps>;
  loadedColumns: ListProps<{total?: number; currentPage?: number}>;
  islastPage: boolean;
}
// 定义vuex数据接口的类型
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  Loading: boolean;
  columns: GlobalColumnsProps;
  posts: GlobalPostsProps;
  user: UserProps;
}
// 封装储存或取出浏览器数据的函数
const sessSetAndGet = (key: string, value?: any) => {
  if (!value) {
    return JSON.parse(sessionStorage.getItem(key) as string)
  } else {
    return sessionStorage.setItem(key, JSON.stringify(value))
  }
}
// 将author的对象数据转为纯id的字符串
const authorToId = (state: any, data: any) => {
  if (data && data.author._id) {
    const { _id } = data.author
    data.author = _id
    state.posts.data[data._id] = data
    sessSetAndGet('fetchPost', state.posts.data)
  } else {
    state.posts.data[data._id] = data
    sessSetAndGet('fetchPost', state.posts.data)
  }
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
    posts: { data: {}, loadedColumns: {}, islastPage: true },
    // 控制登录按钮
    user: { isLogin: false }
  },
  mutations: {
    // 新建文章提交的数据
    createPost (state, { data }) {
      if (data.author && data.author.avatar) {
        const { _id } = data.author
        data.author = _id
        state.posts.data[data._id] = data
        sessSetAndGet('fetchPosts', state.posts.data)
        sessSetAndGet('fetchPost', state.posts.data)
      } else {
        state.posts.data[data._id] = data
        sessSetAndGet('fetchPosts', state.posts.data)
        sessSetAndGet('fetchPost', state.posts.data)
      }
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      if (list.length === 0) {
        state.posts.islastPage = false
        createMessage('已经全部加载完毕', 'success', 2000)
      } else {
        state.columns = {
          data: { ...data, ...arrToObj(list) },
          total: count,
          currentPage: currentPage * 1
        }
        state.posts.islastPage = true
        if (state.columns) {
          sessSetAndGet('fetchColumns', state.columns.data)
        }
      }
    },
    fetchColumn (state, { data }) {
      state.columns.data[data._id] = data
    },
    fetchPosts (state, { data: rawData, extraData }) {
      const { count, currentPage, list } = rawData.data
      const { loadedColumns, data } = state.posts
      if (list.length === 0) {
        state.posts.islastPage = false
        createMessage('已经全部加载完毕', 'success', 2000)
      } else {
        state.posts.data = { ...data, ...arrToObj(list) }
        state.posts.islastPage = true
        if (state.posts.data) {
          sessSetAndGet('fetchPosts', state.posts.data)
          sessSetAndGet('fetchPost', state.posts.data)
        }
      }
      loadedColumns[extraData] = {
        total: count,
        currentPage
      }
    },
    fetchPost (state, { data }) {
      authorToId(state, data)
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
    },
    updatePost (state, { data }) {
      authorToId(state, data)
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
    updateColumn (state, { data }) {
      state.columns.data[data._id] = data
    },
    updateUser (state, { data }) {
      state.user = { isLogin: true, ...data }
    },
    // 退出登陆时清除token并清除浏览器缓存中的token
    logout (state) {
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.commit.Authorization
    }
  },
  // 通过异步获取数据，然后将数据发送到mutations进行数据处理
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
    fetchPosts ({ state, commit }, params = {}) {
      const { loadedColumns } = state.posts
      const { cid, currentPage = 1, pageSize = 6 } = params
      const loadedCurrentPage = (loadedColumns[cid] && loadedColumns[cid].currentPage) || 0
      if (!Object.keys(loadedColumns).includes(cid) || loadedCurrentPage < currentPage) {
        return asyncAndCOmmit(`/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'get' }, cid)
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
      return asyncAndCOmmit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    // 更改编辑页面的columns数据
    updateColumn ({ commit }, { id, payload }) {
      return asyncAndCOmmit(`/columns/${id}`, 'updateColumn', commit, { method: 'patch', data: payload })
    },
    // 更改编辑页面的user数据
    updateUser ({ commit }, { id, payload }) {
      return asyncAndCOmmit(`/user/${id}`, 'updateUser', commit, { method: 'patch', data: payload })
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
    // 删除文章请求
    deletePost ({ commit }, id) {
      return asyncAndCOmmit(`/posts/${id}`, 'deletePost', commit, { method: 'delete' })
    },
    // login的token值验证成功之后再获取当前登录用户的信息
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    // 将columns.data的对象格式转化为数组格式
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    // 通过id获取columns数据
    getColumnById: (state) => (id: string) => {
      state.columns.data = sessSetAndGet('fetchColumns')
      return state.columns.data[id]
    },
    // 通过columns的id获取所有posts的数据列表
    getPortById: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid).sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      })
    },
    // 通过id获取posts数据
    getPostById: (state) => (cid: string) => {
      state.posts.data = sessSetAndGet('fetchPosts')
      return state.posts.data[cid]
    },
    getPost: (state) => (cid: string) => {
      state.posts.data = sessSetAndGet('fetchPost')
      return state.posts.data[cid]
    }
  }
})
export default store
