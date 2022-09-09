---
order: 6
date: 2022-07-07
category:
  - 代码笔记
  - Unity笔记
tag:
  - Unity
isOriginal: false
description: 本文通过介绍 Unity 中三种执行延时调用的方法：逐帧判断、Invoke 以及协程，并分析它们各自的优缺点。
---

# Unity 的延时调用

通常我们会遇到延时调用的需求，例如等待一段时间后执行，在一段时间内逐渐变化，以及等待某个事件发生后执行。

对于此类需求，在 Unity 中可以使用逐帧判断、Invoke 以及协程三种方法来完成。

## 逐帧判断

通过使用`Time.time`和`Time.deltaTime`等 Unity 内置的时间变量来记录时间的流逝，并在 Update 中执行相应的代码。优点是很灵活，缺点是容易造成`Update`的代码臃肿，使用起来不太方便。

要使用该方法实现定时任务，定义一个时间变量`timer`，每帧将此时间减去帧间隔时间`Time.deltaTime`，如果小于或者等于零，说明定时器到期了，执行相应功能代码。如果要重复执行，则在定时器到期后重置定时器，重新开始计时。

在下面的例子中，游戏对象会在等待3秒后自动销毁。

```csharp
using UnityEngine;

public class Example : MonoBehaviour
{
    public float timer = 3.0f;

    void Update()
    {
        timer -= Time.deltaTime;
        if(timer <= 0){
            Destroy(gameObject);
        }
    }
}
```

在某些场景下，我们需要游戏对象根据时间逐渐发生变化，例如在一定时间内逐渐移动到目标点。

在下面的例子中，游戏对象会在3秒内逐渐移动到目标点。

```csharp
using UnityEngine;
using System.Collections;

public class Example : MonoBehaviour
{
    public Vector3 p0 = Vector3.zero;
    public Vector3 p1 = new Vector3(3, 4, 5);
    public float timeDuration = 3f;

    bool onMoving = false;
    float timeStart;

    void Start()
    {
        p0 = transform.position;
        onMoving = true;
        timeStart = Time.time;
    }

    void Update()
    {
        if (onMoving)
        {
            float t = Mathf.InverseLerp(timeStart, timeStart + timeDuration, Time.time);

            if (t >= 1)
            {
                onMoving = false;
            }

            transform.position = Vector3.Lerp(p0, p1, t);
        }
    }
}
```

## 使用 Invoke

使用`MonoBehaviour.Invoke`，两个参数分别是要调用的方法名和延时调用的时间。使用`Invoke`不能调用带有参数的方法，而且性能上不够优秀。另外由于`Invoke`的第一个参数是要调用的方法名，如果找不到对应的方法（比如说拼写错误），无法在编译时发现问题。

如果要重复执行，使用`MonoBehaviour.InvokeRepeating`代替。

在下面的例子中，我们改用`Invoke`实现游戏对象在等待3秒后自动销毁的功能。

```csharp
using UnityEngine;

public class Example : MonoBehaviour
{
    public float timer = 3.0f;

    void Start()
    {
        Invoke("TimeOutHandler", timer);
    }

    void TimeOutHandler()
    {
        Destroy(gameObject);
    }
}
```

在下面的例子中，我们使用`MonoBehaviour.InvokeRepeating`实现重复定时执行的效果，该程序会先等待3秒后实例化一个火箭并发射，然后每隔0.5秒重复发射一个。

如果你想在达到某个条件后停止执行定时任务，可以使用`CancelInvoke()`或`CancelInvoke(string MethodName)`，前者会停止当前脚本的所有`Invoke`和`InvokeRepeating`任务，而后者接受一个方法名作为参数，会停止所有**调用该方法**的`Invoke`和`InvokeRepeating`任务。

```csharp
using UnityEngine;
using System.Collections;

public class Example : MonoBehaviour
{
    public Rigibody projectile;

    void Start()
    {
        InvokeRepeating("LaunchProjectile", 3.0f, 0.5f);
    }

    void LaunchProjectile()
    {
        Rigidbody instance = Instantiate(projectile);

        instance.velocity = Random.insideUnitSphere * 5;
    }
}
```

## 使用协程（推荐）

在处理延时调用的需求时，逐帧判断和使用 Invoke 都可以实现效果，但使用**协程**来执行此类任务通常会更方便。

在下面的例子中，我们使用协程来实现逐渐减少对象的不透明度，直到对象变得完全不可见的效果。

```csharp
using UnityEngine;
using System.Collections;

public class Example : MonoBehaviour
{
    // 声明协程
    IEnumerator Fade() 
    {
        for (float ft = 1f; ft >= 0; ft -= 0.1f) 
        {
            Color c = GetComponent<Renderer>().material.color;
            c.a = ft;
            renderer.material.color = c;
            yield return null;
        }
    }

    void Update()
    {
        // 按下 F 键对象开始逐渐隐藏
        if (Input.GetKeyDown("f")) 
        {
            StartCoroutine(Fade());
        }
    }
}
```

协程本质上是一个返回类型为`IEnumerator`的函数，并在主体中的某个位置包含`yield return`语句。当程序执行到`yield return`语句时，会暂停执行并将控制权返还给 Unity，然后在`yield return`之后的表达式返回结果后（对于`yield return null`，即为下一帧）恢复到此处继续执行。

在声明协程后，使用`StartCoroutine`将协程设置为运行状态。

如果要引入时间延迟，可以使用`yield return new WaitForSeconds(t)`，该语句表示暂停执行直到 t 秒后的下一帧再继续执行。

因此，如果使用协程来实现游戏对象定时销毁的效果，代码如下：

```csharp
using UnityEngine;

public class Example : MonoBehaviour
{
    float timer = 3.0f;

    IEnumerator AutoDestroy(float waitTime) 
    {
        yield return new WaitForSeconds(waitTime);
        Destroy(gameObject);
    }

    void Start()
    {
        StartCoroutine(AutoDestroy(timer));
    }
}
```

通过这个例子也可以看到，使用协程允许我们延时调用带有参数的方法。

我们还可以使用协程的串联调用，实现等待某个事件发生后继续执行的效果，见下面的例子：

```csharp
using UnityEngine;

public class Example : MonoBehaviour
{
    public Vector3 target;

    public speed = 1.0f;

    IEnumerator WaitForReachTarget() 
    {
        Vector3 curPos = transform.position;
        while (!Mathf.Approximately(Vector3.Distance(curPos, target), 0)){
            transform.position = Vector3.MoveTowards(transform.position, target, speed * Time.deltaTime);
            curPos = transform.position;
            yield return null;
        }
    }

    IEnumerator Move() 
    {
        Debug.Log("start move");
        yield return StartCoroutine(WaitForReachTarget());
        Debug.Log("reach Target");
    }

    void Start()
    {
        StartCoroutine(Move());
    }
}
```

在上面的例子中，开始游戏后会先在控制台打印“start move”，然后游戏对象开始向目标点逐渐移动，在此过程中 Unity 的主线程不会被阻塞，也就是说其他的对象以及脚本也可以正常地运行。最后在游戏对象到达目标点后，控制台打印“reach Target”。

## 协程的局限性

对于延时调用这种异步编程需求，Unity 建议使用协程来实现，但协程没有返回值，也不方便调试（不能将`yield return`语句置于`try-catch`块中）。

## UniTask
