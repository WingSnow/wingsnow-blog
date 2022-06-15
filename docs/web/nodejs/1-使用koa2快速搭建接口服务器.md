# 使用 koa2 快速搭建接口服务器

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

### 创建项目

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
    ├───error.pug
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
`koa-generator`的最新版本为 1.1.7 ，最后一次更新日期为3年前，因此很多包的依赖版本都已经过时了。

建议使用`koa-generator`学习各个中间件的功能以及基本用法，在自己的项目中按需裁剪。
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
如果是使用`pnpm start`命令运行项目的，修改后需要重新运行程序才会生效；`koa-generator`也集成了`nodemon`实现热更新，对应的启动项目命令为`pnpm dev`。

顺带一提，自动生成的`dev`脚本为`./node_modules/.bin/nodemon bin/www`。实际上由于在执行 npm script 时`./node_modules/.bin/`会自动添加到环境的 PATH 变量，所以可以简写成`nodemon bin/www`。

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

### 创建项目

```shell
mkdir koa-init
cd koa-init
pnpm init
```

### 安装依赖

```shell
pnpm i koa
pnpm i -D @types/koa
#  koa 版本为 2.13.4；@types/koa 是 koa 的 typescript 类型声明

pnpm i -D typescript @types/node ts-node
# 安装 ts-node 套件，用来运行后续的 ts 代码
```

为了充分展示 Koa 的各个中间件的功能，除了核心组件外，其他中间件在过程中再安装。

### 从 Hello World 开始

只依赖 Koa，已经足够搭建最简单的服务器应用程序。以官网上的 hello world 代码为例：

```typescript
// ./app.ts
import Koa from 'koa'

const app = new Koa()

app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(3000)
```

在`package.json`的`script`中添加以下脚本，然后运行它

```json{4}
{
  //...
  "scripts": {
    "serve": "ts-node ./app.ts"
  },
}
```

使用浏览器访问`http://localhost:3000/`，可以看到输出`Hello World`字符串。

### 路由

现在，访问`http://localhost:3000/`的任意子路由，例如`/users`、`/users/bar`，输出结果都是`Hello World`。因为在`app.ts`的代码中，始终设置`ctx.body`为`Hello World`。

如果要实现不同的路由返回不同的字符串，不依赖其他中间件的情况下，可以这么写：

```typescript{6-14}
// ./app.ts
import Koa from 'koa'

const app = new Koa()

app.use(async ctx => {
  if (ctx.request.url === '/') {
    ctx.body = 'Hello World'
  } else if (ctx.request.url === '/users') {
    ctx.body = 'this is a users response'
  } else if (ctx.request.url === '/users/bar') {
    ctx.body = 'this is a users/bar response'
  }
})

app.listen(3000)
```

重新运行`serve`脚本，然后分别访问`http://localhost:3000/`、`http://localhost:3000/users`、`http://localhost:3000/users/bar`以及其他路由（例如`http://localhost:3000/string`），会看到现在应用程序已经会根据不同的路由返回不同的结果了。

