## 使用github将镜像保存至阿里云

dockerHub的镜像在国内是无法访问，如果需要下载镜像，可以借助github的actions功能，将镜像保存到github，然后通过github actions将镜像保存到阿里云。

1. 创建github actions

```yaml
name: docker images auto

on:
    push:
        branches: ['master']
    pull_request:
        branches: ['master']

jobs:
    build:
        runs-on: ubuntu-latest

        steps:
            - name: Git pull
              uses: actions/checkout@v3

            - name: Set up Docker Buildx
              uses: docker/setup-buildx-action@v2.9.1

            - name: Login to Docker Hub
              uses: docker/login-action@v2.2.0
              with:
                  registry: registry.cn-hangzhou.aliyuncs.com
                  username: jiangteng2024
                  password: aliyun121616
                  logout: false

            - name: Use Skopeo Tools Sync Image to Docker Hub
              run: |
                  skopeo copy docker://registry.k8s.io/kube-apiserver:v1.28.2 docker://registry.cn-hangzhou.aliyuncs.com/kubeadm-images-1-28-2/kube-apiserver:v1.28.2
                  skopeo copy docker://registry.k8s.io/kube-controller-manager:v1.28.2 docker://registry.cn-hangzhou.aliyuncs.com/kubeadm-images-1-28-2/kube-apiserver:v1.28.2
                  skopeo copy docker://registry.k8s.io/kube-scheduler:v1.28.2 docker://registry.cn-hangzhou.aliyuncs.com/kubeadm-images-1-28-2/kube-scheduler:v1.28.2
                  skopeo copy docker://registry.k8s.io/kube-proxy:v1.28.2 docker://registry.cn-hangzhou.aliyuncs.com/kubeadm-images-1-28-2/kube-proxy:v1.28.2
                  skopeo copy docker://registry.k8s.io/pause:3.9 docker://registry.cn-hangzhou.aliyuncs.com/kubeadm-images-1-28-2/pause:3.9
                  skopeo copy docker://registry.k8s.io/etcd:3.5.9-0 docker://registry.cn-hangzhou.aliyuncs.com/kubeadm-images-1-28-2/etcd:3.5.9-0
                  skopeo copy docker://registry.k8s.io/coredns/coredns:v1.10.1 docker://registry.cn-hangzhou.aliyuncs.com/kubeadm-images-1-28-2/coredns:v1.10.1
```

利用github actions将镜像保存到阿里云，前提是在阿里云上创建一个镜像仓库，设置到命名空间和仓库，借助skopeo 这个工具可以实现镜像的克隆与复制。
