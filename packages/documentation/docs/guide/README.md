# Introduction

**Social Media Archiver** is a Node.js template to be implemented to archive post from any social media.  
After it's implemented, it can archive a post with the images and videos, and the comments and sub comments.  
 Moreover, it has a UI webpage to submit the targeting post url and also recover the posts on the webpage. All data as well as the files are stored in your local, and no third-part server involved.

GitHub: [social-media-archiver](https://github.com/Combo819/social-media-archiver)  
 Youtube: [Social Media Archiver](https://www.youtube.com/watch?v=7yGxmkiJSt8)

## Inspiration

When I was using the social media, sometimes the post I like was deleted by the author or by the social media platform. I was eager to have a tool to archive the post with its comments and media. After trying couple of approaches, none of them are ideal.  
For example:

- archive.me: hard to archive the comments that are loaded dynamically, neither the video files.
- specific platform open-source crawler: most of them are research or business oriented, like for semantic analysis, without a UI to recover the scraped posts for individual users. Hard to setup the environment.
- taking screenshot: hard to organize. When time goes by, the screenshots will lost in among tons of other pictures in your album. The photos from the post aren't original.The text can't be selected.

Finally, to archive the post I like in that social media platform, I decide to use Node.js to build a archive tool. The tool works well. Then I just decide to make a universal template based on the tool.

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
Because of the similarity in structure, I can remove the platform specific code in my previous project, making it reusable for all platforms. You only need to add platform's API and the corresponding data transformation method, which is just half-day work.
<img width="500px" src='./headbook.png'>
::: tip
You can go to [head-book](https://head-book.ml), a mock social media platform, to see the example of this structure.
:::

## How it work?

![An image](./simple-workflow.svg)
The user submits a post url from webpage or the extension. The server gets the post url and parse the post id out. Then the post id is passed to the crawler module, which fetches the post data and download the images&videos from the platform.   
The request speed is controlled, to avoid 429 error. You can configure the request speed in the config file.  
When the user opens the UI webpage, the web server takes the data from the database, and returns it to the browser. Then the webpage will display the archived posts.
