# User

## 转换

在 `packages/backend/src/Components/User/Service/userService.ts`

```typescript
  transformUserResponse(userRaw: any): IUser {
    throw new NotImplementedError(
      `transformUserResponse in UserService is not implemented`,
    );
  }
```

该函数将接收 userRaw 对象。 你得将 userRaw 对象转换为`IUser`对象。 见`packages/backend/src/Components/User/Types/userTypes.ts`

## (可选) API

在大多数情况下，你不需要通过 API 请求来获取 user 信息，因为 user 信息通常会附加到其他请求中。
在`packages/backend/src/Components/User/Service/userApi.ts`中，

```typescript
function getUserInfoByIdApi(userId: string): Promise<unknown> {
  throw new NotImplementedError('getUserInfoByIdApi is not implemented');
}
```

这函数需要返回一个 resolve 为 userRaw 对象的 promise，以满足 `userService.transformUserResponse` 参数的格式。
如果请求的结果不是 userRaw，则在 then 中将其转换为 userRaw 对象并返回。

```typescript
function getUserInfoByIdApi(userId: string): Promise<unknown> {
  return crawlerAxios({
    url: `/api/user/${id}`,
  }).then((res) => {
    const userRaw = res.data; // depends on the response format
    return userRaw;
  });
}
```
