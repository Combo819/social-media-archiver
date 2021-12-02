# Account

account 组件用于管理 cookie。 从前端提交的 cookie 会在 account 组件中处理。

## 校验(可选)

在前端发送 cookie 之前，它会验证 cookie 是否可用。
在`packages/backend/src/Components/Account/Service/accountApi.ts`

```TypeScript
function getLoginStatusApi(cookie: string): AxiosPromise<any> {
  return {
      data:{
          login:false,
          uid:'',
      }
  };
}
```

`getLoginStatusApi` 将返回一个 login status 和一个用户 ID，表明 cookie 属于哪个用户。 默认情况下，它总是返回 `false` 和 `''`，但前端可以选择“add cookie anyway”。 你可以覆盖此函数以使用真实 API 验证 cookie。

## 附带cookie(可选)

在`packages/backend/src/Config/axios.ts`
默认情况下，如果设置了 cookie，所有对平台的 API 请求都会被拦截并加上 cookie。

```TypeScript
    if (accountService.getMode() === 'cookie') {
      request.headers['cookie'] = accountService.getCookie();
    }
```

如果平台使用其他方式授权，你可以重写此函数。
例如，如果平台使用 `Authorization` header，你可以重写此函数以添加 `Authorization` header。

```typescript
if (accountService.getMode() === 'cookie') {
  request.headers['Authorization'] = `Bearer ${accountService.getCookie()}`;
}
```

其他某些平台可能会使用`api_key`来授权。

```typescript
if (accountService.getMode() === 'cookie') {
  request.params['api_key'] = accountService.getCookie();
}
```
