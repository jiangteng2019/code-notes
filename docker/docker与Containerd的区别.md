## Docker与Containerd的区别

Docker作为一种早期的容器技术，它的出现颠覆了传统虚拟化方式，通过轻量级容器化的方式实现了应用的打包、交付和运行。一度，Docker几乎成为容器化的代名词。 为了防止docker一家独大，docker当年的实现被拆分出了几个标准化的模块:

1. docker-client
1. dockerd
1. containerd
1. docker-shim
1. runc

### Containerd

Containerd是由Docker团队开源的容器运行时，它专注于提供轻量级、高性能的容器运行环境。作为一个纯粹的容器运行时，Containerd被设计为更加符合K8s的架构和需求。它具有更小的资源占用，更快的启动时间，以及更好的性能表现。 K8s社区认可了Containerd的优势，并将其作为K8s生态系统的标配容器运行时。 Containerd 可以在宿主机中管理完整的容器生命周期：容器镜像的传输和存储、容器的执行和管理、存储和网络等。详细点说，Containerd 负责干下面这些事情：

1. 管理容器的生命周期(从创建容器到销毁容器)
1. 拉取/推送容器镜像
1. 存储管理(管理镜像及容器数据的存储)
1. 调用 runC 运行容器(与 runC 等容器运行时交互)
1. 管理容器网络接口及网络

### 容器运行时接口

容器运行时接口（Container Runtime Interface），简称 CRI。 CRI 是一个插件接口，它使 kubelet 能够使用各种容器运行时，无需重新编译集群组件。 你需要在集群中的每个节点上都有一个可以正常工作的容器运行时， 这样 kubelet 能启动 Pod 及其容器。 容器运行时接口（CRI）是 kubelet 和容器运行时之间通信的主要协议。

### 支持的 CRI 后端

1. cri-o：cri-o 是 Kubernetes 的 CRI 标准的实现，并且允许 Kubernetes 间接使用 OCI 兼容的容器运行时，可以把 cri-o 看成 Kubernetes 使用 OCI 兼容的容器运行时的中间层。

1. cri-containerd：基于 Containerd 的 Kubernetes CRI 实现，Containerd是一个进程,是CRI-Containerd的实现

1. rkt：由 CoreOS 主推的用来跟 docker 抗衡的容器运行时
   frakti：基于 hypervisor 的 CRI

1. docker：Kuberentes 最初就开始支持的容器运行时，目前还没完全从 kubelet 中解耦，Docker 公司同时推广了 OCI 标准

### Dockershim

在 Kubernetes 提出 CRI 操作规范时，Docker刚拆出 containerd，并不支持 CRI 标准。由于当时Docker是容器技术最主流也是最权威的存在，Kuberentes虽然提出了CRI接口规范，但仍然需要去适配CRI与Docker的对接，因此它需要一个中间层或 shim 来对接 Kubelet 和 Docker 的 contianer runtime。 于是 kubelet 中加入了 Dockershim （shim为临时、兼容的意思）。
