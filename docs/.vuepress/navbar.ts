import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "代码笔记",
    icon: "code",
    prefix: "/code/",
    children: [
      {
        text: "Vue笔记",
        icon: "vue",
        link: "vue/",
      },
      {
        text: "JavaScript笔记",
        icon: "javascript",
        link: "javascript/",
      },
      {
        text: "后端运维",
        children: [
          {
            text: "Ubuntu笔记",
            icon: "ubuntu",
            link: "ubuntu/",
          }
        ]
      },
      {
        text: "代码小记",
        link: "note",
      },
    ],
  },
  {
    text: "项目",
    icon: "module",
    prefix: "/projects/",
    children: [
      {
        text: "Vue组件",
        icon: "vue",
        link: "vueComponents/",
      },
    ],
  },
  {
    text: "产品设计",
    icon: "palette",
    link: "/design/",
  },
]);
