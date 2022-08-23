---
order: 2
date: 2022-06-06
category:
  - 后端运维
tag:
  - Ubuntu
description: 本文介绍如何在 Ubuntu 操作系统中配置 node 环境。
---
# 配置node环境

## 安装nvm

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

安装完成后重启终端，输入`nvm -v`查看nvm版本，如果正常显示nvm的版本号，则说明安装成功。

> 这一操作需要从github拷贝nvm的库，如果无法访问github，需要提前解决网络问题。

## 切换nvm安装源

nvm安装node时默认使用国外的网站，下载速度较慢。安装源配置位于用户目录下的.nvm内的`nvm.sh`文件中。

```sh
nvm_get_mirror() {
  case "${1}-${2}" in
    node-std) nvm_echo "${NVM_NODEJS_ORG_MIRROR:-https://nodejs.org/dist}" ;;
    iojs-std) nvm_echo "${NVM_IOJS_ORG_MIRROR:-https://iojs.org/dist}" ;;
    *)
      nvm_err 'unknown type of node.js or io.js release'
      return 1
    ;;
  esac
}
```

可以看到安装源位于https://nodejs.org/dist

建议修改nvm安装源为国内源（npmmirror 中国镜像站，https://npmmirror.com/）

> 以前经常用的淘宝NPM网站已经改版为npmmirror 中国镜像站，后面的镜像源也更改为npmmirror 中国镜像站。

### 临时设置

在终端中输入如下命令

```bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
export NVM_IOJS_ORG_MIRROR=https://npmmirror.com/mirrors/iojs
```

此命令只在当前终端环境开启有效，关闭终端后失效。

### 永久设置

编辑用户目录下的`.bashrc`文件

```bash
gedit ~/.bashrc
```

在其中添加如下命令，

```bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
export NVM_IOJS_ORG_MIRROR=https://npmmirror.com/mirrors/iojs
```

注意命令添加的位置位于`exportNVM DIR="HOME/.nvm" `之下，

```bash
export NVM_DIR="$HOME/.nvm"
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
export NVM_IOJS_ORG_MIRROR=https://npmmirror.com/mirrors/iojs
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

保存退出，使用命令source ~/.bashrc使上述修改生效。

```bash
source ~/.bashrc
```

## 安装node

使用如下命令查看可以安装的长期支持版本

```bash
nvm ls-remote --lts
```

可以直接用如下命令安装最新的长期支持版本

```bash
nvm install --lts
```

也可以根据需要安装指定的版本。

例如：

```bash
# 查看所有可安装版本
nvm ls-remote
# 安装最新版本
nvm install node
# 安装v17.9
nvm install 17.9
```

安装完成后，使用`node -v`和`npm -v`查看当前使用的node和npm版本。

> 安装node的时候，npm也会被自动安装上。

```bash
# 查看当前使用的node版本
node -v
# 查看当前使用的npm版本
npm -v
```

其他常用的nvm命令如下：

```bash
# 查看帮助
nvm help
# 查看已安装的node版本
nvm ls
# 查看当前使用的node版本（同node -v)
nvm current
# 切换使用的node版本
nvm use <版本号>
## 使用最新的lts版本（如果安装的是旧版本的lts版本，会切换失败）
nvm use --lts
## 使用已安装的最新版本
nvm use node
## 使用指定版本
nvm use 16.15
# 卸载指定版本
nvm uninstall 17.9
```

## 安装pnpm

关于pnpm的介绍，可以查看[官网](https://pnpm.io/)或者[pnpm中文网](https://www.pnpm.cn/)，或者查看其他文档介绍。简单来说，这是一个更快、更节省磁盘空间的npm。

使用npm安装pnpm

```
npm i pnpm --location=global
```

设置源

```bash
# 查看源
pnpm config get registry 
# 切换淘宝源
pnpm config set registry https://registry.npmmirror.com/
```

常用命令

```bash
pnpm init # 生成并初始化package.json

pnpm i # 安装所有依赖项
pnpm add <包名> # -S 添加指定包到dependencies
pnpm add -D <包名> # 添加指定包到devDependencies
pnpm up # 更新所有依赖项

pnpx <CLI> # 执行命令，类似于npx

pnpm remove <包名> # 移除包

pnpm config set store-dir <路径> # 设置store的存储路径，默认是/home/<username>/.local/share/pnpm/store/v3
```

