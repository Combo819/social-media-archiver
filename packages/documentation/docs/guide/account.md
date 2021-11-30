# Account

The account component is used to manage the cookie. The cookie submitted from the frontend is handled in the account component.

## Validate(Optional)

Before the frontend sends the cookie, it will validate the cookie.  
In `packages/backend/src/Components/Account/Service/accountApi.ts`
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
This `getLoginStatusApi` will return a login status and a user id, indicating which user the cookie belongs to. By default, it always return `false` and `''`, but the frontend can choose to "add cookie anyway". You can override this function to validate the cookie with real API.

## Attach(Optional)
In `packages/backend/src/Config/axios.ts`
By default, all API request to the platform will be intercepted and attached with the cookie, if the cookie is set.  
```TypeScript
    if (accountService.getMode() === 'cookie') {
      request.headers['cookie'] = accountService.getCookie();
    }
```
If the platform use other approach to authorize, you can override this function.  
For example, if the platform uses `Authorization` header, you can override this function to add `Authorization` header.
```typescript
    if (accountService.getMode() === 'cookie') {
      request.headers['Authorization'] = `Bearer ${accountService.getCookie()}`;
    }
```
and some other platform may use `api_key` to authorize.
```typescript
    if (accountService.getMode() === 'cookie') {
      request.params['api_key'] = accountService.getCookie();
    }
```
