## k8s如何安装包管理工具helm

Centos 7系统安装包管理工具helm

如果没有科学上网，需要在github网络通畅的情况下，顺序执行下列脚本。

```sh
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3

chmod 700 get_helm.sh

./get_helm.sh

```