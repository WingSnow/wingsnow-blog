---
order: 3
date: 2022-09-01
category:
  - 代码笔记
  - Unity笔记
tag:
  - Unity
description: 本文介绍 UnityEngine.Time 库以及 Unity 中的时间逻辑。
---
# Unity 的时间逻辑

::: tip 参考资料

[Important Classes - Time - Unity 手册](https://docs.unity.cn/cn/2021.3/Manual/TimeFrameManagement.html)

:::

## 与时间相关的属性

Unity 中有一些与时间相关的数值属性，它们都在`Time`库中：

`Time.time`表示从游戏开始运行以来到当前帧经过的时间

`Time.fixedTime`表示从游戏开始运行以来到最近一次执行`FixedUpdate()`经过的时间

`Time.deltaTime`表示从上一帧到当前帧经过的时间

`Time.timeScale`控制时间流逝的速度

`Time.fixedDeltaTime`表示固定帧率之间的时间间隔

`Time.maximumDeltaTime`表示两帧之间时间间隔的上限

`Time.unscaledTime`表示从游戏开始运行以来到当前帧经过的时间（不受`Time.timeScale`和`Time.maximumDeltaTime`影响）

`Time.realtimeSinceStartup`表示从游戏开始运行以来经过的实际时间（不受游戏暂停影响。在同一帧内多次调用返回结果可能不同，同样在不同帧内多次调用返回结果也可能相同）

`Time.unscaledDeltaTime`表示从上一帧到当前帧经过的时间（不受`Time.timeScale`和`Time.maximumDeltaTime`影响）

## 可变时间步长和固定时间步长

Unity 中存在两种基于“时间”进行事件处理的系统，一种基于“可变时间步长”，另一种基于“固定时间步长”。

“可变时间步长”系统的两次事件处理之间的时间间隔是不固定的，在该系统中，每在屏幕上绘制一帧执行一次事件处理。

“固定时间步长”系统每隔一个固定的时间间隔执行一次事件处理，通常它与物理模拟相关，当然如果需要也可以在该系统中执行你自己的代码。

## 可变时间步长

我们可以在`Update()`方法中定义要在可变时间步长系统中执行的代码，也就是说，这些代码会==每帧执行一次==。

注意由于不同设备（或同一设备不同情况）绘制一帧所需的时间是不固定的，通常需要在`Update()`方法中使用`Time.deltaTime`对代码产生的副作用（例如物体移动的距离）进行缩放，以保证不管游戏的帧率是多少，在相同的时间内可以产生一致的结果。

例如在下面的例子中，通过`Update()`方法读取用户的输入，并以每秒1米的速度移动对象。

```csharp
using UnityEngine;
using System.Collections;

public class CubeController : MonoBehaviour
{
    public float speed = 1.0f;

    void Update()
    {
        // 从 Input 类中获取用户输入
        float xAxis = Input.GetAxis("Horizontal");
        float zAxis = Input.GetAxis("Vertical");
        Vector3 pos = transform.position;
        Vector3 step = new Vector3(xAxis, 0, zAxis).normalized * speed * Time.deltaTime;
        pos.x += step.x;
        pos.z += step.z;
        transform.position = pos;
    }
}
```

## 固定时间步长

在固定时间步长系统中执行的代码在`FixedUpdate()`中定义，“固定时间步长”系统会在每一帧开始时，**尽可能多**地调用`FixedUpdate()`，直到**赶上当前时间**（在下面的[时间逻辑图](#时间逻辑图)中查看更多的细节）。

Unity 的物理系统也以固定时间步长运行，如果要执行物理相关的代码（例如为一个刚体施加力），也必须在`FixedUpdate()`中处理。

根据帧率的不同，`FixedUpdate()`可能在一帧内运行0次到多次。因为`FixedUpdate()`可能会在某一帧不执行，所以**不能**在`FixedUpdate()`中读取输入，可能会因此错过用户的输入。

## 时间逻辑图

以下流程图说明了 Unity 用于计算单个帧中时间的逻辑，以及`time`、`deltaTime`、`fixedDeltaTime`和`maximumDeltaTime`属性如何相互关联。

![time-flowchart.png](./assets//3-unity%E7%9A%84%E6%97%B6%E9%97%B4%E9%80%BB%E8%BE%91.md/time-flowchart.png)

1. 将当前时间减去上一次记录的时间，得到`deltaTime`
2. 判断`deltaTime`是否大于`maximumDeltaTime`，如果是，则将`deltaTime`限制为`maximumDeltaTime`
3. 将`deltaTime`加到`time`中，更新`time`
4. 判断`time`和`fixedTime`的时间差是否不小于`fixedDeltaTime`，如果是，跳到5，否则跳过7
5. 将`fixedDeltaTime`加到`fixedTime`中，更新`fixedTime`
6. 调用`FixedUpdate()`，然后回到4
7. 调用`Update()`
8. 回到1，重复循环

::: note

以上顺序只是描述了 Unity 事件循环中与时间相关的部分，完整的事件循环请查阅[事件函数的执行顺序 - Unity 手册](https://docs.unity.cn/cn/2021.3/Manual/ExecutionOrder.html)。

:::

通过这张时间逻辑图，就可以更好地理解上面已经提到的“在每一帧开始时（`Update()`执行前），尽可能多地调用`FixedUpdate()`”的含义，以及在整个时间循环中，`Time.time`、`Time.deltaTime`和`Time.fixedTime`的变化机制
