## k8s集群搭建

使用官方centos7 镜像，使用虚拟机进行安装k8s集群:

## 1、初始化

### 网卡配置：
由于官方镜像并没有开启默认的网卡配置，故这里需要先配置网卡

```sh
sudo vi /etc/sysconfig/network-scripts/ifcfg-ens33
# 修改配置ONBOOT=no----->ONBOOT=yes
# wq保存退出
# 重启网络服务
service network restart
systemctl restart network
```

### 安装网络工具

还是由于官方的镜像太过于纯净，连ifconfig查看网络的命令都没有安装，所以，wget 命令需要在后面切换yum源的时候需要用到所以需要提前安装。
```sh
#由于安装新的yum源之前需要备份yum源配置文件，后面使用 wget时候，发现没有wget命令，另外使用yum install wget 的时候 ，发现没有基础的yum文件无法访问网络，所以最好提前安装上。
yum install net-tools wget -y
```

### 关闭防火墙
```sh
# 关闭防火墙
systemctl stop firewalld
# 禁止自启动，永久关闭
systemctl disable firewalld
```


### [关闭seLinux](#selinux)
```sh
# 临时禁用selinux
setenforce 0

# 永久关闭selinux 
sed -i 's/SELINUX=permissive/SELINUX=disabled/' /etc/sysconfig/selinux
sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config
```

### [禁用Swap(交换)分区](#swap分区)
```
swapoff -a
sed -i 's/.*swap.*/#&/' /etc/fstab
```

### 切换阿里云yum源
```sh
# 备份官方的原yum源的配置
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
# 下载Centos-7.repo文件
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
```
### 增加阿里云的Docker-ce的源：
```sh
# 安装yum管理工具
yum install -y yum-utils
# 配置阿里云的docker源
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```
### 增加kubernates 源
这段命令直接粘贴需要终端支持，测试powershell 是可以直接支持粘贴的
```sh
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

## 2、基础安装

### 通用安装包
```sh
yum install vim bash-completion net-tools gcc -y
```

### 安装docker
```sh
yum install docker-ce
# 启动Docker
systemctl start docker 
# 设置自动启动
systemctl enable docker 
```

### Kubernetes安装
#### Master上安装（控制面）:
```sh
# 安装kubeadm、kubectl、kubelet
yum install -y kubectl kubeadm kubelet
# 启动kubelet服务
systemctl enable kubelet && systemctl start kubelet
```

#### Node上安装（工作节点）：
```sh
# 安装kubeadm、kubelet
yum install -y kubeadm kubelet
# 启动kubelet服务
systemctl enable kubelet && systemctl start kubelet
```

## 3、初始化K8s集群

### 准备工作

虚拟机安装后每台机器的名称都是 localhost.localdomain ，为了不必要的麻烦,需要在每一台机器上更改一个不一样的名称：
```sh
hostnamectl --static set-hostname k8s-master # master节点
hostname $hostname # 立刻生效
```
```sh
hostnamectl --static set-hostname k8s-node1 # node节点
hostname $hostname # 立刻生效
```

### 初始化master节点
执行命令：[kubeadm init](#kubeadm-init)
```sh
kubeadm init --image-repository registry.aliyuncs.com/google_containers --apiserver-advertise-address 192.168.147.33 --pod-network-cidr=10.122.0.0/16 --token-ttl 0
```

### 关于报错
初始化过程中，不出意外的话意外要出现了:

1. 如果报 container runtime is not running:的错误，此时需要执行下面命令：
    ```sh
    rm -rf /etc/containerd/config.toml
    systemctl restart containerd
    ```
1. 如果报 Initial timeout of 40s passed，4分钟超时错误后需要执行：
执行命令：[ctr](#ctr)
```sh
ctr -n k8s.io images pull -k registry.aliyuncs.com/google_containers/pause:3.6
ctr -n k8s.io images tag registry.aliyuncs.com/google_containers/pause:3.6 registry.k8s.io/pause:3.6
# 重命名镜像registry.aliyuncs.com/google_containers/pause:3.6的tag为registry.k8s.io/pause:3.6
kubeadm reset -f
```
然后继续执行上面kubeadm init命令。一切顺利的话：

>
    Your Kubernetes control-plane has initialized successfully!

    To start using your cluster, you need to run the following as a regular user:

    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config

    Alternatively, if you are the root user, you can run:

    export KUBECONFIG=/etc/kubernetes/admin.conf

    You should now deploy a pod network to the cluster.
    Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
    https://kubernetes.io/docs/concepts/cluster-administration/addons/

    Then you can join any number of worker nodes by running the following on each as root:

    kubeadm join 192.168.147.133:6443 --token v2nbj9.n96aegm563ub38zt  --discovery-token-ca-cert-hash sha256:1a6b394358789c92e09a55eb0ae8279d5054c89aef867d4dca9dae1cf4ccf859

### 根据提示，我们执行：
```sh
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```
### 查看Master节点工作状态：
```sh
kubectl get nodes
```
此时是未准备状态。

### [安装网络插件（Calico）](#kubectlcreate)

```sh
# 执行命令
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.4/manifests/tigera-operator.yaml
```
然后执行：
```sh
# 下载到任意的文件夹:
wget https://raw.githubusercontent.com/projectcalico/calico/v3.26.4/manifests/custom-resources.yaml
vim custom-resources.yaml
```
这个是  custom-resources 文件内容，需要将cidr 网段的内容与 集群初始化时参数--pod-network-cidr  对应上。
```sh
# This section includes base Calico installation configuration.
# For more information, see: https://projectcalico.docs.tigera.io/master/reference/installation/api#operator.tigera.io/v1.Installation
apiVersion: operator.tigera.io/v1
kind: Installation
metadata:
  name: default
