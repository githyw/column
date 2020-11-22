// 给登录按钮定义接口规则
export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}
// 根据登录接口规则进行设置
const currentUser: UserProps = {
  isLogin: false,
  name: '郝莹旺'
}
// 导出到App.vue中进行return  通过GlobalHeader.vue组件中Porps的 :user 返回数据
export default currentUser
