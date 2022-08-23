import { defineUserConfig } from "vuepress"
import registerComponentsPlugin from '@vuepress/plugin-register-components'
import theme from "./theme"
import path from 'path'

export default defineUserConfig({
  lang: "zh-CN",
  title: "冬天吃雪糕的博客",
  description: "",

  base: "/wingsnow-blog/",

  theme,

  plugins: [
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
  ],
});
