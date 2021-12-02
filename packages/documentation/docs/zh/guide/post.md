# Post

这里需要三个步骤来完成 post 抓取:解析 post id、请求 post API 以及转换请求返回的数据，使之满足数据库的格式要求。

## 解析

对于大多数社交媒体平台来说，每个 post 都有一个唯一的 id。post 可以通过包含 id 的 url 访问。
例如:

- Twitter: `https://twitter.com/elonmusk/status/1457984721892352002`, id 为 `1457984721892352002`
- Facebook: `https://www.facebook.com/JustinPJTrudeau/posts/431525544996508`, id 为 `431525544996508`
- Youtube: `https://www.youtube.com/watch?v=c7nRTF2SowQ`, id 为 `c7nRTF2SowQ`  
  用户将提交这种类型的 url，我们需要从 url 解析出 id。

在 `packages/backend/src/Utility/parsePostId/parsePostId.ts`

```javascript
/**
 * get post id from url
 * @param urlStr possible post url
 * @returns the post id, if it's not a valid post url, return empty string ""
 */
export async function parsePostId(urlStr: string): Promise<string> {
  /* take in the urlStr, return the post id  */
  throw new NotImplementedError('parsePostId not implemented yet');
}
```

正如评论所说，这个函数要实现从 url 提取 id 的功能。如果 id 是在 post 的最后一部分，我们可以使用`getUrlLastSegment`来提取 id。

## API

在此步骤中，你需要请求平台的 API 来拿到 post 的信息。你可以直接去查询平台的开发者文档，查到通过 id 来请求 post 的 url 是什么。
或者更简单粗暴，直接 F12 打开浏览器控制台，选择 Network，并观察哪个 API 返回了 post 信息。

在 `packages/backend/src/Components/Post/Service/postApi.ts`

```typescript
import { crawlerAxios } from '../../../Config';
import { AxiosPromise } from 'axios';
import { NotImplementedError } from '../../../Error/ErrorClass';
function getPostApi(postId: string): AxiosPromise {
  throw new NotImplementedError('getPostApi is not implemented');
}
```

大致照着这么写:

```typescript
import { crawlerAxios } from '../../../Config';
import { AxiosPromise } from 'axios';
import { NotImplementedError } from '../../../Error/ErrorClass';
function getPostApi(postId: string): AxiosPromise {
  return crawlerAxios.get(`/PATH/TO/POST/${postId}`);
}
```

## 转换

在 `packages/backend/src/Components/Post/Service/postCrawler.ts`

```typescript
import cheerio from 'cheerio';

  private transformData(res: any): {
    repostingId: string;
    postInfo: IPost;
    userRaw: unknown;
    embedImages: string[];
  } {
    /* extract the information here. If it's a html document,
    try to manipulate the html with cheerio */
    throw new Error('Not implemented');
  }
```

你可以从 `res` 中提取信息，它是你刚刚在上面写的 API 调用的响应。
如果返回的是 html 文档，可以使用[cheerio](https://cheerio.js.org/)来操作 html。

- `repostingId` 是被转发的 post 的 ID。如果当前 post 没有转发任何 post，则返回 `""`。
- `postInfo` 是来自平台的原始 post 信息，如内容、图片、创建时间、点赞数等。你应该将原始 post 信息转换为 `IPost` 类型。见`packages/backend/src/Components/Post/Types/postTypes.ts`
- `userRaw` 是本条贴文作者在平台上的原始信息，如姓名、头像等。在大多数平台中，用户信息会直接附带在请求贴文的响应中。你要读取整个对象并赋给 `userRaw`。
- `embedImages` 是嵌入在 post 中的图片 url 列表。你可以用`cheerio`获取 html 中嵌入的图片，并将`img`标签的`src`替换为本地路径。如果没有嵌入图像，或者你更喜欢直接使用平台服务器中的图像，则返回一个空数组。

## 测试

完成上述步骤后，你可以在前端 UI 或任何 Restful API 工具中测试代码。

- 在前端，你可以单击左上角的保存按钮，输入有效的 post url，提交，然后刷新页面以查看结果。
- 在 Restful API 工具中，  
  新加一个 post：

```bash
curl 'http://localhost:5000/api/post' \
  -H 'Content-Type: application/json' \
  --data-raw '{"postIdUrl":"https://example.com/post/ID"}' \
```

查看结果：

```bash
curl 'http://localhost:5000/api/post'
```

现在它应该成功返回一个 post。 由于我们还没有保存作者信息，作者的名字将显示为 `undefined`。
请继续看下一篇。
