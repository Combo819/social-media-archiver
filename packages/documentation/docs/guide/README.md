# Introduction

**Social Media Archiver** is a Node.js template to be implemented to archive post from any social media.  
After it's implemented, it can archive a post with the images and videos, and the comments and sub comments.  
 Moreover, it has a UI webpage to submit the targeting post url and also recover the posts on the webpage. All data as well as the files are stored in your local, and no third-part server involved.

## Inspiration
When I was using the social media, sometimes the post I like was deleted by the author or by the social media platform. I was eager to have a tool to archive the post with its comments and media. After trying couple of approaches, none of them are ideal.   
For example:
+ web.archive.org: hard to archive the comments that are loaded dynamically.
+ specific platform open-source crawler: most of them are research or business oriented, without a UI to recover the crawled posts for individual users.
+ taking screenshot: hard to organize. When time goes by, the screenshots will lost in among tons of other pictures in your album. The photos from the post aren't original.The text can't be selected.   
  
Finally, to archive the post I like in a social media platform, I use Node.js to build a archive tool.
## Structure
Most of social media post has similar structure, as the following image shows:
1. author
2. content
3. embed images in content
4. images or videos
5. upvote
6. comment
7. sub comment
8. repost
9. repost comment  
    
The posts don't necessarily have all these features, but most of the posts have some of them, especially the author, content, and comment.  
Because of the similarity in structure, I notice that I can remove the platform specific code in my previous project, making it reusable for all platforms. You only need to add platform's API and the corresponding data transformation method, which is just half-day work.

## How it work?
![An image](./simple-workflow.svg)
The user submits a post url from webpage or the extension. The server get the post url and parse the post id out. Then the post id is passed to the crawler module, which fetches the post data and download the images&videos from the platform.  
When the user is browsing the webpage, the web server takes the data from the database, and return it to the browser. Then the webpage will display the archived posts.