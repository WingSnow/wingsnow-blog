---
order: 1
date: 2022-06-08
category:
  - 代码笔记
  - Javascript笔记
tag:
  - Web
  - Javascript
description: 本文介绍如何对原生的 fetch 方法进行改造，以支持超时处理，发送JSON数据，Token验证，并自动解析响应数据和错误。
---
# fetch 异常处理

::: tip 参考资料：
[Fetch API 教程 - 阮一峰的网络日志 (ruanyifeng.com)](https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html)

[Fetch的数据获取和发送以及异常处理 - CSDN](https://blog.csdn.net/qq_39207948/article/details/85050687)
:::

## 服务器返回错误

`fetch()`发出请求以后，有一个很重要的注意点：只有网络错误，或者无法连接时，`fetch()`才会报错，其他情况都不会报错，而是认为请求成功。

这就是说，即使服务器返回的状态码是`4xx`或`5xx`，`fetch()`也不会报错（即`Promise`不会变为`rejected`状态）。

可以通过`response.status`属性，得到 HTTP 回应的真实状态码，判断请求是否成功；或者判断`response.ok`是否为 true （`response.status`在 200-299 的范围内时，`response.ok`为 true）。示例代码如下：

```typescript
const fetchText = async () => {
  const response = await fetch('/readme.txt')
  if (response.ok) {
    return await response.text()
  }
  throw new Error(response.statusText)
}
```

### 抛出异常

一旦我们知道请求是不成功的，可以`throw`异常或者`Promise.reject`来报错。

```typescript
// throw an Error
else {
  throw new Error(response.statusText)
}

// reject a Promise
else {
  return Promise.reject(response.statusText)
}
```

::: tip

`fetch`使用 Promise，所以这里选择`Promise.reject()`

:::

现在如果服务器返回异常，错误就会进入 catch 语句，并且我们可以 reject 一个对象来解释异常的原因。

```typescript
return Promise.reject(
    new Error(
        JSON.stringify({
            status: response.status,
            statusText: response.statusText
        })
    )
)
```

::: details 使用Error作为Promise.reject()的参数

根据eslint的`prefer-promise-reject-errors`规则[[文档](https://eslint.org/docs/rules/prefer-promise-reject-errors)]，当我们使用`Promise.reject()`时，最好只将内置的`Error`实例作为参数（而不是直接使用值或者对象）。`Error`自动存储堆栈跟踪，可以通过确定错误的来源来调试错误。如果使用非`Error`值则很难确定拒绝发生的位置。

:::

但是在某些情况下服务器会返回一个对象，说明造成错误请求的具体原因。例如如果请求缺少参数，服务器返回400，并且在`response.body`中说明缺少什么参数。

```json
{
  err: 'no first name'
}
```

这时候错误对象需求`response.json`来解析。

解决的方法是首先通过`response.json`读取，然后决定怎么处理。

::: warning

如果服务器返回成功，`response.json`读取到的就是请求的内容（对于响应`json`格式内容的接口）；

如果服务器返回错误，但是不需要具体解释（`response.body`为空）或者服务器异常返回了`body`不是`json`格式的内容，`response.json`会报错。可以通过响应头的`Content-type`是否为`application/json`来判断是否要解释。

:::

```typescript
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('Content-Type')
  let body: any
  if (contentType?.includes('application/json')) {
    body = await response.json()
  }
  if (response.ok) {
    return body
  }

  return Promise.reject(
    new Error({
      status: response.status,
      statusText: response.statusText,
      ...body,
    })
  )
}

async function fetchJson(url: string) {
  const response = await fetch(url)
  return handleResponse(response)
}
```

### 其他格式

但是现在我们只能处理 json 格式的响应，而90%的服务器都会返回 json 格式的数据，至于其他的10%呢？

> 根据[可编程网络(Programmable Web)](https://www.programmableweb.com/news/most-popular-apis-least-one-will-surprise-you/2014/01/23)的数据，最流行的10个 api 中只有一个是仅提供 xml 且不支持 json 的。其他的要么同时支持 xml  和 json，要么只支持 json 。

解析 xml 格式（或者纯文本 text/plain 格式）的数据时我们需要`response.text`。与上面一样，我们可以通过响应头来决定内容解析的方式。
现在处理代码如下：

```typescript
const handleJSONResponse = async (response: Response) => {
  const json = await response.json()
  if (response.ok) {
    return json
  }
  return Promise.reject(
    new Error(
      JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        ...json,
      })
    )
  )
}

const handleTextResponse = async (response: Response) => {
  const text = await response.text()
  if (response.ok) {
    return text
  }
  return Promise.reject(
    new Error(
      JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        err: text,
      })
    )
  )
}

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('Content-Type')
  if (contentType?.includes('application/json')) {
    return handleJSONResponse(response)
  }
  if (
    contentType?.includes('text/html') ||
    contentType?.includes('text/plain')
  ) {
    return handleTextResponse(response)
  }
  throw new Error(`Content-type ${contentType} not supported`)
}

const fetchPlus = async (url: string) => {
  const response = await fetch(url)
  return handleResponse(response)
}
```

## 网络错误

上面是针对`fetch()`请求成功，只是服务器返回错误的错误；但是如果网络连接错误导致`fetch()`请求失败呢？
此时`fetch()`本身会抛出异常，在上面的代码中，会捕获到`TypeError: Failed to fetch`的异常。

对于服务器返回的错误（或者网络错误）如何处理并呈现给终端用户，则要根据业务需求在调用方法中根据与服务器约定的错误码来转换了。

## 超时处理

fetch不支持超时timeout处理，只能自己封装。

``` typescript
type RequestInitWithTimeOut = RequestInit & { timeout?: number }

const fetchPlus = async (input: RequestInfo, init?: RequestInitWithTimeOut) => {
  const fetchPromise = fetch(input, init)
  let response: Response
  if (init?.timeout) {
    const timeoutPromise = new Promise<never>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('fetch timeout'))
      }, init.timeout)
    })
    response = await Promise.race([fetchPromise, timeoutPromise])
  } else {
    response = await fetchPromise
  }
  handleResponse(response)
}
```

核心思路是使用`Promise.race`方法，其接受一个`promise`实例数组，表示多个`promise`实例中任何一个最先改变状态，那么`race`方法返回的`promise`实例状态就跟着改变。我们构建了一个在`timeout`时间后就会自动`reject`的`timeoutPromise`，如果请求`fetchPromise`在`timeout`时仍未响应，那`response`就会接受`timeoutPromise`的`reject`，并抛出异常。

::: warning
需要注意的是在上述实现方式中：

- timeout不是请求连接超时的含义，它表示请求的response时间，包括请求的连接、服务器处理及服务器响应回来的时间；
- fetch的timeout即使超时发生了，本次请求也不会被abort丢弃掉，它在后台仍然会发送到服务器端，只是本次请求的响应内容被丢弃而已。

:::

## 发送 JSON 数据

当使用原生的`fetch`来发送 JSON 数据时，我们需要这么做：

```typescript
const content = { some: 'content' }

fetch('some-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(content),
})
```

上面提到，大部分的流行接口都采用 json 格式的响应，同时也接受 json 格式的请求。

为了简化使用，可以将以上行为进行封装。除非在 headers 中设置了其他类型的`content-type` ，否则都设置`content-type`为`application/json`，并使用`JSON.stringify()`将body转换为json字符串。

```typescript
type RequestInitPlus = Omit<RequestInit, 'body'> & {
  body?: RequestInit['body'] | Record<string, unknown>
  timeout?: number
}

const fetchPlus = async (input: RequestInfo, init?: RequestInitPlus) => {
  // 设置 content-type
  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const requestInit = {
    ...init,
    headers,
  }
  // 如果原headers没有设置content-type为'application/json'以外的值，
  // 则将body转换为JSON字符串
  if (headers.get('Content-Type') === 'application/json') {
    requestInit.body = JSON.stringify(init?.body)
  }
  // 超时处理
  const fetchPromise = fetch(input, requestInit as RequestInit)
  let response: Response
  if (init?.timeout) {
    const timeoutPromise = new Promise<never>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('fetch timeout'))
      }, init.timeout)
    })
    response = await Promise.race([fetchPromise, timeoutPromise])
  } else {
    response = await fetchPromise
  }
  return handleResponse(response)
}
```

现在，可以这样发送JSON数据

```typescript
const content = { some: 'content' }

fetchPlus('some-url', {
  method: 'POST',
  body: content,
})
```

如果要发送非JSON格式的数据，则要这样发送

```typescript
const content = 'content'

fetchPlus('some-url', {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: content,
})
```

## Bearer Token

通常，当需要处理身份认证时，大部分接口要求这样做：

``` typescript
fetch('some-url', {
  headers: { Authorization: `Bearer ${token}` },
})
```

同样进行封装以方便使用

```typescript {7-9}
const fetchPlus = async (input: RequestInfo, init?: RequestInitPlus) => {
  // 设置 content-type
  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (init?.token) {
    headers.set('Authorization', `Bearer ${init.token}`)
  }
  const requestInit = {
    ...init,
    headers,
  }
  // 如果原headers没有设置content-type为'application/json'以外的值，
  // 则将body转换为JSON字符串
  if (headers.get('Content-Type') === 'application/json') {
    requestInit.body = JSON.stringify(init?.body)
  }
  // 超时处理
  const fetchPromise = fetch(input, requestInit as RequestInit)
  let response: Response
  if (init?.timeout) {
    const timeoutPromise = new Promise<never>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('fetch timeout'))
      }, init.timeout)
    })
    response = await Promise.race([fetchPromise, timeoutPromise])
  } else {
    response = await fetchPromise
  }
  return handleResponse(response)
}
```

这样就可以按以下方式设置token

```typescript
const token = 'your token'

fetch('some-url', { token })
```

## 完整代码

现在我们有了一个对`fetch`的封装，支持timeout，发送JSON数据，Bearer Token，并自动解析响应数据和错误。

::: details 完整代码

```typescript
const handleJSONResponse = async (response: Response) => {
  const json = await response.json()
  if (response.ok) {
    return json
  }
  return Promise.reject(
    new Error(
      JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        ...json,
      })
    )
  )
}

const handleTextResponse = async (response: Response) => {
  const text = await response.text()
  if (response.ok) {
    return text
  }
  return Promise.reject(
    new Error(
      JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        err: text,
      })
    )
  )
}

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('Content-Type')
  if (contentType?.includes('application/json')) {
    return handleJSONResponse(response)
  }
  if (
    contentType?.includes('text/html') ||
    contentType?.includes('text/plain')
  ) {
    return handleTextResponse(response)
  }
  throw new Error(`Content-type ${contentType} not supported`)
}

type RequestInitPlus = Omit<RequestInit, 'body'> & {
  body?: RequestInit['body'] | Record<string, unknown>
  timeout?: number
  token?: string
}

const fetchPlus = async (input: RequestInfo, init?: RequestInitPlus) => {
  // 设置 content-type
  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (init?.token) {
    headers.set('Authorization', `Bearer ${init.token}`)
  }
  const requestInit = {
    ...init,
    headers,
  }
  // 如果原headers没有设置content-type为'application/json'以外的值，
  // 则将body转换为JSON字符串
  if (headers.get('Content-Type') === 'application/json') {
    requestInit.body = JSON.stringify(init?.body)
  }
  // 超时处理
  const fetchPromise = fetch(input, requestInit as RequestInit)
  let response: Response
  if (init?.timeout) {
    const timeoutPromise = new Promise<never>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('fetch timeout'))
      }, init.timeout)
    })
    response = await Promise.race([fetchPromise, timeoutPromise])
  } else {
    response = await fetchPromise
  }
  return handleResponse(response)
}

export default fetchPlus
````

:::
