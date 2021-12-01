# Post

Here needs three steps to complete the post crawling: parse post id, request post and transform the response to fullfil the database requirement.

## Parse

For most of the social media platforms, an unique id is assigned for each post. And the post can be accessed by a url containing the id.  
For example:

- Twitter: `https://twitter.com/elonmusk/status/1457984721892352002`, the id is `1457984721892352002`
- Facebook: `https://www.facebook.com/JustinPJTrudeau/posts/431525544996508`, the id is `431525544996508`
- Youtube: `https://www.youtube.com/watch?v=c7nRTF2SowQ`, the id is `c7nRTF2SowQ`  
  The user will submit this type of url, and we need to parse the id from the url.

In `packages/backend/src/Utility/parsePostId/parsePostId.ts`

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

As the comment said, you should extract the post id from the url. Since most of the id is in the last part of the url, we can use the `getUrlLastSegment` to extract the id.

## API

In this step, you need to request the platform and get the response. You should look up the platform's developer documentation to know what is the exact url to request a post with id(not necessary the url submitted by user).  
Or more straight forward, you can open the browser console, select the network panel, and observe which API call brings back the post information.

In `packages/backend/src/Components/Post/Service/postApi.ts`

```typescript
import { crawlerAxios } from '../../../Config';
import { AxiosPromise } from 'axios';
import { NotImplementedError } from '../../../Error/ErrorClass';
function getPostApi(postId: string): AxiosPromise {
  throw new NotImplementedError('getPostApi is not implemented');
}
```

write the code like:

```typescript
import { crawlerAxios } from '../../../Config';
import { AxiosPromise } from 'axios';
import { NotImplementedError } from '../../../Error/ErrorClass';
function getPostApi(postId: string): AxiosPromise {
  return crawlerAxios.get(`/PATH/OF/POST/${postId}`);
}
```

## Transform
In `packages/backend/src/Components/Post/Service/postCrawler.ts`

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
You should extract the information from the `res`, which is the response from the API call you just wrote above.  
If it's a html document, you can use [cheerio](https://cheerio.js.org/) to manipulate the html.  
- The `repostingId` is the id of the post that is reposted. return `""` if the post is not reposting any post.  
- The `postInfo` is the raw post information from the platform, like the content, the images, the create time, the like count, etc. You should transform the raw post information to the `IPost` type. see `packages/backend/src/Components/Post/Types/postTypes.ts` 
- The `userRaw` is the raw information of the author from the platform, like the name, the profile picture, etc. In most platform, the user information will be in the response too. You should read that object and assign it to `userRaw`.
- The `embedImages` is the list of the image url embedded in the post. You can get the embedded images in the html with `cheerio`, and replace the `img` tag's `src` to local path. If there is no embedded images, or you prefer to use the image in platform's server, return an empty array.


## Test
Once you finish the above steps, you can test the code in either the frontend UI or any Restful API tool.
- in frontend, you can click the save button in the left top corner, input a valid post url, submit it, and refresh the page to see the result.
- in restful api tool,
To save a post:
```bash
curl 'http://localhost:5000/api/post' \
  -H 'Content-Type: application/json' \
  --data-raw '{"postIdUrl":"https://example.com/post/ID"}' \
```
To see the result:
```bash
curl 'http://localhost:5000/api/post' 
```
Now It should successfully return a post. The author's name will show `undefined` since we haven't save the author information yet.  
feel free to go to the next section.