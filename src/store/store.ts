import { createStore } from 'vuex'
import { testProsts, testData, ColumnlProps, PostProps } from '@/hooks/ColumnlProps'
interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}
export interface GlobalDataProps {
  columns: ColumnlProps[];
  ports: PostProps[];
  user: UserProps;
}
const store = createStore<GlobalDataProps>({
  state: {
    // 首页数据信息展示
    columns: testData,
    // 每个单独页面的数据
    ports: testProsts,
    // 控制登录按钮
    user: { isLogin: false }
  },
  mutations: {
    login (state) {
      state.user = { ...state.user, isLogin: true, name: '郝莹旺' }
    }
  }
})
export default store
