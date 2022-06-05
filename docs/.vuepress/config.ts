import { defineUserConfig, defaultTheme } from 'vuepress'
import { genSideBar, getNavbar } from './utils/vue-press-sidebar-auto'

export default defineUserConfig({
  lang: 'zh-CN',
  title: '冬天吃雪糕的博客',
  head: [['link', { rel: 'icon', href: '/favicon.ico'}]],
  description: '冬天吃雪糕的博客',

  theme: defaultTheme({
    logo: 'logo.png',
    contributors: false,
    lastUpdatedText: '上次更新',
    navbar: [
      getNavbar('Vue系列', '/vue'),
      getNavbar('Ubuntu系列', '/ubuntu'),
      {
        text: '我的主页',
        link: 'https://www.baidu.com/',
      },
      {
        text: 'Github',
        link: 'https://github.com/WingSnow',
      },
    ],
    sidebar: {
      '/vue': [genSideBar('Vue系列', false, '/vue')],
      '/ubuntu': [
        // genSideBar('VuePress参考', true, '/reference', [ 'bundler' ]),
        // genSideBar('打包工具参考', true, '/reference/bundler'),
		genSideBar('Ubuntu系列', true, '/ubuntu'),
      ],
    }
  })

})