spec:
  # Configures Calico networking.
  calicoNetwork:
    # Note: The ipPools section cannot be modified post-install.
    ipPools:
    - blockSize: 26
    #   cidr: 192.168.0.0/16
      cidr: 10.122.0.0/16
      encapsulation: VXLANCrossSubnet
      natOutgoing: Enabled
      nodeSelector: all()

---

# This section configures the Calico API server.
# For more information, see: https://projectcalico.docs.tigera.io/master/reference/installation/api#operator.tigera.io/v1.APIServer
apiVersion: operator.tigera.io/v1
kind: APIServer
metadata:
  name: default
spec: {}
```
执行
```sh
kubectl create -f custom-resources.yaml
```

等待一段时间后，（大约4分钟）此时的Master节点已经准备就绪。

### 加入Node节点

如果没有改主机名，请先修改
```sh
hostnamectl --static set-hostname k8s-node1 #node1节点
hostname $hostname # 立刻生效
```
然后执行上述的命令：
```sh
kubeadm join 192.168.147.133:6443 --token v2nbj9.n96aegm563ub38zt  --discovery-token-ca-cert-hash sha256:1a6b394358789c92e09a55eb0ae8279d5054c89aef867d4dca9dae1cf4ccf859
```

如果之前没有保存，可以再Master节点上执行：
```
kubeadm token create --print-join-command
```

显示下列内容证明已经加入k8s集群，但是在Master节点上查看当前的node节点的状态为notReady。
```
This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.
```
### 报错

如果报 container runtime is not running:的错误，此时需要执行下面命令：
```sh
rm -rf /etc/containerd/config.toml
systemctl restart containerd
# 再执行join命令
```
如果节点一直not Ready：
查看日志：

    journalctl -f -u kubelet.service 

执行命令：[k8s.io images pull](#ctr)
```sh
ctr -n k8s.io images pull -k registry.aliyuncs.com/google_containers/pause:3.6 
ctr -n k8s.io images tag registry.aliyuncs.com/google_containers/pause:3.6 registry.k8s.io/pause:3.6 
```

等待一段时间后。会发现：集群已经成功运行
```
[root@k8s-master yum.repos.d]# kubectl get nodes
NAME         STATUS   ROLES           AGE   VERSION
k8s-master   Ready    control-plane   17h   v1.28.2
k8s-node1    Ready    <none>          17h   v1.28.2
k8s-node2    Ready    <none>          16h   v1.28.2
```

------------

## kubeadm init：
>   
    这是一条用于初始化Kubernetes集群的`kubeadm`命令。

    1. `kubeadm init`
    - 这是`kubeadm`工具的子命令,用于初始化Kubernetes控制平面节点。

    2. `--image-repository registry.aliyuncs.com/google_containers`
    - 指定用于拉取Kubernetes镜像的仓库地址,这里使用的是阿里云的镜像仓库,因为国内无法直接访问Google的仓库。

    3. `--apiserver-advertise-address 192.168.147.33`
    - 设置Kubernetes API Server将要对外公布的IP地址,其他节点将使用该地址与API Server通信。

    4. `--pod-network-cidr=10.122.0.0/16`
    - 为Kubernetes集群指定Pod网络的IP地址范围,这个CIDR表示将使用10.122.0.0/16这个网段作为Pod网络。

    5. `--token-ttl 0`
    - 设置令牌的超时时间为0,即令牌永不过期。通常在测试环境中使用,生产环境应设置适当的过期时间。

    执行这条命令后,它会在当前节点上部署必需的组件,如`kube-apiserver`、`kube-controller-manager`、`kube-scheduler`等,从而初始化一个Kubernetes控制平面。

    在后续的步骤中,通过部署网络插件(如Flannel、Calico等)为集群提供Pod网络互通,然后再使用`kubeadm join`命令将其他节点加入集群,从而构建一个完整的Kubernetes集群。

---------

## ctr
这两条命令都涉及到容器镜像的拉取和标记,它们是在配置Kubernetes环境时可能会用到的。

1. `ctr -n k8s.io images pull -k registry.aliyuncs.com/google_containers/pause:3.6`
    - `ctr` 是 containerd 的命令行工具
    - `-n k8s.io` 指定使用 `k8s.io` 这个命名空间
    - `images pull` 表示拉取镜像
    - `-k` 选项允许从不受信任的镜像仓库拉取镜像
    - `registry.aliyuncs.com/google_containers/pause:3.6` 是要拉取的pause镜像在阿里云镜像仓库中的地址和标签

这条命令的作用是从阿里云的镜像仓库中拉取Kubernetes使用的pause容器镜像的3.6版本。

2. `ctr -n k8s.io images tag registry.aliyuncs.com/google_containers/pause:3.6 registry.k8s.io/pause:3.6`
    - `images tag` 子命令用于给镜像打标签
    - `registry.aliyuncs.com/google_containers/pause:3.6` 是第一步拉取的镜像
    - `registry.k8s.io/pause:3.6` 是标准的Kubernetes pause镜像名称和标签

这条命令的目的是将从阿里云拉取的pause镜像重新打标签为Kubernetes标准的镜像名称和标签。

pause容器镜像是Kubernetes集群中非常重要的基础组件之一,它的作用是在每个Pod中作为唯一的无休止地运行的"pause"进程,其他容器则是通过共享技术与它共享PID namespace等资源。由于无法直接从Google镜像库拉取,所以需要先从其他镜像源拉取,再重新打标签。

这两条命令通常在部署Kubernetes集群的kubeadm init阶段会执行,以保证必需的pause镜像可用。

---------------
# selinux
>
    SELinux 全称为 Security-Enhanced Linux,是一种强制访问控制安全机制,它作为Linux内核的一个安全模块运行,限制程序只能访问它们授权的文件。

    `setenforce 0` 这条命令的作用是临时将 SELinux 设置为 permissive 模式,也就是允许模式。在此模式下,SELinux 仅记录访问违规而不强制执行策略。

    接下来的两条命令:

    ```
    sed -i 's/SELINUX=permissive/SELINUX=disabled/' /etc/sysconfig/selinux
    sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config
    ```

    这两条命令是永久关闭 SELinux。

    第一条:
    - `sed` 是流编辑器,允许对文件进行修改
    - `-i` 参数让 sed 直接修改文件内容
    - 单引号里是替换命令, `s/查找内容/替换内容/`
    - 将 /etc/sysconfig/selinux 文件中的 SELINUX=permissive 替换为 SELINUX=disabled

    第二条:
    - 同样使用 sed 
    - 双引号让 sed 可以识别 / 
    - `g` 表示全局替换,将该文件中所有 SELINUX=enforcing 改为 SELINUX=disabled

    执行这两条命令后,SELinux 就被永久关闭了。关闭 SELinux 会降低系统安全性,但也消除了它可能带来的一些程序兼容性问题。在生产环境中还是建议开启并正确配置 SELinux。
-------------

## swap分区
>
    这两条命令用于永久禁用Linux系统中的交换分区(swap)。

    1. `swapoff -a`
    - `swapoff`是用来关闭交换分区的命令
    - `-a`选项表示关闭所有的交换分区

    这条命令会立即关闭当前所有已启用的交换分区。

    2. `sed -i 's/.*swap.*/#&/' /etc/fstab`
    - `sed`是流编辑器,常用于文本替换
    - `-i`选项让sed直接修改文件内容
    - `'s/.*swap.*/#&/'`是替换命令
        - `.*swap.*`是正则表达式,用于匹配包含"swap"的行
        - `#&`是替换码,`#`号用于注释该行,`&`表示保留原来的内容
    - `/etc/fstab`是系统启动时自动挂载分区和虚拟文件系统的配置文件

    这条命令的作用是,用`#`号注释掉`/etc/fstab`文件中包含"swap"字样的行,从而阻止系统开机时自动挂载交换分区。

    综合这两条命令的作用是:
    1) 立即关闭当前的交换分区
    2) 防止系统重启后自动启用交换分区

    禁用交换分区通常是为了彻底利用系统物理内存,避免内存与交换分区之间的数据交换,从而获得更佳的性能表现,尤其对于需要大内存的任务非常有用。但也要权衡内存占用,避免内存不足导致系统崩溃。

