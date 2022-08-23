---
category:
  - 代码笔记
sidebar: false
index: false
description: 简单实用的代码笔记。

---
# 代码小记🐥

## js生成纯数字序列数组

```javascript
// 生成0-9
Array.from(new Array(10).keys())
// > [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// 生成1-10
Array.from(new Array(11).keys()).slice(1)
// > [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// 生成10个连续的偶数
Array.from(new Array(10).keys(), (x) => x*2)
// > [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

## .gitignore不起作用

`.gitignore`只对未跟踪的文件起作用。如果一个文件之前已经提交过，那么后面即使把它加入到`.gitignore`中也不会起作用。

解决方案是清除掉本地项目的git缓存，通过重新创建git索引的方式来生成遵从新.gitignore文件中规则的本地git版本，再重新提交。

```shell
# 0. 进入项目路径
# 1. 清除本地当前的Git缓存
# 也可以只清楚需要忽略的文件的缓存，如`git rm --cached -r dist`，这样就不需要执行第2步了
git rm -r --cached .

# 2. 应用.gitignore等本地配置文件重新建立Git索引
git add .

# 3. （可选）提交当前Git版本并备注说明
git commit -m 'update .gitignore'
```

## 从数组中随机选取N个元素

分两步：

1. 打乱数组
2. 截取其中的前N个元素

打乱数组使用**Fisher–Yates shuffle 洗牌算法**（`lodash.js`中的`shuffle`函数也使用此算法实现）。

```typescript
import _ from 'lodash'

_.shuffle([1, 2, 3, 4]);
// => [4, 1, 3, 2]
```

::: details 自己实现

```typescript
/**
 * Creates an array of shuffled values, using a version of the Fisher-Yates shuffle.
 *
 * @param collection The collection to shuffle.
 * @return Returns the new shuffled array.
 */
const shuffle = <T>(collection: Array<T>) => {
    const array = [...collection]
  const length = array.length
  const lastIndex = length - 1

  for (let i = 0; i < lastIndex; i+=1) {
    const rand = Math.floor(Math.random() * (lastIndex - i+ 1)) + i
    ;[array[rand], array[i]] = [array[i], array[rand]]
  }

  return array
}
```

:::

截取元素使用`Array.slice()`

```javascript
const arr = [1, 2, 3]
arr.slice(0,2)
// Array [1,2]
```