当然，为了避免重复造轮子，“不依赖其他中间件”的想法不可取。为了解决路由的问题，可以引入中间件[@koa/router](https://github.com/koajs/router)

```shell
pnpm i @koa/router
pnpm i -D @types/koa__router
```

然后上面的代码就可以改成这样：

```typescript
// ./app.ts
import Koa from 'koa'
import Router from '@koa/router' 

const app = new Koa()

const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello World'
  await next()
})

const usersRouter = new Router()

usersRouter.prefix('/users')

usersRouter.get('/', async (ctx, next) => {
  ctx.body = 'this is a users response'
  await next()
})

usersRouter.get('/bar', async (ctx, next) => {
  ctx.body = 'this is a users/bar response'
  await next()
})

app.use(router.routes())
app.use(router.allowedMethods())

app.use(usersRouter.routes())
app.use(usersRouter.allowedMethods())

app.listen(3000)
```

::: tip
关于`router.allowedMethods()`这个中间件，在加了`router.allowedMethods()`中间件情况下，如果接口是 get 请求，而前端使用 post 请求，会返回`405 Method Not Allowed`，提示方法不被允许，并在响应头有添加允许的请求方式；而如果不加这个中间件，则会返回`404 Not Found`找不到请求地址，并且响应头没有添加允许的请求方式 。
:::

为了方便中间件的设置进行后续扩展，避免主文件越来越长，一般会把路由的设置部分放在其他文件，然后在主文件中引用。

:::details 代码如下

```typescript
// ./app.ts
import Koa from 'koa'
import router from './routes' 
import usersRouter from './routes/users'

const app = new Koa()

app.use(router.routes())
app.use(router.allowedMethods())

app.use(usersRouter.routes())
app.use(router.allowedMethods())

app.listen(3000)
```

```typescript
// ./routes/index.ts
import Router from '@koa/router' 

const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello World'
  await next()
})

export default router
```

```typescript
// ./routes/users.ts
import Router from '@koa/router' 

const router = new Router()

router.prefix('/users')

router.get('/', async (ctx, next) => {
  ctx.body = 'this is a users response'
  await next()
})

router.get('/bar', async (ctx, next) => {
  ctx.body = 'this is a users/bar response'
  await next()
})

export default router
```

:::

### 渲染模板

如果服务器只需要返回数据，那么`ctx.body`直接设置返回内容基本就够用了，但是如果要返回 html 页面，需要怎么处理呢？先看看“不依赖其他中间件”的情况，可以这么写：

```typescript{7-9}
// ./routes/index.ts
import Router from '@koa/router' 

const router = new Router()

router.get('/', async (ctx, next) => {
  const title = 'Koa'
  const slogan = 'Koa (koajs) -- 基于 Node.js 平台的下一代 web 开发框架'
  ctx.body = `<h1>${ title }</h1><h2>${ slogan }</h2>`
  await next()
})

export default router
```

::: tip
Koa 会根据响应内容自动设置`Content-Type`为`text/html`或`text/plain`。在以上例子中，响应头的`Content-Type`会被设置为`text/html`（而在先前返回纯文本的例子中，该项为`text/plain`），使浏览器可以正确地以 html 的形式加载数据。

也可以使用`ctx.string`，`ctx.set`，`ctx.type`等方法显式设置响应头。
:::

当需要返回复杂的 html 页面时，以上方法显然不可行。这时候就需要使用[koa-views](https://github.com/queckezz/koa-views)中间件。使用`koa-views`需要选择一个模板引擎，这里选择`ejs`。

```shell
pnpm i koa-views ejs
```

首先编写模板`.ejs`，为了方便统一管理，把模板放在 views 文件夹下。

```html
<!-- ./views/index.ejs -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><%=title%></title>
</head>
<style>
body {
  margin: 0
}

#heading {
  position: absolute;
  top: 50%;
  margin-top: -5rem;
  width: 100%;
  text-align: center;
}

#title{
  font-size: 5rem;
}

#slogan{
  font-size: 1rem;
}
</style>
<body>
<div id="heading">
  <div id="title"><%=title%></div>
  <div id="slogan"><%=slogan%></div>
</div>
</body>
</html>
```

然后修改`./app.ts`和`./routes/index.ts`

```typescript{5,9-12}
// ./app.ts
import Koa from 'koa'
import router from './routes' 
import usersRouter from './routes/users'
import views from 'koa-views'

const app = new Koa()

// 必须在路由之前引入
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

app.use(router.routes())
app.use(router.allowedMethods())

app.use(usersRouter.routes())
app.use(router.allowedMethods())

app.listen(3000)
```

```typescript{7-11}
// ./routes/index.ts
import Router from '@koa/router' 

const router = new Router()

router.get('/', async (ctx, next) => {
  // 注意要await，不能直接返回
  await ctx.render('index', {
    title: 'Koa',
    slogan: 'Koa (koajs) -- 基于 Node.js 平台的下一代 web 开发框架'
  })
  await next()
})

export default router
```

重新运行`serve`脚本，访问`http://localhost:3000/`查看效果。

### 静态文件

在上面的例子中，模板`index.ejs`中包含了一段样式表。当需要设置的样式很复杂时，通常会将样式表分离到单独的`.css`文件中管理。

例如新建一个`./public/stylesheets/style.css`文件，然后将`index.ejs`的样式表放入该文件中，并修改`index.ejs`以引入该外部样式表。

例如：

```html
<!-- ./views/index.ejs -->
<!-- ...-->
<link rel="stylesheet" type="text/css" href="../public/stylesheets/style.css">
<!-- ...-->
```

此时会发现无法正常加载样式文件（404 Not Found），可以尝试修改文件路径，但结果一样。

如果需要返回`.css`（以及`.html`、`.js`、`.jpg`、`.css`）这一类静态资源，通常需要引入[koa-static](https://github.com/koajs/static)中间件。（原生 koa 也可以处理，但是比较麻烦）

```shell
pnpm i koa-static
pnpm i -D @types/koa-static
```

然后修改`app.ts`引入中间件并设置

```typescript{6,15}
// ./app.ts
import Koa from 'koa'
import router from './routes' 
import usersRouter from './routes/users'
import views from 'koa-views'
import serve from 'koa-static'

const app = new Koa()

// 必须在路由之前引入
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

app.use(serve(__dirname+'/public'))

app.use(router.routes())
app.use(router.allowedMethods())

app.use(usersRouter.routes())
app.use(router.allowedMethods())

app.listen(3000)
```

因为在`koa-static`的设置中已经指定了目录为`public`，在`index.ejs`中就不用需要用`../public/`去查找资源了。

```html
<!-- ./views/index.ejs -->
<!-- ...-->
<link rel="stylesheet" type="text/css" href="stylesheets/style.css">
<!-- ...-->
```

现在样式文件可以正常加载了。同样如果`public`目录下有其他静态资源，也可以直接通过`http://localhost:3000/+文件路径`获取。

例如有一张图片`public/images/logo.png`，那么就可以通过`http://localhost:3000/images/logo.png`获取。

### 处理请求

在上面的例子中，所有的路由都是 GET 方法的，接下来看看怎么响应 POST 请求。

例如要实现一个登录接口`/token`，使用json格式请求和响应。

```text
// Request
method: POST
body: 
{
  "username": "admin",
  "password": "admin"
}
// Response
{
  "token": "2350e1c4-09f4-4f61-923c-7039b68c15ff"
}
```

如果不借助中间件要获取请求的 body ，需要监听 request 对象的`data`事件及`end`事件，然后将接收到的数据进行解析，比较麻烦。因此一般都要借助中间件。

::: details 手动监听并解析 body 数据的示例

```typescript
router.post('/token', async (ctx, next) => {
  let str = ''
  const { username, password } = await new Promise((resolve) => {
    ctx.req.addListener('data', (data) => {
      str += data
    })
    ctx.req.addListener('end', () => {
      const res = JSON.parse(str)
      resolve(res)
    })
  })
  if (username === 'admin' && password === 'admin') {
    ctx.body = {
      token: '2350e1c4-09f4-4f61-923c-7039b68c15ff'
    }
  } else {
    ctx.body = 'Incorrect username or password'
  }
})
```

:::

针对json格式的请求，可选的中间件通常有`koa-bodyparser`和`koa-body`，这里选择[koa-bodyparser](https://github.com/koajs/bodyparser)

::: tip

`koa-bodyparser`可以处理`json/form/text/xml`类型的请求；当需要处理`multipart/form-data`类型的表单数据时（例如上传文件），则需要使用[@koa/multer](https://github.com/koajs/multer)。

[koa-body](https://github.com/dlau/koa-body)可以代替以上两者（支持的类型更丰富），但`koa-bodyparser`和`@koa/multer`目前都是由 koa 官方维护的，并且使用的范围更广。
:::

```shell
pnpm i koa-bodyparser
pnpm i -D @types/koa-bodyparser
```

分别修改`app.ts`和`routes/index.ts`，

```typescript{7,16-17}
// ./app.ts
import Koa from 'koa'
import router from './routes' 
import usersRouter from './routes/users'
import views from 'koa-views'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'

const app = new Koa()

// 必须在路由之前引入
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// 必须在路由之前引入
app.use(bodyParser())

app.use(serve(__dirname+'/public'))

app.use(router.routes())
app.use(router.allowedMethods())

app.use(usersRouter.routes())
app.use(router.allowedMethods())

app.listen(3000)
```

```typescript{15-24}
// ./routes/index.ts
import Router from '@koa/router' 

const router = new Router()

router.get('/', async (ctx, next) => {
  // 注意要await ctx.render()，不能直接返回
  await ctx.render('index', {
    title: 'Koa',
    slogan: 'Koa (koajs) -- 基于 Node.js 平台的下一代 web 开发框架'
  })
  await next()
})

router.post('/token', async (ctx, next) => {
  const { username, password } = ctx.request.body
  if (username === 'admin' && password === 'admin') {
    ctx.body = {
      token: '2350e1c4-09f4-4f61-923c-7039b68c15ff'
    }
  } else {
    ctx.body = 'Incorrect username or password'
  }
})

export default router
```

引入`koa-bodyparser`后，可以通过`ctx.request.body`获取解析的请求 body 。

### 热更新

到目前为止，每次更新代码后都需要手动重启 serve 服务，修改后的代码才会生效。可以使用[nodemon](https://github.com/remy/nodemon)实现热更新。

只需要安装`nodemon`后在`package.json`中添加一个以`nodemon`启动的 script。

```shell
pnpm i -D nodemon
# 也可以全局安装nodemon `pnpm i -g nodemon`
```

```json
{
  //...
  "scripts": {
    "serve": "ts-node ./app.ts",
    "watch": "nodemon --exec ts-node ./app.ts"
  },
}
```

运行`watch`脚本，也可以启动服务器，并且每当项目内的任何文件更新时，服务都会自动重启。

如果只想监听某些类型文件的更新（例如`.ts`）或者某个目录下文件的更新（例如`/routes`），可以这么修改命令

```json
# 只监听`.ts`文件的更新
"watch-ts": "nodemon -e ts --exec ts-node ./app.ts"
# 只监听`/routes`目录的更新
"watch-routes": "nodemon --watch ./routes --exec ts-node ./app.ts"
```

::: warning
单纯使用nodemon可以实现接口服务器部分的热更新（每次更新代码后会自动重启服务，重新调用接口可以获得新的数据）；但是浏览器不会自动刷新。

网上搜索到说可以使用`gulp-nodemon`+`browsersync`实现服务器自动重启+浏览器自动刷新。但试验之后**不能**正常使用。（可能是因为 typescript 代码只能使用ts-node运行，存在冲突）

由于笔者的服务器应用一般只用来提供数据接口，前端应用会另外搭建（使用`vite`），因此上述问题暂时不研究了。
:::
