import { ColumnlProps, PostProps } from '../store/store'
// 每个单独的页面传入的数据,传入vuex中统一管理
export const testProsts: PostProps[] = [
  {
    id: 1,
    title: '这是我的第一篇文章',
    content: 'This is my first article',
    image: 'https://images.freeimages.com/images/premium/previews/2243/22438052-happy-snowman-with-scarf-and-hat.jpg',
    createdAt: '2020-06-11  20:31',
    columnId: 1
  }
]

// 使用接口规则，然后放在vuex中统一管理
export const testData: ColumnlProps[] = [
  {
    _id: 'sda',
    title: 'test1的专栏',
    description: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    key: 1
  }
]
