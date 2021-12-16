# Publish

## Change Remote
You need to create a Github repository if you didn't fork the repository. And then change the origin remote
```
git remote set-url origin YOUR_GITHUB_REPO_URL
```
## Publish
You can make a release of the source code and the binary executable files.
1. rename `.github/workflows/publish.yml_backup` to `.github/workflows/publish.yml`
2. (Optional) add changelog in `CHANGELOG.txt`
3. run `lerna version`, this command creates a new tag and push to remote, which will trigger the Github Action `publish` to publish the release.
