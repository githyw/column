// 每个单独的页面定义的接口
export interface PostProps {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  columnId: number;
}
// 每个单独的页面传入的数据
export const testProsts: PostProps[] = [
  {
    id: 1,
    title: '这是我的第一篇文章',
    content: 'This is my first article',
    image: 'https://images.freeimages.com/images/premium/previews/2243/22438052-happy-snowman-with-scarf-and-hat.jpg',
    createdAt: '2020-06-11  20:31',
    columnId: 1
  },
  {
    id: 2,
    title: '这是我的第一篇文章',
    content: 'This is my first article',
    image: 'https://images.freeimages.com/images/premium/previews/2243/22438052-happy-snowman-with-scarf-and-hat.jpg',
    createdAt: '2020-06-11  20:31',
    columnId: 2
  },
  {
    id: 2,
    title: '这是我的第一篇文章',
    content: 'This is my first article',
    createdAt: '2020-06-11  20:31',
    columnId: 2
  },
  {
    id: 2,
    title: '这是我的第一篇文章',
    content: 'This is my first article',
    image: 'https://images.freeimages.com/images/premium/previews/2243/22438052-happy-snowman-with-scarf-and-hat.jpg',
    createdAt: '2020-06-11  20:31',
    columnId: 2
  }
]
// 定义的接口数据
export interface ColumnlProps {
  id: number;
  title: string;
  avatar?: string;
  description: string;
}
// 使用接口规则，然后在Home.vue中return 返回到list中 然后将list传入CoulmnList.vue 组件中
export const testData: ColumnlProps[] = [
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是的test2专栏，有一段非常有意思的简介，可以更新一下欧,这是的test2专栏，有一段非常有意思的简介，可以更新一下欧,这是的test2专栏，有一段非常有意思的简介，可以更新一下欧这是的test2专栏，有一段非常有意思的简介，可以更新一下欧这是的test2专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 3,
    title: 'test3的专栏',
    description: '这是的tes3专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 4,
    title: 'test4的专栏',
    description: '这是的tes3专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 5,
    title: 'test5的专栏',
    description: '这是的tes3专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 6,
    title: 'test6的专栏',
    description: '这是的tes3专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  }
]
