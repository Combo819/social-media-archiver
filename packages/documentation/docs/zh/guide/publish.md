# 发布
## 改变远程仓库
如果你没有fork这个GitHub仓库,你需要自己在GitHub再创建一个仓库，然后改变remote origin
```
git remote set-url origin YOUR_GITHUB_REPO_URL
```

你可以发布源代码和二进制可执行文件。 
1. 将`.github/workflows/publish.yml_backup`重命名为`.github/workflows/publish.yml` 
2. （可选）在`CHANGELOG.txt`中添加变更日志 
3. 运行`lerna version`，这个命令会创建一个新的tag并推送到Github仓库，这将触发 Github Action`publish`发布版本。
