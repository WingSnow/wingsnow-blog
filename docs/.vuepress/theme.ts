import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";

export default hopeTheme({
  hostname: "https://wingsnow.github.io/wingsnow-blog/",

  author: {
    name: "冬天吃雪糕",
    url: "http://www.wingsnow.cn",
  },

  iconAssets: "iconfont",

  logo: "/logo.png",

  // navbar
  navbar: navbar,

  // sidebar
  sidebar: sidebar,

  displayFooter: true,

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  blog: {
    avatar: "/avatar.png",
    description: "一个兴趣使然的程序猿",
    medias: {
      
      Home: [
        "http://www.wingsnow.cn",
        '<svg width="26" height="26" xmlns="http://www.w3.org/2000/svg" version="1.1"><path stroke="null" id="svg_1" d="m22.12763,3.9344c-2.34297,-2.44428 -5.58512,-3.76141 -8.95393,-3.71075c-3.3688,-0.05066 -6.5983,1.26647 -8.94126,3.71075c-2.45695,2.34297 -3.77407,5.58512 -3.72342,8.95393c-0.05066,3.3688 1.26647,6.5983 3.71075,8.94126c2.34297,2.45695 5.58512,3.77407 8.95393,3.72342c3.3688,0.05066 6.5983,-1.26647 8.94126,-3.71075c2.45695,-2.34297 3.77407,-5.58512 3.72342,-8.95393c0.05066,-3.3688 -1.26647,-6.61096 -3.71075,-8.95393m-2.62159,8.95393l0,7.59881l-4.43264,0l0,-6.33234l-3.7994,0l0,6.33234l-4.43264,0l0,-7.59881l-2.53294,0l8.86527,-8.86527l9.49851,8.86527l-3.16617,0z"/></svg>',
      ],
      GitHub: "https://github.com/WingSnow",
      Email: "py_wing@qq.com",
    },
  },

  plugins: {
    blog: {
    },

    mdEnhance: {
      codetabs: true,
    }
  },
});
