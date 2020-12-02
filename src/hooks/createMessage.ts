import { createApp } from 'vue'
import Message from '@/components/Message.vue'
export type MessageType = 'success' | 'error' | 'default'
const createMessage = (message: string, type: MessageType, timeout: number) => {
  const messageInstance = createApp(Message, {
    message,
    type
  })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  messageInstance.mount(mountNode)
  setTimeout(() => {
    messageInstance.unmount(mountNode)
    document.body.removeChild(mountNode)
  }, timeout)
}
export default createMessage
