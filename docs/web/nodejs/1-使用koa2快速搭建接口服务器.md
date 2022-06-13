# ⚙使用 koa2 快速搭建接口服务器

## 使用 koa-generator

koa2提供了一个生成器`koa-generator`，用于生成一个项目脚手架，方便开箱即用。

- 约定目录结构
- 集成一些基础的、必要的中间件
- app.js作为入口文件
- bin/www作为启动入口
- 支持静态服务器
- 支持routes路由目录
- 支持views视图目录，默认pug作为模板引擎

### 安装 koa-generator

```shell
pnpm i -g koa-generator
```

### 创建并安装项目

koa-generator 支持 Koa1.x 和 2.x，分别使用`koa`和`koa2`创建。

```shell
koa2 koa-init
cd koa-init
pnpm i
```

koa-generator 会自动生成如下目录结构

```shell
├───app.js
├───package.json
├───bin
│   └───www
├───public
│   ├───images
│   ├───javascripts
│   └───stylesheets
│       └───style.css
├───routes
│   ├───index.js
│   └───users.js
└───views
    ├─── error.pug
    ├───index.pug
    └───layout.pug
```

其中的 package.json 内容及解释如下：

```json
{
  "name": "koa-init",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "node bin/www", // 代码变动需要重启node进程
    "dev": "./node_modules/.bin/nodemon bin/www", // 代码变动，通过nodemon自动重启node进程
    "prd": "pm2 start bin/www",// 生产环境 pm2启动
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "debug": "^4.1.1", // 根据Debug环境变量输出调试日志
    "koa": "^2.7.0", 
    "koa-bodyparser": "^4.2.1",// 解析body，主要针对post请求
    "koa-convert": "^1.2.0", // 兼容Koa2中间件写法
    "koa-json": "^2.0.2", // 对json更好对的支持
    "koa-logger": "^3.2.0", // 开发阶段的日志模块
    "koa-onerror": "^4.1.0", // 错误处理模块
    "koa-router": "^7.4.0", // 路由
    "koa-static": "^5.0.0", // HTTP静态服务器
    "koa-views": "^6.2.0", // 视图渲染
    "pug": "^2.0.3" // 模板引擎
  },
  "devDependencies": {
    "nodemon": "^1.19.1" // 自动重启node进程
  }
}
```

::: details 安装过程中的 deprecated 警告

koa-generator 的最新版本为1.1.7，最后一次更新日期为3年前，因此很多包的依赖版本都已经过时了（包括 koa2 的next版本已经为2.9.0，而koa-generator的依赖版本还是 ^2.7.0 。）

建议使用 koa-generator 学习各个中间件的功能以及基本用法，在自己的项目中按需裁剪。

:::

### 运行项目

```shell
pnpm start
```

分别使用浏览器或接口调用工具（例如 postman ）访问`localhost:3000`，`localhost:3000/string`，`localhost:3000/json`，`localhost:3000/users`，`localhost:3000/users/bar`，查看显示或返回结果。

如果要修改返回的内容，可以修改 routes 目录下的文件，例如在 routes/users.js 中增加一个延时3秒返回的接口。

```javascript {13:20}
// routes/users.js

const router = require('koa-router')()

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) => {
  ctx.body = 'this is a users/bar response'
})

router.get('/foo', async (ctx, next) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 3000)
  })
  ctx.body = 'this is a users/foo response delay 3000ms'
})

module.exports = router
```

::: tip

如果是使用`pnpm start`命令运行项目的，修改后需要重新运行程序才会生效； koa-generator 也集成了 nodemon 实现热更新，对应的启动项目命令为`pnpm dev`。

顺带一提，自动生成的 dev 脚本为`./node_modules/.bin/nodemon bin/www`。实际上由于在执行script是`./node_modules/.bin/`会自动添加到环境的 PATH 变量，所以可以简写成`nodemon bin/www`。

```json {5}
{
  ...
  "scripts": {
    "start": "node bin/www",
    "dev": "nodemon bin/www",
    "prd": "pm2 start bin/www",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  ...
}
```

:::

## 手工搭建

前文提到，使用 koa-generator 虽然方便，但毕竟已经3年没有更新了，许多技术栈可能已经过时，并且也包含了一些不需要的中间件，还是有必要了解如何手工搭建koa服务器的。

