---
order: 1
date: 2022-08-26
category:
  - 代码笔记
  - Unity笔记
tag:
  - Unity
description: 本文介绍 UnityEngine.Mathf 库的常用属性/函数及其使用场景。
---
# Mathf 库介绍

## 常量

### Deg2Rad 角度转弧度系数

常量。等于 `(PI * 2) / 360`。

用于将角度制表示的角转换为弧度制表示。

```csharp
using UnityEngine;
using System.Collections;

public class ExampleClass : MonoBehaviour
{
    public float deg = 30.0f;

    void Start()
    {
        float rad = deg * Mathf.Deg2Rad;
        // rad is 0.5235987...
    }
}
```

### Epsilon 极小值

极小值有以下特征：

- 任何值 + 极小值 = 任何值
- 任何值 - 极小值 = 任何值
- 0 + 极小值 = 极小值
- 0 - 极小值 = -极小值

根据以上特征，可以用来判断两个浮点数是否“相等”。参照 [Mathf.Approximately](#approximately-约等于)。

### Infinity 正无穷

常量。一个正无穷的浮点数。类似于`float.PositiveInfinity`或`float.MaxValue`。

::: note

实际上`Mathf.Infinity`只是类似于`float.PositiveInfinity`，和`float.MaxValue`不同。

`float.PositiveInfinity`比`float.MaxValue`大。

但在正常使用中区别不大。

:::

发射无限长度的射线

```csharp
using UnityEngine;

public class Example : MonoBehaviour
{
    void Update()
    {
        Debug.DrawLine(Vector3.zero, Vector3.forward * 100);
        if (Physics.Raycast(Vector3.zero, Vector3.forward, Mathf.Infinity))
        {
            print("There is something in front of the object!");
        }
    }
}
```

寻找最大距离时用于初始化距离值

```csharp
using UnityEngine;

public class Example : MonoBehaviour
{
    void GetClosest(GameObject[] gos)
    {
        float closestDist = Mathf.Infinity;
        GameObject closest;

        foreach (GameObject go in gos)
        {
            float dist = (transform.position - go.transform.position).magnitude;
            if (dist < closestDist)
            {
                closest = go;
                closestDist = dist;
            }
        }

      return closest;
    }
}
```

### NegativeInfinity 负无穷

常量。一个负无穷的浮点数。类似于`float.NegativeInfinity`或`float.MinValue`。

### PI

常量。众所周知的PI（3.14159265358979...）。

用于根据圆的半径计算周长等场景。

```csharp
using UnityEngine;
using System.Collections;

public class ExampleClass : MonoBehaviour
{
    public float radius = 5;

    void Start()
    {
        float perimeter = 2.0f * Mathf.PI * radius;
        Debug.Log("The perimeter of the circle is: " + perimeter);
    }
}
```

### Rad2Deg 弧度转角度系数

常量。等于 `360 / (PI * 2)`。

用于将弧度制表示的角转换为角度制表示。

```csharp
using UnityEngine;
using System.Collections;

public class ExampleClass : MonoBehaviour
{
    public float rad = 1.0f;

    void Start()
    {
        float deg = rad * Mathf.Rad2Deg;
        // deg is 57.29578...
    }
}
```

## 三角函数

### Sin/Cos/Tan 三角函数

```csharp
float Sin(float f);
float Cos(float f);
float Tan(float f);
```

返回弧度制角`f`的三角函数值。

### Asin/Acos/Atan 反三角函数

```csharp
float Asin(float f);
float Acos(float f);
float Atan(float f);
```

返回三角函数值`f`对应的弧度制角。

### Atan2 方位角

```csharp
float Atan2(float y, float x)
```

返回正切值（tan）是`y/x`的弧度制角。

::: tip Atan2(y, x) 和 Atan(y/x) 的区别

`Atan2`对象限敏感，根据输入的两个参数确定所要求的目标角在哪个象限，返回值的域为[-PI, PI]。而`Atan2`不关心象限，返回值的域为[-PI/2, PI/2]。  
此外`Atan2(y,x)`允许`x`等于`0`，并且会返回正确的角度；而在使用`Atan(y/x)`时如果`x`等于`0`会抛出异常。

注意参数的顺序是倒置的，即`Atan2(y, x)`会返回与点`(x, y)`在同一象限的向量对应的角。

:::

## 数值处理

### Abs 绝对值

```csharp
float Abs(float f);
```

返回`f`的绝对值。

### Approximately 约等于

判断两个浮点数是否“相等”。如果两个浮点数之间的差值小于 [极小值](#epsilon-极小值)，则返回`true`。

用于规避浮点数精度误差导致在判断两个浮点数是否相等（例如判断`1.0f == 10.0f / 10.0f`）时导致的问题。

```csharp
using UnityEngine;

public class ScriptExample : MonoBehaviour
{
    void Start()
    {
        if (Mathf.Approximately(1.0f, 10.0f / 10.0f))
        {
            print("The values are approximately the same");
        }
    }
}
```

### Ceil/CeilToInt 向上取整

```csharp
float Ceil(float f);
int CeilToInt(float f);
```

返回大于或等于`f`的最小整数。

两者的区别是返回值的类型不同，前者返回 float，后者返回 int。

### Clamp 钳制函数

```csharp
float Clamp(float value, float min, float max);
int Clamp(int value, int min, int max);
```

将值`value`限制在`min`和`max`之间。

- 如果`value`&lt;`min`，返回`min`
- 如果`value`>`max`，返回`max`
- 否则返回`value`

将对象的值限制在有效范围内。

```csharp
using UnityEngine;

public class ScriptExample : MonoBehaviour
{
    public int maxHealth = 5;
    private int _health = 0;

    public int currentHealth
    {
        get => _health;
        set => _health = Mathf.Clamp(value, 0, maxHealth);
    }
}
```

### Clamp01 钳制函数0到1

```csharp
float Clamp01(float value);
```

将值`value`限制在`0`和`1`之间。参照[Clamp](#clamp-钳制函数)。

### closestPowerOfTwo 取最接近的2的幂

```csharp
int ClosestPowerOfTwo(int value);
```

返回最接近`value`的 2 的幂。

例如:

```csharp
Mathf.ClosestPowerOfTwo(-1); // 0 = 2^0
Mathf.ClosestPowerOfTwo(2); // 2 = 2^1
Mathf.ClosestPowerOfTwo(3); // 4 = 2^2
Mathf.ClosestPowerOfTwo(7); // 8 = 2^3
Mathf.ClosestPowerOfTwo(19); // 16 = 2^4
```

::: tip
当有两个相邻的 2 的幂与`value`的“距离”相等时，会返回较大的。例如`Math.fClosestPowerOfTwo(3)`的结果是 4（而不是 2）。
:::

### DeltaAngle 角度差

```csharp
float DeltaAngle(float current, float target);
```

返回两个角度角`current`和`target`之间最小相差的角度。可以理解为先把两个角都缩小到0-360度内，然后再比较两个角相差角度。

```csharp
using UnityEngine;

public class Example : MonoBehaviour
{
    void Start()
    {
        // Prints 90
        Debug.Log(Mathf.DeltaAngle(1080, 90));
    }
}
```

### Exp e的幂

```csharp
float Exp(float power);
```

返回 e（自然指数） 的`power`次幂。

### FloatToHalf float转半精度浮点数

```csharp
ushort FloatToHalf(float val);
```

将浮点数`val`转换为半精度浮点数（以16位无符号整型 ushort 存储）。

转换过程会导致精度丢失。

::: warning
使用`Mathf.FloatToHalf`获得的 ushort 值应该只用于存储，如果要参与运算，应该先使用 [Mathf.HalfToFloat](#halftofloat-半精度浮点数转float) 将它转回 float。
:::

### Floor/FloorToInt 向下取整

```csharp
float Floor(float f);
int FloorToInt(float f);
```

返回小于或等于`f`的最大整数。

### HalfToFloat 半精度浮点数转float

```csharp
float HalfToFloat(ushort val);
```

将半精度浮点数`val`转换为 float 类型。

通常与 [Mathf.FloatToHalf](#floattohalf-float转半精度浮点数) 配对使用。

### IsPowerOfTwo 判断是否2的幂

```csharp
bool IsPowerOfTwo(int value);
```

判断`value`是否为 2 的幂。

### Log 对数

```csharp
float Log(float f, float p);
```

计算以`f`为真数，`p`为底数的对数。

### Log10 常用对数

```csharp
float Log10(float f);
```

计算`f`的常用对数（以`f`为真数，10 为底数的对数）。

### Max 最大值

```csharp
float Max(float a, float b);
float Max(params float[] values);
int Max(int a, int b);
int Max(params int[] values);
```

返回最大值。

### Min 最小值

```csharp
float Min(float a, float b);
float Min(params float[] values);
int Min(int a, int b);
int Min(params int[] values);
```

返回最小值。

### NextPowerOfTwo 向上取2的幂

```csharp
int NextPowerOfTwo(int value);
```

返回大于或等于`value`的 2 的幂，类似于 [取最接近的2的幂](#closestpoweroftwo-取最接近的2的幂)。

### Pow 幂

```csharp
float Pow(float f, float p);
```

返回`f`的`p`次幂。

### Round/RoundToInt 四舍六入五成双

```csharp
float Round(float f);
int RoundToInt(float f);
```

返回最接近`f`的整数，如果`f`以`.5`结尾（即刚好在两个整数之间），则返回最接近的偶数。

两者的区别是返回值得类型不同，前者返回 float，后者返回 int。

::: info

Unity 的`Mathf.Round`的算法与 C# 的`Math.Round`一致，采用“银行家舍入”算法（即四舍六入五成双）。

可以使用`Math.Round(double value, MidpointRounding mode)`的重载来指定舍入策略。如果要实现四舍五入，舍入策略选择 `MidpointRounding.AwayFromZero`。

:::

### Sign 符号函数

```csharp
float Sign(float f);
```

如果`f`大于等于`0`，返回`1`；否则返回`-1`。

## 曲线

### InverseLerp （反插值）确定线性位置

```csharp
float InverseLerp(float a, float b, float value);
```

计算值`value`在两点`a`和`b`之间的线性位置，等价于`Mathf.Clamp01((value - a) / (b - a))`。

如果`value`不在`a`和`b`之间，返回`0`或者`1`。

计算比例

```csharp
using UnityEngine;

public class ExampleClass : MonoBehaviour
{
    public float start = 20.0f;
    public float end = 40.0f;
    public float currentProgress = 22.0f;

    void Start()
    {
        float i = Mathf.InverseLerp(start, end, currentProgress);
        Debug.Log(`Current progress: ${ i * 100 }%`);
    }
}
```

### Lerp 插值

```csharp
float Lerp(float a, float b, float t);
```

返回`a`和`b`之间`t`的位置的线性插值，等价于`a + (b - a) * Mathf.Clamp01(t)`

`t`的取值范围为[0, 1]。

插值的适用范围很广。例如它可以使对象平滑移动。

::: warning

以下代码中对象永远不会到达目标点（只会永远接近），如果要判断是否达到目标点，可以使用 `Mathf.Approximately`。

:::

```csharp
using UnityEngine;

public class ExampleClass : MonoBehaviour
{
    public float easing = 0.05f;
    public Vector3 destination = Vector3.zero;

    void Update()
    {
        // 以下代码将对象平滑地移动到目标点
        // 一般使用 Vector3.Lerp(transform.position, destination, easing) 或 代替
        Vector3 pos = transform.position;
        float x = Mathf.Lerp(pos.x, destination.x, easing);
        float y = Mathf.Lerp(pos.y, destination.y, easing);
        float z = Mathf.Lerp(pos.z, destination.z, easing);
        transform.position = new Vector3(x, y, z);
    }
}
```

基于时间的线性插值可以保证运动在一个指定的时间内完成（匀速运动）。

```csharp
using UnityEngine;

public class ExampleClass : MonoBehaviour
{
    public Vector3 start = Vector3.zero;
    public Vector3 end = new Vector3(3, 4, 5);
    public float timeDuration = 1.0f;
    
    private float timeStart;

    void Start() {
        timeStart = Time.time;
    }

    void Update()
    {
        // 以下代码保证对象在 1 秒内从 start 点移动到 end 点
        // 如果在移动过程中 start 和 end 的位置发生移动，移动的路径也会随之更新
        float t = Mathf.InverseLerp(timeStart, timeStart + timeDuration, Time.time);
        // 一般使用 Vector3.Lerp(start, end, t) 代替
        Vector3 pos = transform.position;
        float x = Mathf.Lerp(start.x, end.x, t);
        float y = Mathf.Lerp(start.y, end.y, t);
        float z = Mathf.Lerp(start.z, end.z, t);
        transform.position = new Vector3(x, y, z);
    }
}
```

### LerpAngle 角度插值

```csharp
float LerpAngle(float a, float b, float t);
```

和 [Lerp](#lerp-插值) 类似，在角度大于360°时可以正确地插值。可以理解为先把两个角都缩小到0-360度内，然后再在两个角的夹角中进行插值。

`t`的取值范围为[0, 1]，`a`和`b`以及返回结果均为角度制。

### LerpUnclamped 可外插值

```csharp
float LerpUnclamped(float a, float b, float t);
```

和 [Lerp](#lerp-插值) 类似，但不限制`t`的取值范围，等价于`a + (b - a) * t`

当`t<0`时，结果小于`a`；当`t>1`时，结果大于`b`。

### MoveTowards 限速移动

```csharp
float MoveTowards(float current, float target, float maxDelta);
```

使值`current`向`target`移动`maxDelta`的“距离”（不会超过`target`），当`maxDelta`为负数时，表示向反方向移动。

等价于以下代码

```csharp
float MoveTowards(float current, float target, float maxDelta)
{
    if(Mathf.Abs(target - current) <= maxDelta)
    {
        return target;
    }
    return current + (Math.Sign(target - current) * maxDelta);
}
```

### MoveTowardsAngle 限速旋转

```csharp
float MoveTowardsAngle(float current, float target, float maxDelta);
```

和 [MoveTowards](#movetowards-限速移动) 类似，在角度大于360°时可以正确地旋转。

`current`、`target`、`maxDelta`以及返回值均为角度制。

由于性能问题，`maxDelta`不能为负数。如果要向反方向旋转，就再旋转 180°（使maxDelta增加180）。

### PingPong 摆动曲线

```csharp
float PingPong(float t, float length);
```

随着`t`的变化，返回在`0`和`length`之间线性摆动（递增，然后递减）的值。

### Repeat 循环曲线

```csharp
float Repeat(float t, float length);
```

随着`t`的变化，返回在`0`和`length`之间线性循环（递增，然后归零）的值。

### SmoothDamp 平滑移动

```csharp
float SmoothDamp(float current, float target, ref float currentVelocity, float smoothTime, float maxSpeed = Mathf.Infinity, float deltaTime = Time.deltaTime);
```

随着时间的变化将一个值平滑地（easeOut）改变成`target`。一般配合`Update()`使用。

使用时要注意

1. `current`是当前值而不是初始值；
2. `currentVelocity`这个参数一般初始设为0，但是**不能**设为局部变量（准确地说，它的生命周期要覆盖整个`SmoothDamp`的调用过程，最方便的做法就是定义为全局变量），并且要加上关键字`ref`；
3. `smoothTime`不是精确值，变化会“大约”在这个时间内完成（误差不大）。

这个函数的效果和 [Lerp](#lerp-插值) 的第一种用法类似，但在内部实现上并不是简单的插值，所以在表现上会更加“平滑”（并且解决了不会抵达目标点的问题）。

一般在摄像机跟踪等平滑移动的场景都会使用`SmoothDamp`(对于二维或三维的移动，使用`Vector2.SmoothDamp`和`Vector3.SmoothDamp`)

```csharp
using UnityEngine;

public class Example : MonoBehaviour
{
    Transform target;
    float smoothTime = 0.3f;
    float yVelocity = 0.0f;

    void Update()
    {
        float newPosition = Mathf.SmoothDamp(transform.position.y, target.position.y, ref yVelocity, smoothTime);
        transform.position = new Vector3(transform.position.x, newPosition, transform.position.z);
    }
}
```

### SmoothDampAngle 平滑旋转

```csharp
float SmoothDampAngle(float current, float target, ref float currentVelocity, float smoothTime, float maxSpeed = Mathf.Infinity, float deltaTime = Time.deltaTime);
```

和 [Mathf.SmoothDamp](#smoothdamp-平滑移动) 类似，平滑地旋转到目标角度。

### SmoothStep 缓进缓出

返回`a`和`b`之间`t`的位置的值。和 [Mathf.Lerp](#lerp-插值) 相似，但是缓进缓出（easeInOut）的。

在生成动画、淡入淡出等过渡效果时很有用。当然也可以用它来做缓进缓出的平滑运动（**没有**`Vector2.SmoothStep`或`Vector3.SmoothStep`）。

```csharp
using UnityEngine;

public class Example : MonoBehaviour
{
    float minimum = 10.0f;
    float maximum = 20.0f;

    float duration = 5.0f;

    float startTime;

    void Start()
    {
        startTime = Time.time;
    }

    void Update()
    {
        float t = (Time.time - startTime) / duration;
        transform.position = new Vector3(Mathf.SmoothStep(minimum, maximum, t), 0, 0);
    }
}

```

## 其他

### CorrelatedColorTemperatureToRGB 色温转换

```csharp
Color CorrelatedColorTemperatureToRGB(float kelvin);
```

将以开尔文为单位的色温`kelvin`转换为 RGB 颜色。

温度必须处于 1000 到 40000 度之间。

### GammaToLinearSpace 伽马空间转线性空间

```csharp
float GammaToLinearSpace(float value);
```

将`value`从伽马 (sRGB) 空间转换为线性颜色空间。

关于伽马空间和线性空间，参考[Unite 2018 | 浅谈伽玛和线性颜色空间](https://mp.weixin.qq.com/s?__biz=MzkyMTM5Mjg3NQ==&mid=2247535637&idx=1&sn=5b3d887353bda0afbd72134ce7d356bf&source=41#wechat_redirect)

### LinearToGammaSpace 线性空间转伽马空间

```csharp
float LinearToGammaSpace(float value);
```

将`value`从线性颜色空间转换为伽马 (sRGB) 空间。

### PerlinNoise 柏林噪声

```csharp
float PerlinNoise(float x, float y);
```

以`(x, y)`为采样点生成柏林噪声。返回结果的取值范围为[0, 1]（可能会略低于0或略高于1）。

可以简单理解成比较“自然”的伪随机数，可以用于生成波形，起伏不平的材质或者纹理。例如，它能用于随机生成地形（例如使用柏林噪声来生成Minecraft里的地形），火焰燃烧特效，水和云等等。

Unity提供的柏林噪声方法有如下特点：

1. 只支持2维层面（不过可以固定采样点的其中一个值来模拟生成一维的柏林噪声）
2. 可能会返回略低于0或略高于1的浮点数（如果值域很重要，需要对返回值进行限制`Mathf.Clamp01`）
3. 在采样点固定时，会返回同样的值

模拟生成石头纹理

```csharp
using UnityEngine;

// 在场景中添加一个 Cube，将以下脚本绑定给 Cube
// 运行游戏后修改 X Org、Y Org 和 Scale，观察材质的变化
public class RockMaterialMonitor : MonoBehaviour
{
    private float pictureWidth = 100f;
    private float pictureHeight = 100f;
    
    // 采样点
    public float xOrg = 0.0f;
    public float yOrg = 0.0f;
    // 噪声缩放值（值越大，生成的柏林噪声越密集）
    public float scale = 20.0f;
    // 最终生成的柏林噪声图
    private Texture2D noiseTex;
    
    private Color[] pix;
    private MeshRenderer meshRend;


    void Start() {
        meshRend = GetComponent<MeshRenderer>();
        // 初始化材质贴图并复制给方块的材质
        noiseTex = new Texture2D(pictureWidth, pictureHeight);
        meshRend.material.mainTexture = noiseTex;
        // 初始化颜色数组
        pix = new Color[noiseTex.width * noiseTex.height];
    }

    void Update()
    {
        float y = 0.0f;
        while (y < noiseTex.height)
        {
            float x = 0.0f;
            while (x < noiseTex.width)
            {
              // 根据 scale 计算真实的采样点
                float xCoord = xOrg + x / noiseTex.width * scale;
                float yCoord = yOrg + y / noiseTex.height * scale;
                // 计算柏林噪声
                float sample = Mathf.PerlinNoise(xCoord, yCoord);
                // 填充颜色数组
                pix[Convert.ToInt32(y * noiseTex.width + x)] = new Color(sample, sample, sample);
                x++;
            }
            y++;
        }
        noiseTex.SetPixels(pix);
        noiseTex.Apply();
    }
}

```

模拟 Minecraft 生成地形

```csharp
using UnityEngine;

// 在场景中添加一个空节点并添加以下脚本
// 运行游戏后修改 Nax Height 和 Relief，观察地形的变化
public class MinecraftMapCreator : MonoBehaviour
{
    // 以 X，Z 坐标为采样点，使用柏林噪声生成 Y 坐标
    private float seedX, seedZ;

    // 地图的范围（宽度、深度和最大高度）
    private int width = 50;
    private int depth = 50;
    public int maxHeight = 10;

    // 采样间隔，值越大柏林噪声越密集，地形起伏越多
    private float relief = 15.0f;
    
    void Awake()
    {
        seedX = Random.value * 100f;
        seedZ = Random.value * 100f;

        for (int x = 0; i < width; x++)
        {
            for (int z = 0; z < depth; z++)
            {
                GameObject cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
                cube.transform.locationPosition = new Vector3(x, 0, z);
                cube.transform.SetParent(transform)

                SetY(cube);
            }
        }
    }

    // 加载脚本后或检视面板中的值发生更改时，将调用此函数（只能在编辑器中调用）。
    void OnValidate()
    {
        if (!Application.isPlaying)
        {
            return;
        }

        foreach (Transform child in transform)
        {
            SetY(child)
        }
    }

    // 利用柏林噪声设置 Y 值
    private void SetY(GameObject cube)
    {
        float y = 0;
        float xSample = (cube.transform.localPosition.x + seedX) / relief;
        float zSample = (cube.transform.localPosition.z + seedZ) / relief;
        float noise = Mathf.PerlinNoise(xSample, zSample);
        y = maxHeight * noise;

        // 模仿 Minecraft 的格子风，将计算结果转换为整数
        y = Mathf.Round(y);

        Vector3 newY = new Vector3(cube.transform.localPosition.x, y, cube.transform.localPosition.z);
        cube.transform.localPosition = newY;

        // 根据地形的高度改变颜色
        Color color = Color.black;
        if (y > maxHeight * 0.3f)
        {
            ColorUtility.TryParseHtmlString("#019540FF", out color);
        } else if (y > maxHeight * 0.2f)
        {
            ColorUtility.TryParseHtmlString("#2432ADFF", out color);
        } else if (y > maxHeight * 0.1f)
        {
            ColorUtility.TryParseHtmlString("#D4500EFF", out color);
        }
        cube.GetComponent<MeshRenderer>().material.color = color;
    }
}

```
