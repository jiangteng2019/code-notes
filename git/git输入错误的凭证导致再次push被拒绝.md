# git输入错误的凭证导致再次push被拒绝

在VS Code终端或CMD中执行：

```bash
# 清除特定URL的凭证
git credential reject
```
输入以下内容后按两次回车：

```text
protocol=http
host=172.16.109.131
```

重新输入新的凭证即可;