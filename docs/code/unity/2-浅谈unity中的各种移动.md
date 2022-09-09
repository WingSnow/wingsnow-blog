---
order: 2
date: 2022-08-30
category:
  - 代码笔记
  - Unity笔记
tag:
  - Unity
description: 本文介绍如何在不同的场景下让游戏对象正确地进行运动。
---
# 浅谈 Unity 中的各种移动

## 基础移动

```csharp
using UnityEngine;
using System.Collections;

public class BasicMove : MonoBehaviour
{
    // Vector3.right 表示 Vector(1, 0, 0)
    public Vector3 speed = Vector3.right;

    void Update()
    {
        // 以 1 米每秒的速度向 x 轴的正方向移动
        Vertor3 pos = transform.position;
        pos += speed * Time.deltaTime;
        transform.position = pos;
    }
}
```

通常，我们希望游戏中的运动基于时间（而不是基于帧率，同样的游戏在不同的设备上帧率会不同），也就是说不管游戏的帧速率是多少，运动都保持恒定的速度。而`Update`函数每一帧都会被调用一次，所以我们要使用`Time。deltaTime`，它表示从上一帧到现在经历了多少时间。对于 25fps（帧每秒）的游戏来说，`Time.deltaTime`就是 0.04f （1/25），即每帧的时间为 0.04 秒。

在以上的代码中，如果帧率固定为 25 fps，那么`pos.x`每帧都会递增0.04米（1.0f * 0.04f），物体保持 1 米/秒的移动速度。

::: note

Unity 的默认单位比例为 1 个单位等于 1 米。

:::

如果游戏的帧率变为 100 fps，`Time.deltaTime`就是 0.01f，`pos.x`每帧都会递增0.01米（1.0f * 0.01f），物体的移动速度仍然为 1 米/秒。

另外，`transform.position`是一个具有 get 和 set 存取器的属性，所以`transform.position.x`只能读，不可直接写。必须创建一个过渡的三维向量`pos`，对这个变量做出修改，然后赋值给`transform.position`。

## 在指定的时间完成运动

```csharp
using UnityEngine;
using System.Collections;

public class MoveOnTime : MonoBehaviour
{
    public Vector3 p0 = Vector3.zero;
    public Vector3 p1 = new Vector3(3, 4, 5);
    public float timeDuration = 1f;
    public bool checkToCalculate = false;

    bool onMoving = false;
    float timeStart;

    void Update()
    {
        if (checkToCalculate)
        {
            checkToCalculate = false;

            onMoving = true;
            timeStart = Time.time;
        }

        if (onMoving)
        {
            // 以下代码保证对象在 1 秒内从 p0 点移动到 p1 点
            // 如果在移动过程中 p0 和 p1 的位置发生移动，移动的路径也会随之更新
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

在以上代码中，通过使用基于时间的线性插值，保证运动在一个指定的时间内完成。如果在移动过程中 p0 和 p1 的位置发生移动，移动的速度（向量）也会随之更新。

## 平滑移动

当我们需要在游戏场景中使物体进行移动时，上面的方法可以满足需求，但是它们都不够“平滑”。

Unity 提供了`SmoothDamp`的方法，通过某个类似于弹簧-阻尼的函数进行平滑。

在以下代码中，我们使摄像机平滑地跟随目标移动。

```csharp
using UnityEngine;
using System.Collections;

public class FollowCam : MonoBehaviour
{
    public Transform target;

    public float smoothTime = 0.3f;

    private Vector3 velocity = Vector3.zero;

    void LateUpdate()
    {
        transform.position = Vector3.smoothdamp(transform.position, target.position, ref velocity, smoothTime);
    }
}
```

使用`smoothdamp`时注意`velocity`参数要加上`ref`关键字，且不能将`velocity`定义为 LateUpdate 的局部变量。

## 环绕运动

当需要让一个对象围绕另一个对象旋转时，使用`transform.RotateAround()`方法。

`transform.RotateAround()`的三个参数分别是：要围绕旋转的点，要围绕旋转的轴以及旋转的角度。基础用法如下：

```csharp
using UnityEngine;
using System.Collections;

public class RotateAround : MonoBehaviour
{
    public float degSpeed = 20;
    public Transform target;

    void Update()
    {
        // 使对象围绕 target 所在位置在 x-z 平面以 20 度每秒的角速度进行旋转 
        transform.RotateAround(target.position, Vector3.up, degSpeed * Time.deltaTime);
    }
}
```

如果要平滑地从一个角度旋转到另一个角度，可以借助`Mathf.SmoothDampAngle()`方法。

```csharp
using UnityEngine;
using System.Collections;

