---
order: 10
date: 2022-09-15
category:
  - 代码笔记
  - Unity笔记
tag:
  - Unity
description: 本文介绍 Unity 的数据容器类 ScriptableObject，如何通过继承 ScriptableObject 类创建以资源形式序列化保存的数据类，以及在游戏项目中应用。
---

# Unity 数据容器类 ScriptableObject

::: tip 参考资料

[Unity进阶：ScriptableObject使用指南_YY-nb的博客](https://blog.csdn.net/qq_46044366/article/details/124310241)

:::

## ScriptableObject

在游戏的开发过程中，我们经常需要跟数据打交道，尤其是为游戏对象配置数据。

假设现在要做一个“打飞机”的游戏，玩家操控的飞机在吃了不同道具后会发射不同类型的子弹，这些子弹的飞行速度和伤害各不相同。那么显然我要为每一种子弹配置好它的属性值。

实现方式有很多，比如可以为每种子弹创建预制体，然后通过脚本的成员变量来定义子弹的各个属性。为了方便配置和调试，还需要把这些变量设置为 public，以便在 Inspector 面板中对数据进行改动。

这么做主要有以下缺点：

1. 每次实例化子弹预制件的时候，都会产生单独的数据副本。实际上在绝大多数情况下，同一种子弹的属性数据应该是相同的，因此这些同样的数据副本是多余的，造成内存浪费。
2. 如果我们在运行模式下修改子弹的数据，那么在退出游戏后会还原。
3. 数据无法持久化存储，难以在项目之间、场景之间共享。

为了解决这样的问题，Unity 提供了一个专门用于独立存储大量数据的基类`ScriptableObject`。

- `ScriptableObject`是一个基类，继承自`UnityEngine.Object`，因此我们在使用时要自定义类来继承它。要注意的是，与`MonoBehaviour`不同，不能将`ScriptableObject`挂载到游戏对象上。
- 多个对象共用相同的数据时，可以使用同一个`ScriptableObject`实例，共用一份数据。
- `ScriptableObject`类的实例会被保存成资源文件（.asset文件），和预制体、材质球、音频文件等类似，存放在 Assets 文件夹中。因此可以持久化存储，并在项目之间、场景之间共享。
- 在运行模式下修改`ScriptableObject`实例的数据，在游戏推出后也会被保存下来（毕竟其实是在修改资源）。

::: warning

在 Editor 中，可以在编辑模式或运行模式下修改`ScriptableObject`实例的数据，修改的结果会保存在磁盘上，实现持久化存储。但是在发布构建后运行时，即使在游戏过程中修改了`ScriptableObject`实例的数据，也不会保存在本地，重新打开运行时还是配置的初始数据。

因此`ScriptableObject`适合使用在开发期间配置和调试数据。

:::

## 创建 ScriptableObject

### 继承 ScriptableObject 声明自定义数据容器类

首先我们要创建一个脚本继承自`ScriptableObject`类，并在该类中声明成员，这些成员表示该数据容器需要保存哪些数据。为了后续在 Inspector 面板中可以看到这些数据，需要将它们声明为 public。

```csharp
using UnityEngine;

public class BulletDate : ScriptableObject
{
    public float speed;
    public float damage;
}
```

### 为数据容器类添加创建实例（.asset数据资源文件）的方法

上一节中声明的数据容器类相当于一个数据的模板，接下来就要根据这个模板创建具体的数据。因为这个模板是类，所以具体的数据文件其实就是实例。由于数据文件在 Editor 中是以资源的形式存在的，因此一般也使用类似于创建其他资源（材质球、动画等）的方式来创建数据资源文件。

为此需要`CreateAssetMenu`属性。

```csharp
using UnityEngine;

[CreateAssetMenu(fileName = "BulletDate", menuName = "ScriptableObjects/BulletDate", order = 1)]
public class BulletDate : ScriptableObject
{
    public float speed;
    public float damage;
}
```

- fileName 表示创建的数据文件默认文件名为 BulletDate
- menuName 表示会在 Assets/Create 菜单下增加 ScriptableObjects/BulletDate 的选项
- order 表示该选项的排序（从0开始）

现在通过 Editor 的 Assets/Create 菜单（可以通过上方菜单栏的 Assets 或者在 Project 面板右键等方式访问）找到 ScriptableObjects/BulletDate，点击该选项后，就会创建一个数据资源文件。选中该文件，就可以在 Inspector 面板中配置数据了。

## 使用 ScriptableObject

在创建好数据资源文件后，我们就可以像使用其他资源文件一样使用它。

例如在不使用`ScriptableObject`的时候，在子弹预制体上可能挂载着这样的脚本:

```csharp
using UnityEngine;

public class Bullet : MonoBehaviour
{
    public float speed;
    public float damage;

    void Update() {
      // 通过成员变量直接访问子弹的属性数据
    }
}
```

使用`ScriptableObject`之后就改成这样：

```csharp
using UnityEngine;

public class Bullet : MonoBehaviour
{
    public BulletDate bulletDate;

    void Update() {
      // 通过 bulletDate 访问子弹的属性数据
    }
}
```

然后在 Inspector 面板中将创建好的数据资源文件拖拽赋值给 bulletDate 即可（注意是数据资源文件，而不是数据容器类脚本）。

## 实现非持久化数据

通过上面的介绍，我们知道了`ScriptableObject`可以实现数据持久化，只要我们在 Editor 中手动创建了一个数据资源文件，就相当于在磁盘中真正创建了一个文件。

但是在有些时候，我们只是希望运行期间在内存中临时生成一组共用的数据，退出游戏后就可以释放掉生成的数据资源。例如在游戏过程中根据环境因素临时生成一种子弹。

此时可以利用`ScriptableObject`类中的静态方法`CreateInstance<>()`，该方法可以在运行时创建出指定的`ScriptableObject`子类的实例，该实例只存在于内存中。

```csharp
public class Bullet : MonoBehaviour
{
    public BulletDate bulletDate;

    void Start() {
      bulletDate = ScriptableObject.CreateInstance<BulletDate>();
      bulletDate.speed *= 0.5f;
      bulletDate.damage *= 2;
    }
}
```
