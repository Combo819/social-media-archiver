# Publish
You can make a release of the source code and the binary executable files.
1. rename `.github/workflows/publish.yml_backup` to `.github/workflows/publish.yml`
2. (Optional) add changelog in `CHANGELOG.txt`
3. run `lerna version`, this command will create a new tag and push to remote, which will trigger the Github Action `publish` to publish the release.