public class RotateAroundSmoothDamp : MonoBehaviour
{
    public float degSpeed = 20;
    public Transform targetPos;
    public float targetAngle = 60;
    public bool checkToCalculate = false;
    private bool onRotate = false;

    private float velocity;
    private float currentAngle;

    void Update()
    {
        if (checkToCalculate)
        {
            checkToCalculate = false;
            onRotate = true;
        }
        
        if (onRotate)
        {
            float nextAngle = Mathf.SmoothDampAngle(currentAngle, targetDeg, ref velocity, smoothTime);
            transform.RotateAround(target.position, Vector3.up, nextAngle - currentAngle);
            currentAngle = nextAngle;

            if (currentAngle == targetAngle) {
                onRotate = false;
            }
        }       
    }
}
```

## 键盘控制移动

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
        pos.x += xAxis * speed * Time.deltaTime;
        pos.z += zAxis * speed * Time.deltaTime;
        transform.position = pos;
    }
}
```

若要使用输入来进行任何类型的移动行为，请使用`Input.GetAxis`。它为您提供平滑且可配置的输入-可以映射到键盘、游戏杆或鼠标。

相对地，若要使用输入来进行事件操作，请使用`Input.GetButton`。不要将它用于移动操作。

Unity 的输入管理器 Input Manager 可以通过`Edit` > `Project Settings` > `Input Manager`查看和配置。

## 键盘控制刚体移动

在需要检测碰撞的情况，角色需要携带 Rigidbody 和 Collider 组件，在此情况下如果使用直接修改`transform.position`的方式来移动角色会导致角色在碰撞体的边缘抖动。

::: note 为什么会抖动？

在 Unity 中，为了简化物理模拟的计算，物理模拟会在一个只包含碰撞体的场景简化副本中进行，并且会在每个物理模拟帧（等同于`FixedUpdate()`的调用频率）中进行计算。

在碰撞检测的场景中，物理系统需要完成以下步骤：

1. 每当带有碰撞体的游戏对象在场景中移动时，在物理场景中移动自己的游戏对象副本；
2. 施加作用力并计算碰撞；
3. 将场景中的游戏对象移动到物理场景中计算出的新位置。

使用`transform.position`移动角色会导致以下事件：

1. 在`Update()`中，你移动角色，此时在场景（也即我们可以看见的游戏画面）中，角色其实已经进入到碰撞体内部了；
2. 等到物理模拟帧进行计算的时候（物理模拟帧一般比游戏帧率低），物理系统将自己的游戏对象副本移到相应的新位置；
3. 物理系统发现角色碰撞体现在位于另一个碰撞体（假定为箱子）内，将角色碰撞体移回以便不再位于箱子内；
4. 物理系统将角色游戏对象与该新位置同步，在场景中表现为角色离开碰撞体内部。

你不断向箱子内部移动角色，之后物理系统将它移回，因此就会导致角色在碰撞体的边缘抖动。

:::

为了避免这个问题，当我们需要移动带有刚体的对象时，需要移动刚体本身`Rigidbody`（而不是游戏对象变换`Transform`），这样物理系统就可以在角色进入箱子之前停止移动。

```csharp
using UnityEngine;
using System.Collections;

public class CubeController : MonoBehaviour
{
    public float speed = 1.0f;
    
    float xAxis;
    float zAxis;
    // 使用 new 修饰符显式隐藏从 MonoBehaviour 中继承的同名成员变量
    new Rigidbody rigidbody;

    void Awake()
    {
        rigidbody = GetComponent<Rigidbody>();
    }

    void Update()
    {
        // 从 Input 类中获取用户输入
        // 不应该在 Fixedupdate 中的读取输入。FixedUpdate 不会持续运行，因此有可能会错过用户输入。
        xAxis = Input.GetAxis("Horizontal");
        zAxis = Input.GetAxis("Vertical");
    }

    void FixedUpdate()
    {
        Vector3 pos = rigidbody.position;
        // 在 FixedUpdate 中访问 Time.deltaTime，实际返回的是 Time.fixedDeltaTime
        pos.x += xAxis * speed * Time.deltaTime;
        pos.z += zAxis * speed * Time.deltaTime;
        // 也可以直接为 rigidbody.position 赋值来更新刚体的位置
        // 但在需要持续移动时，推荐使用 MovePosition()，它会考虑插值
        rigidbody.MovePosition(position);
    }
}
```

当需要直接影响物理组件或对象（例如刚体）时，使用`FixedUpdate()`函数（而不是`Update()`）。但是不应该在`Fixedupdate()`中的读取输入，因为它不会在每一帧都运行，有可能会因此错过用户输入。

在需要持续移动时，推荐使用`MovePosition()`，它会通过插值将刚体平滑地移动到目标点（仅当`Rigidbody.interpolation`启用时）。
