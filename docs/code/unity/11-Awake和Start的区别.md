---
order: 11
date: 2022-09-16
category:
  - 代码笔记
  - Unity笔记
tag:
  - Unity
description: 本文介绍 Unity 的生命周期事件函数 Awake 和 Start 的区别，使用场景以及使用时的注意事项。
---

# Unity 中 Awake 和 Start 的区别

::: note 参考资料

[Unity中Awake和Start的区别_puppet_master的博客](https://blog.csdn.net/puppet_master/article/details/50975186)
[Unity3D脚本中Start()和Awake()的区别_悟之思语的博客](https://blog.csdn.net/jbjwpzyl3611421/article/details/12679637)

:::

Awake 和 Start 是 Unity 内置的两个事件函数，它们都会在脚本实例的生命周期中被自动调用，并且由于都是在生命周期开始时仅被调用一次，所以常用于执行初始化事件。但是 Awake 和 Start 是有区别的，如果不清楚它们的调用顺序和逻辑，可能会在脚本中导致“竞态条件”。

## 概念分析

Awake 在加载脚本实例时调用。在脚本实例的生存期内，Unity 仅调用 Awake 一次。对于放置在场景中的活动 GameObject，Unity 在初始化场景中的所有活动 GameObject 后调用 Awake，因此可以安全地使用`GameObject.FindWithTag`等方法查询其他 GameObject。Awake 会在所有对象的 Start 之前调用，但是调用每个 GameObject 的 Awake 的顺序是不确定的。即使脚本是活动 GameObject 的禁用组件，也将调用 Awake。如果 GameObject 本身是禁用的，那么 Awake 也不会被调用。

Start 在任何（不管是否为当前脚本的）Update 方法之前调用。类似于 Awake 函数，Start 在脚本生命周期内仅调用一次。但是，Start 只有在脚本是启用状态时（enable）才会被调用。

根据以上官方文档对于 Awake 和 Start 的介绍，可以总结以下关键区别：

- 对于放置在场景中的活动 GameObject，Unity 在初始化场景中的所有活动 GameObject 后调用 Awake，并在所有脚本的 Awake 执行完成后调用 Start，然后在所有脚本的 Start 执行完成后调用 Update。即 **Awake -> Start -> Update**。但是如果在游戏运行期间实例化或激活 GameObject，则不能遵循这个规则了。
- 如果 GameObject 是禁用的，Awake 和 Start 都不会调用；如果 GameObject 是启用的但脚本是禁用的，只有 Awake 会被调用，而 Start 不会被调用。

根据官方文档的建议，应该使用 Awake 来代替构造函数进行初始化，但是如果对象 A 的初始化代码需要依赖于已经初始化的对象 B，B 的初始化应在 Awake 中完成，A 则应在 Start 中完成。如果对象 A 和对象 B 需要相互引用或传递信息，应该使用 Awake 在脚本之间设置引用，并在 Start 中传递任何信息。

## 实验

下面通过两个实验来进一步说明 Awake 和 Start 的关系。

### 放置在场景中的对象的初始化

在游戏场景中创建三个 GameObject（Cube1、Cube2 和 Cube3），分别将以下脚本 Example1、Example2 和 Example3 挂载在三个对象上，并将 Cube1 拖拽赋值给 Example2 的 go1 变量。然后将 Cube1 设置为不可用（取消选中 Inspector 面板左上角的复选框），并将 Cube3 的 Example3 组件设置为不可用（取消选中 Inspector 面板中 Example3 组件左上角的复选框）。

```csharp
using UnityEngine;

public class Example1 : MonoBehaviour
{
    void Awake()
    {
        Debug.Log("Example1.Awake() was called");
    }

    void Start()
    {
        Debug.Log("Example1.Start() was called");
    }
}
```

```csharp
using UnityEngine;

public class Example2 : MonoBehaviour
{
    public GameObject go1;
    public GameObject go3;

    void Awake()
    {
        // GO1 = GameObject.Find("Cube1"); // GameObject.Find() 无法找到未启用的对象
        go3 = GameObject.Find("Cube3");
        Debug.Log("Example2.Awake() was called");
    }

    void Start()
    {
        Debug.Log("Example2.Start() was called");
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.F1))
        {
            go1.SetActive(true);
        }
        if (Input.GetKeyDown(KeyCode.F2))
        {
            go3.GetComponent<Example3>().enabled = true;
        }
    }
}
```

```csharp
using UnityEngine;

public class Example3 : MonoBehaviour
{
    void Awake()
    {
        Debug.Log("Example3.Awake() was called");
    }

    void Start()
    {
        Debug.Log("Example3.Start() was called");
    }
}
```

运行场景后，控制台首先会输出（Example2.Awake 和 Example3.Awake 的顺序可能不同，但始终在 Example2.Start 之前）

```bash
Example2.Awake() was called
Example3.Awake() was called
Example2.Start() was called
```

显然，由于 Example3 脚本是禁用状态的，所以其 Start 方法不会执行，但是 Awake 方法还是会执行，并且始终在 Example2.Start 之前执行。而 Cube1 对象是禁用状态的，所以 Example1 的 Start 和 Awake 都不会执行。

另外，因为在 Awake 执行之前场景中的所有启用状态的对象都已经初始化完成了，所以在 Example2.Awake 中可以使用`GameObject.Find`找到 Cube3（同样，在 Example3 中也可以找到 Cube2）。

然后按下F1，Cube1 会被激活，同时控制台输出

```bash
Example1.Awake() was called
Example1.Start() was called
```

再按下F2激活 Cube3 的 Example3 组件，控制台输出

```bash
Example3.Start() was called
```

之后如果禁用 Cube1 再重新启用（或禁用 Example3 再启用），控制台都不会输出新的信息，因为 Awake 和 Start 在生命周期中只会调用一次。

### 通过脚本创建的对象的初始化

在新的游戏场景中创建一个 GameObject，在其上挂载如下脚本：

```csharp
using UnityEngine;

public class Example4 : MonoBehaviour
{
    GameObject go;

    void Awake()
    {
        Debug.Log("Example4.Awake() was called");
        go = new GameObject("Cube4");
        Debug.Log("Cube4 was created");
        go.AddComponent<Example1>();
        Debug.Log("Example1 was added to Cube4");
    }

    void Start()
    {
        Debug.Log("Example4.Start() was called");
    }

    void Update()
    {
        if (Input.GetKeyDown("space"))
        {
            go = new GameObject("Cube5");
            Debug.Log("Cube5 was created");
            go.AddComponent<Example3>();
            Debug.Log("Example3 was added to Cube5");
        }
    }
}
```

控制台输出如下（1 和 2 的顺序可能不同）

```bash
Example4.Awake() was called
Cube4 was created
Example1.Awake() was called
Example1 was added to Cube4
Example4.Start() was called // 1
Example1.Start() was called // 2
```

然后按下空格键，控制台输出如下

```bash
Cube5 was created
Example3.Awake() was called
Example3 was added to Cube5
Example3.Start() was called
```

可以看出，Awake 会在脚本被挂载到游戏对象时立即被执行（前提是该游戏对象是启用的），然后才会继续执行后续的代码（例如上面例子中的输出"Example1 was added to Cube4"），而 Start 则会在此后被调用（如果在 Update 前挂载脚本，如 Cube4，此时与 Awake 在同一帧，而如果在 Update 中挂载脚本，如 Cube5，则执行 Start 时已经是其 Awake 被调用的后一帧，但始终在后一帧的 Update 被调用前）。

如果不注意上面的规则，很容易就会导致使用未初始化变量的问题。例如下面的例子：

```csharp
using UnityEngine;

public class Example5 : MonoBehaviour
{
    public float num;

    void Start()
    {
        num = 5.0f;
    }

    public logNum()
    {
        Debug.Log($"num is {num}");
    }
}
```

```csharp
using UnityEngine;

public class Example6 : MonoBehaviour
{
    void Update()
    {
        if (Input.GetKeyDown("space"))
        {
            GameObject go = new GameObject("Cube6");
            Example5 e = go.AddComponent<Example5>();
            e.logNum(); // output: num is 0
        }
    }
}
```

在上面的例子中，似乎我们在 Example5 中将 num 初始化成了 5，但是在 Example6 中调用`logNum`时得到的结果却是 0。这就是因为在此时 Example5 的 Start 还未被调用，所以 num 还是默认值。如果要实现想要的效果，应该在 Example5 的 Awake 方法中完成 num 的初始化。
