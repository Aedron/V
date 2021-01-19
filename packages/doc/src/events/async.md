---
meta:
  - name: description
    content: 页面容器
  - name: keywords
    content: 开发 快速上手
---

# 异步动作 & 回调

## 1. 概念

Vize 中同一事件所绑定的多个动作/回调**按照顺序先后执行**。

如果某个动作/回调的返回值为 **`Promise`**，则会先**等待该异步**任务执行完毕（resolve/reject）后再执行下一个动作/回调。

## 2. 异常处理

如果一个动作/回调抛出错误或者返回的 Promise 被 reject，将会视为执行出现异常，后续的动作/回调将**不会继续执行**。

如果你希望当你的动作/回调执行出现异常时能够继续执行后续的动作/回调，需要在动作/回调函数内部 catch 错误。如：

```ts {5,6,7,8}
export default function() {
  return new Promise(resolve => {
    doSomething()
      .then(resolve)
      .catch(e => {
        console.error('An error catched and continue execute...', e);
        return resolve();
      });
  });
}
```

## 3. 超时处理

当一个异步动作/回调超过最长等待时间没有 resolve/reject，将会被视为**执行失败**。

默认的最长等待时间为 **`10S`**，你可以手动指定最长等待时间。

### 动作超时设置

编辑动作 `config.ts`，增加 `maxTimeout` 属性，单位为 `ms`：

```ts {3}
export default {
  info: { ... },
  maxTimeout: 5000,
};
```

### 回调超时设置

编辑物料 `config.ts`，在 `onEvents` 中对应的 item 增加 `maxTimeout` 属性，单位为 `ms`：

```ts {7}
export default {
  info: { ... },
  onEvents: [
    {
      displayName: "<displayName>",
      eventName: "<eventName>",
      maxTimeout: 5000
    },
  ],
};
```

<br></br>
::: tip 🌟 提示
也可以指定 `maxTimeout` 为 **`"infinity"`**。这样将不会限制异步动作/回调的执行时间。
:::
