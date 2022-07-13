# package.json 使用指南

::: tip 参考资料

[package.json | npm Docs (npmjs.com)](https://docs.npmjs.com/cli/v8/configuring-npm/package-json/)

[package.json 指南 (nodejs.cn)](http://nodejs.cn/learn/the-package-json-guide)

[package.json文件 -- JavaScript 标准参考教程（alpha） (ruanyifeng.com)](http://javascript.ruanyifeng.com/nodejs/packagejson.html#toc2)

[使用package.json (入门) - npm 中文开发手册 - 开发者手册 - 云+社区 - 腾讯云 (tencent.com)](https://cloud.tencent.com/developer/section/1490235)

[npm scripts 使用指南 - 阮一峰的网络日志 (ruanyifeng.com)](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)

[彻底掌握 Npm Script - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/351477578)
:::

## 概述

一个node项目的根目录下一般都有一个`package.json`文件。它记录了项目的配置信息（比如名称、版本、许可证等元数据），并定义项目所依赖的包以及包的版本，使构建可重现，因此更容易与其他开发人员共享。

以下是一个最简单的`package.json`，包含项目的两项元数据（它们也是`package.json`文件必须具备的两个字段）`name`和`version`。

```json
{
  "name" : "xxx",
  "version" : "0.0.0",
}
````

下面详细解释`package.json`文件的部分关键字段。

## 字段介绍

### name

包的名称。

- 少于214个字符，且不能包含空格，
- 只能包含小写字母、连字符（-）或下划线（_）

### version

包的当前版本。

- 格式为X.Y.Z（主版本号.次版本号.修订号）
- 遵循SemVer规范

### author

包的作者名称。

可以使用字符串形式

```json
{
  "author": "WingSnow"
}
````

也可以使用以下格式

```json
{
  "author": {
    "name": "WingSnow",
    "email": "py_wing@qq.com",
    "url": "http://www.wingsnow.cn"
  }
}
````

### private

如果设置为true，可以防止包被意外发布到npm上。

### homepage

包的项目主页。

### main

指定加载的入口文件。如果包名为`foo`，那么`require("foo")`就会返回这个文件的`export`。

默认值是模块根目录下面的`index.js`。

### files

指定包作为依赖项被安装时要包含的文件（或目录）。该选项的默认值为`[*]`，即包含所有文件。

也可以使用`.npmignore`来代替，它与`.gitignore`类似（但是`files`选项用于列举要包含的文件，而`.npmignore`相反，用于列举要排除的文件）。

### bin

指定各个内部命令对应的可执行文件的位置。

示例：

```json
{
  "bin": {
    "myapp": "./cli.js"
  }
}
```

以上代码表明`myapp`命令对应的可执行文件是`bin`子目录下的`cli.js`。当安装模块时，npm会寻找这个文件，并在`node_modules/.bin/`目录下建立符号链接。在上面的例子中，会建立指向`cli.js`的符号链接`node_modules/.bin/myapp`。

> 如果是全局安装则符号链接为`/usr/local/bin/myapp`

当我们使用`scripts`字段中的脚本时，`node_modules/.bin/`目录会临时加入系统的 PATH 变量，因此在运行 npm 时，可以不带路径直接调用这些脚本。

```json
"scripts": {"start": "./node_modules/.bin/myapp"}
// 可以简写成
"scripts": {"start": "myapp"}
````

### repository

指定包仓库所在的位置。当使用`npm docs`命令时，会在浏览器打开该地址。

示例

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/npm/cli.git"
  }
}
```

对于GitHub、GitHub gist、Bitbucket或者GitLab的仓库，可以使用以下简写

```json
"repository": "github:user/repo"
"repository": "gist:11081aaa281"
"repository": "bitbucket:user/repo"
"repository": "gitlab:user/repo"
```

### script

定义一组可以运行的node脚本。

示例：

```json
{
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "unit": "jest --config test/unit/jest.conf.js --coverage",
    "test": "npm run unit",
    "lint": "eslint --ext .js,.vue src test/unit",
    "build": "node build/build.js"
  }
}
```

可以通过调用`npm run XXXX`、`yarn XXXX`或`pnpm XXXX`来运行它们，其中XXXX是命令的名称。 例如：`npm run dev`。

`scripts`字段是`package.json`中最强大、最常用的字段之一，后文再进一步介绍如何使用。

### config

添加使用`script`脚本时的环境变量。

例如在`package.json`中有以下内容：

```json
{
  "name": "foo",
  "version": "1.2.5",
  "config": {
    "bar": "Hello World!"
  },
  "scripts": {
    "start" : "node index.js"
  }
}
````

在`index.js`脚本中可以引用`npm_package_config_bar`的环境变量。

```javascript
console.log(process.env.npm_package_config_bar)
```

这样在执行`npm run start`时，就可以得到`bar`的值。
但是在不使用`script`脚本时，该值为undefined。

> 实际上，在`script`脚本中可以通过环境变量获取`package.json`中的任意值。
> 例如`process.env.npm_package_name`返回`foo`,`process.env.npm_package_version`返回`1.2.5`。

```shell
npm run start
# 输出: Hello World!

node index.js
# 输出: undefined
```

### dependencies

设置项目依赖的包及其版本范围。当使用包管理器（如`npm`或`yarn`）安装软件包时默认会插入此列表。

版本范围描述遵循SemVer规范

::: details 常用版本范围

- **指定版本**：如`1.2.2`
- **\>版本**：大于指定版本，如`>1.2.2`；>=、<、<=同理。可以使用多个以指定版本区间，如`>1.2.3 <=1.3.2`
- **~版本**：大于等于指定版本，但不改变主版本号和次版本号。如`~1.2.3`，表示安装`1.2.x`的最新版本（不低于1.2.3），但是不安装`1.3.x`。
- **^版本**：大于等于指定版本，但不改变主版本号。如`^1.2.3`，表示安装`1.x.x`的最新版本（不低于1.2.3），但是不安装`2.x.x`。
- **1.2.x**：同`~1.2.0`
- **\***：任意版本，
- **版本区间**：如`1.2.3 - 1.3.2`，同`>=1.2.3 <=1.3.2`
- **latest**：安装最新版本

:::

使用`npm install`安装依赖项时，依赖项会以兼容版本的模式（即`^x.y.z`）写入到`dependencies`选项中。

### devDependencies

设置项目开发依赖的包及其版本范围。这些包只需要安装在开发环境上，而无需在生产环境中使用。如lint工具、测试工具、将其他语言编译为JavaScript的工具等。

当使用包管理器安装软件包时可以选择插入此列表，例如`npm install -D <packagename>`

对于项目根目录的`package.json`文件的`devDependencies`列表中的包，当使用`npm install`时会与`dependencies`列表的包一起安装。当作为其他项目的依赖项被安装，本项目的`devDependencies`不会被安装。

### peerDependencies

设置项目对等依赖的包及其版本范围。当依赖本项目安装时，也必须安装指定的对等依赖。

例如：

```json
{
  "name": "ant-design-vue",
  "version": "3.2.3",
  "peerDependencies": {
    "vue": ">=3.2.0"
  }
}
```

以上设置可以保障包`ant-design-vue`只有在宿主环境已经安装了指定版本的`vue`后才可以正确地安装。

安装后会得到如下的目录结构：

```bash
node_modules
├── ant-design-vue@3.2.3
└── vue@3.2.0
```

在不同的包管理器或者同一包管理器的不同版本中，对`peerDependencies`的处理不同，例如在`npm3 - 6`中，`peerDependencies`不会被自动安装，而会在安装结束后检查本次安装是否正确，如果不正确会给用户打印警告提示；而在`npm7`之后，`peerDependencies`会被自动安装。

### optionalDependencies

设置项目可选依赖的包及其版本范围。

与普通依赖（`dependencies`）一样，当本项目作为依赖项被安装时，可选依赖会被自动安装。但是即使可选依赖安装失败，也不会影响本项目的继续安装。

这意味着你要在代码中处理依赖缺失的情况，例如：

```javascript
try {
  var foo = require('foo')
  var fooVersion = require('foo/package.json').version
} catch (er) {
  foo = null
}
if ( notGoodFooVersion(fooVersion) ) {
  foo = null
}
// .. then later in your program ..
if (foo) {
  foo.doFooThings()
}
```

注意如果在`optionalDependencies`和`dependencies`中包含了对同一个包的不同版本的依赖，前者会覆盖后者。建议通常最好只放在一个地方。

### engines

设置本软件包的运行环境（如`node`、`npm`等）的版本。

版本范围描述同样遵循SemVer规范。

## 创建 pacakage.json

通常使用`npm init`命令创建`pacakage.json`。

npm会通过一系列问题引导创建具有基本信息的`pacakage.json`。

可以使用`npm init -y`创建默认的`pacakage.json`。

默认的`pacakage.json`如下：

:::details 默认package.json

```json
{
  "name": "my_package",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

其中部分信息会根据当前目录决定，

`name`：当前目录名

`description`：如果当前目录下有`README.md`，则取`README.md`的第一行非标题内容作为描述，否则为空
:::

可以为init配置默认选项，例如

```shell
npm set init.author.name "WingSnow"
npm set init.author.email "py_wing@qq.com"
npm set init.license "MIT"
```

## package-lock.json

由于在`package.json`的依赖项中通常只会指定版本范围，因此尝试使用`npm install`命令在另一台机器上复制项目时，如果依赖包已经发布了补丁版本，那么原始的项目和新初始化的项目实际上是不同的，可能会导致问题。

`package-lock.json`会固化当前安装的每个软件包的版本。

当不指定包的版本运行 `npm install`时，`npm`会检查是否存在`package-lock.json`文件，如有，则会使用这些确切的版本，而忽略`package.json`文件；如果没有，则会在安装后根据所安装的版本自动生成`package-lock.json`文件。

而当指定版本（或版本范围）运行`npm install`或 `npm update`时，则会根据指定版本（或版本范围）或`package.json`文件在设置的范围内更新到最新版本，然后更新`package-lock.json`文件。

当`npm`操作`node_modules`或者`package.json`文件时，`package-lock.json`文件被自动更新。

:::tip package-lock.json使用建议
开发系统应用时，建议把`package-lock.json`文件提交到代码版本仓库，从而保证所有团队开发者以及 CI 环节可以在执行`npm install`时安装的依赖版本都是一致的。

在开发一个 npm包 时，npm包是需要被其他仓库依赖的，如果锁定了依赖包版本，你的依赖包就不能和其他依赖包共享同一 semver 范围内的依赖包，这样会造成不必要的冗余。所以我们不应该把`package-lock.json`文件发布出去
:::


## npm script 使用指南

`npm script`是`package.json`中定义的一组内置脚本和自定义脚本。

```json
{
  // ...
  "scripts": {
    "build": "node build.js"
  }
}
```

在命令行中使用`npm run`执行以上脚本

```shell
npm run build
# 等价于
node build.js
```

可以使用不带任何参数的`npm run`命令查看当前项目的所有npm脚本。

### 原理

每当执行`npm run`时，会自动新建一个 shell，在这个 shell 里面执行指定的脚本命令。

::: tip
执行`npm run`时使用的 shell 程序可以使用`npm config set script-shell`设置。
:::

如[上文](#bin)所述，`npm run`新建的这个 shell 会将当前目录的`node_modules/.bin`子目录加入 PATH 变量，执行结束后，再将PATH变量恢复原样。

这意味着，当前目录的`node_modules/.bin`子目录里面的所有脚本，都可以直接用脚本名调用，而不必加上路径。

### 执行顺序

如果在同一个`npm script`中需要执行多个任务，需要明确它们的执行顺序。

要依次运行（只有前一个任务成功，才执行下一个任务）多个脚本，可以使用`&&`，例如：

```shell
npm run lint && npm run build
```

要并行运行多个脚本，可以使用`&`，例如：

```shell
npm run watch-js & npm run watch-css
```

::: warning
这仅适用于 Unix 环境。 在 Windows 中，它将按顺序运行，使用[concurrently](https://www.npmjs.com/package/concurrently)模块代替。
:::

### 默认值与简写

一般来说，`npm script`由用户提供。但是，npm 对两个脚本提供了默认值。以下两个脚本不需要定义，就可以直接使用。

```json
"start": "node server.js"，
"install": "node-gyp rebuild"
```

`npm run start`的默认值是`node server.js`，前提是项目根目录下有`server.js`这个脚本；`npm run install`的默认值是`node-gyp rebuild`，前提是项目根目录下有`binding.gyp`文件。

如果你在`package.json`定义了自己的`start`和（或）`install`脚本，则会覆盖默认值。

除了默认值以外，npm 还提供了一些常用脚本的简写形式

- `npm start`是`npm run start`的简写
- `npm stop`是`npm run stop`的简写
- `npm test`或`npm t`是`npm run test`的简写
- `npm restart`是`npm stop --if-present && npm start`的简写

> --if-present 表示即使脚本名不存在也不会报错

::: warning
除了 npm 之外，yarn 和 pnpm 的运行脚本命令中`run`本身就可以忽略。例如`pnpm run script1`可以简写成`pnpm script1`（内置的cli命令优先于脚本）。

但是对于`restart`的简写处理则不太一致。例如`pnpm restart`是`pnpm stop && pnpm restart && pnpm start`的简写
:::

### hook

`npm script`有`pre`和`post`两个钩子（hook）。例如`build`脚本命令的钩子就是`prebuild`和`postbuild`，它们会分别在执行`build`脚本的前后按顺序执行。

```json
"prebuild": "echo \"prebuild\"",
"build": "echo \"build\"",
"postbuild": "echo \"postbuild\"",
```

当执行`npm run build`时，等价于

```shell
npm run prebuild && npm run build && npm run postbuild
```

利用这两个钩子，可以完成一些准备工作和清理工作。

### 传参

向`npm script`传入参数，要使用`--`标明。

```json
"lint": "eslint **.js"
```

向上面的npm run lint命令传入参数，必须写成下面这样。

```shell
npm run lint --o output.txt
```

### 常用脚本

```json
// 清空目录
"clean": "rm -r dist/*"

//  热更新
// 使用nodemon监控src目录下类型为ts,tsx的文件，热更新启动app.ts
"watch": "nodemon --watch ./src -e ts,tsx --exec ts-node ./src/app.ts"
```
