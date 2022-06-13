import { defineUserConfig, defaultTheme } from 'vuepress'
import { genSideBar, getNavbar } from './utils/vue-press-sidebar-auto'
import registerComponentsPlugin from '@vuepress/plugin-register-components'
import path from 'path'

export default defineUserConfig({
  base: '/wingsnow-blog/',
  lang: 'zh-CN',
  title: '冬天吃雪糕的博客',
  head: [['link', { rel: 'icon', href: '/wingsnow-blog/favicon.ico'}]],
  description: '冬天吃雪糕的博客',
  markdown: {
    extractHeaders: {
      level: [2, 3, 4],
    }
  },

  plugins: [
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
  ],

  theme: defaultTheme({
    logo: 'logo.png',
    contributors: false,
    lastUpdatedText: '上次更新',
    tip: '提示',
    warning: '注意',
    danger: '警告',
    details: '详细信息',
    navbar: [
      getNavbar('前端', '/web'),
      getNavbar('Ubuntu系列', '/ubuntu'),
      getNavbar('通用', '/common'),
      {
        text: '我的主页',
        link: 'http://www.wingsnow.cn',
      },
      {
        text: 'Github',
        link: 'https://github.com/WingSnow',
      },
    ],
    sidebar: {
      '/web': [
        genSideBar('javascript系列', true, '/web/javascript'),
        genSideBar('nodejs系列', true, '/web/nodejs'),
        genSideBar('Vue系列', true, '/web/vue'),
      ],
      '/ubuntu': [
        // genSideBar('VuePress参考', true, '/reference', [ 'bundler' ]),
        // genSideBar('打包工具参考', true, '/reference/bundler'),
		    genSideBar('Ubuntu系列', true, '/ubuntu'),
      ],
    }
  })

})