-----------
## kubectlcreate
>   
    这条命令是在Kubernetes集群中创建Calico网络插件所需的Tigera Operator。

    让我们分解一下命令中的各个部分:

    1. `kubectl create`
    - `kubectl`是Kubernetes的命令行工具
    - `create`是其子命令,用于从文件或URL创建Kubernetes资源

    2. `-f` 
    - 该标志指定要创建资源的文件源

    3. `https://raw.githubusercontent.com/projectcalico/calico/v3.26.4/manifests/tigera-operator.yaml`
    - 这是Tigera Operator安装文件的原始URL
    - Calico是一个广泛使用的开源容器网络插件
    - Tigera Operator是部署和管理Calico的Kubernetes操作符

    执行这条命令后，它会从给定的URL下载一个YAML文件，并根据其中的定义在集群中创建所需的资源。

    Tigera Operator主要包含以下几个关键资源:

    1. Namespace: 为Calico组件创建一个专用命名空间
    2. RBAC资源: 为Operator分配所需的权限
    3. Deployment: 部署Operator本身
    4. CustomResourceDefinitions: 定义Calico的自定义资源

    创建Tigera Operator是安装Calico的第一步。接下来还需要创建Calico自定义资源来启用和配置网络插件。Calico会自动在集群中部署需要的组件,并根据配置为容器提供网络连接和网络策略实施。

    总的来说,这条命令启动了在Kubernetes集群中部署流行的Calico CNI插件的过程。