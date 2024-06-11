## k8s命令集合

### 标签操作
```sh

# 给容器中的pod 添加标签
kubectl label pod nginx app.kubernetes.io/name=nginx

# 删除pod中拼写错误的标签
kubectl label pod nginx app.kubenetes.io/name- app.kubernetes.io/name=nginx

# 编辑一个pod标签
kubectl label pod nginx environment=production --overwrite

# 查看一个pod的详细信息
kubectl describe pod nginx

# 查看一个pod的详细信息，在其他命名空间
kubectl describe pod nginx -n test
```