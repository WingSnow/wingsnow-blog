---
order: 1
date: 2022-06-06
category:
  - 后端运维
tag:
  - Ubuntu
description: 本文介绍如何在 VMware 虚拟机中安装 Ubuntu 并完成基本配置。
---
# VMware安装Ubuntu

## 下载安装VMware和Ubuntu

VMware下载地址（官网）：[https://www.vmware.com/cn/products/workstation-player.html](https://www.vmware.com/cn/products/workstation-player.html)

> 这里下载的版本是VMware Workstation Player 16.2.3

Ubuntu下载地址（阿里云镜像）：http://mirrors.aliyun.com/ubuntu-releases/22.04/

> 这里下载的是ubuntu-22.04-desktop-amd64.iso

安装VMware并运行。

## 创建虚拟机并安装镜像

选择**创建新虚拟机**

选择**安装程序光盘映像文件(iso)**，选择下载的Ubuntu镜像。

输入计算机名、用户名和密码、虚拟机名称和保存位置，其他设置保持默认，完成创建。

完成创建后会自动启动虚拟机，根据提示完成Ubuntu的后续设置。

键盘布局选择Chinese-Chinese。

由于目的是搭建开发环境，所以app可以选择最小化安装，只安装浏览器和基础工具（不安装office套件和媒体播放器）。

之后根据提示完成后续的设置直到完成安装，根据提示重启虚拟机。

首次重启后会提示需要更新软件，点击更新即可，更新完成后再次重启。

至此，Ubuntu安装完成。

## 安装VMware Tools

> 尽管客户机操作系统在未安装 VMware Tools 的情况下仍可运行，但许多 VMware 功能只有在安装 VMware Tools 后才可用。
>
> 例如只有安装了VMware Tools，才能实现主机与虚拟机之间的文件共享，同时可支持自由拖拽和跨系统复制粘贴的功能，且虚拟机屏幕也可实现全屏化。

如果网络连接正常，在安装Ubuntu镜像的时候会自动安装VMware Tools。如果没有安装，则需要手动安装。

打开终端（快捷方式Ctrl+Alt+T），

```bash
sudo apt-get install open-vm-tools-desktop
```

## 切换软件源

打开Ubuntu的设置面板（`settings`），在左侧的分类中找到`About`（最后一个），选中后点击右侧的`Software & Updates`，在弹出的窗口中选择`Download from`，选择`other`，找到`china`，选择`mirros.aliyun.com`，确定，输入密码，保存。

这样，Ubuntu就已经将软件源切换成阿里的镜像源了。

## 设置中文并安装中文输入法

打开设置面板，在左侧的分类中找到`Region & Language`，选中后右侧的`Language`改成`Chinese`。

现在会提示重启生效。先不要重启，点击上方的`Manage Installed Languages`，会显示语言支持没有完全安装，点击安装并输入密码开始安装。

安装完成后重启。

现在Ubuntu的系统界面变成中文了。

> 首次重启完成时会询问是否”将标准文件夹更新到当前语言“，根据自己需要选择，但个人建议不要更新，毕竟中文文件夹名称常常是导致各种疑难杂症的原因。

接下来安装中文输入法，本文使用fcitx框架安装谷歌输入法。

打开终端，

```bash
sudo apt-get install fcitx-googlepinyin
```

安装完成后打开菜单栏，搜索`language support`（语言支持）并打开，最下面一行`键盘输入法系统`默认是`iBus`，点击下拉菜单切换到`fcitx`（系统初始没有fctix，安装fcitx-googlepinyin的时候会装好fcitx），然后重启。

重启之后右上角状态栏会增加一个键盘图标，点击下拉菜单可以进行进一步设置。

> 切换输入法的快捷键是ctrl+space。

至此，Ubuntu中文界面及中文输入法安装完成。
