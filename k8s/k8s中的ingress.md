## k8s中的ingress

### QA 1. 前后端分离的架构，由于跨域问题，后台使用nginx方向代理将/api开头的请求转发到java服务，应该在Nginx Ingress Controller 里配置反向代理？还是在内部的nginx里面配置方向代理？

在前后端分离的架构中，由于跨域问题，通常会使用反向代理来将前端的请求转发到后端服务。对于 Kubernetes 集群中的应用，你可以选择在 Nginx Ingress Controller 或内部的 Nginx 中配置反向代理。

### 1. 在 Nginx Ingress Controller 中配置反向代理

如果你正在使用 Kubernetes，并且已经安装了 Nginx Ingress Controller，你可以在 Ingress 资源中配置反向代理规则。这样做的好处是能够集中管理所有的路由规则，并且在一个地方配置负载均衡、TLS 等特性。

以下是一个示例 Ingress 资源的配置，用于将所有以 `/api` 开头的请求代理到后端 Java 服务：

````yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata在前后端分离的架构中，由于跨域问题，通常会使用反向代理来将前端的请求转发到后端服务。对于 Kubernetes 集群中的应用，你可以选择在 Nginx Ingress Controller 或内部的 Nginx 中配置反向代理。

### 1. 在 Nginx Ingress Controller 中配置反向代理

如果你正在使用 Kubernetes，并且已经安装了 Nginx Ingress Controller，你可以在 Ingress 资源中配置反向代理规则。这样做的好处是能够集中管理所有的路由规则，并且在一个地方配置负载均衡、TLS 等特性。

以下是一个示例 Ingress 资源的配置，用于将所有以 `/api` 开头的请求代理到后端 Java 服务：

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
meta
  name: my-ingress
spec:
  rules:
  - http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: java-service
            port:
              number: 8080
````

### 2. 在内部的 Nginx 中配置反向代理

另一种选择是在 Kubernetes Pod 中运行一个自定义的 Nginx 实例，并在该实例中配置反向代理规则。这样做的好处是你可以更加灵活地控制 Nginx 的配置，但需要自己管理 Nginx 实例的部署和扩展。

以下是一个示例 Nginx 配置，用于将 `/api` 开头的请求代理到后端 Java 服务：

```nginx
server {
    listen 80;

    location /api {
        proxy_pass http://java-service:8080;
        # 可以添加其他代理配置，如负载均衡、缓存等
    }

    # 可以添加其他路由规则或静态文件服务配置
}
```

你可以将上述 Nginx 配置保存为一个自定义的配置文件，然后在 Nginx Pod 中引入该配置文件。

总的来说，如果你正在使用 Kubernetes 并且已经使用了 Nginx Ingress Controller，推荐在 Ingress 资源中配置反向代理。如果你需要更高的定制性或者不使用 Ingress Controller，那么可以在内部的 Nginx 中配置反向代理。
