import { onUnmounted } from 'vue'
// 创建DOM节点
function useDOMCreate (nodeId: string) {
  const node = document.createElement('div')
  node.id = nodeId
  document.body.appendChild(node)
  // 移除DOM节点
  onUnmounted(() => {
    document.body.removeChild(node)
  })
}
export default useDOMCreate
