## k8s外部访问pod中的服务

要想让服务暴露出去需要配置一个service用于流量转发：

查看pod的标签
```sh
[root@k8s-master ~]# kubectl get pods --show-labels
NAME    READY   STATUS    RESTARTS        AGE   LABELS
nginx   1/1     Running   1 (2d21h ago)   10d   app.kubernetes.io/name=nginx
```

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 30007
```

配置好这个service，可以提通过任意node节点的ip+端口访问pod中的服务。

如果无法访问，检查nginx的标签是否配置正确。

Kubernetes 中创建一个 NodePort 类型的 Service 时，Kubernetes 会在集群中的每个节点上打开一个相同的端口，并将该端口映射到 Service 上。这意味着无论您访问集群中的哪个节点的该端口，都会被路由到 Service 上，然后 Kubernetes 将根据负载均衡算法选择一个可用的 Pod 来处理请求。

所以，访问集群中的任何一个节点的该端口，都可以访问到 Service 提供的服务。这种行为使得 Kubernetes 集群中的服务可以被轻松地访问，而无需关心具体的节点。