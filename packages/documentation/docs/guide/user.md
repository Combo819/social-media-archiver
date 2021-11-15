# User

## Transform

in `packages/backend/src/Components/User/Service/userService.ts`

```typescript
  transformUserResponse(userRaw: any): IUser {
    throw new NotImplementedError(
      `transformUserResponse in UserService is not implemented`,
    );
  }
```

The function wil take in the raw user object. You should transform the raw user object into a `IUser` object. see `packages/backend/src/Components/User/Types/userTypes.ts`

## (Optional) Request

In most cases, you will not need to make a API request to get the user information, since the user information is usually attached to the other response.
in `packages/backend/src/Components/User/Service/userApi.ts`,

```typescript
function getUserInfoByIdApi(userId: string): Promise<unknown> {
  throw new NotImplementedError('getUserInfoByIdApi is not implemented');
}
```

this should return a promise resolved to be the userRaw object to meet the format of userService.transformUserResponse parameter.
If not, transform it to the userRaw object in then and return it.

```typescript
function getUserInfoByIdApi(userId: string): Promise<unknown> {
  return crawlerAxios({
    url: `/user/${id}`,
  }).then((res) => {
    const userRaw = res.data; // depends on the response format
    return userRaw;
  });
}
```
