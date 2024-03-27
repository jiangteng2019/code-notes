## docker中的网络连接

### 默认网络
docker创建的时候会默认创建三种网络，可以通过 docker network ls 查看
```sh
[root@k8s-master ~]# docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
45e8ad7f7bb7   bridge    bridge    local
4838faec03a5   host      host      local
2996516fd1e1   none      null      local
```

### 1. bridge 网络模式

默认的网络模式，Docker 守护进程创建了一个虚拟以太网桥 docker0，新建的容器会自动桥接到这个网络。Docker通过为每个容器创建一对虚拟网卡,其中一端在容器内,另一端在宿主机的虚拟网桥上,从而使所有容器连接到同一个虚拟网络中,因此容器间就能互相通信了。这是Docker的默认容器网络模式。

具体来说,创建容器网络连接的过程是这样的:

1) Docker daemon启动时,会创建docker0虚拟网桥(bridge)。

2) 当启动一个新容器时,Docker会先创建一对虚拟网卡(veth pair),分别是容器内部的eth0虚拟网卡和宿主机上的另一个虚拟网卡(如veth1234)。

3) 然后Docker会将宿主机上的那个虚拟网卡(veth1234)连接到docker0网桥上。

4) 这样新容器的eth0虚拟网卡就通过veth pair与docker0网桥相连了。

5) 所有容器都这样连接到同一个docker0网桥上,因此就能够互相通信。

之所以要创建这对虚拟网卡接口,是因为容器需要一个专属的网卡连到虚拟网桥上,这样既能与外界通信,又能与其他容器通信。如果直接将容器加到网桥上,容器就没有了专属网卡,网络性能和隔离性会受到影响。

所以虽然有docker0网桥,但为了给每个容器分配独立的网卡,Docker还是在创建容器时临时创建了一对虚拟网卡接口,作为连接到docker0网桥的通路。这种设计可以确保网络性能和隔离性。

查看容器的网卡：
```sh
/ # ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
21: eth0@if22: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue
    link/ether 02:42:ac:11:00:03 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.3/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
```
查看宿主机的网卡：
```sh
# ip addr
18: vethdcfdc20@if17: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default
    link/ether 86:8f:8e:8e:99:65 brd ff:ff:ff:ff:ff:ff link-netnsid 6
    inet6 fe80::848f:8eff:fe8e:9965/64 scope link
       valid_lft forever preferred_lft forever
22: veth3f79716@if21: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default
    link/ether da:66:e6:e1:03:39 brd ff:ff:ff:ff:ff:ff link-netnsid 7
    inet6 fe80::d866:e6ff:fee1:339/64 scope link
       valid_lft forever preferred_lft forever
```
查看网桥信息:
```sh
# yum install -y bridge-utils

[root@k8s-master ~]# brctl show
bridge name     bridge id               STP enabled     interfaces
docker0         8000.0242802181e1       no              veth3f79716
                                                        vethdcfdc20
```
查看容器分配的ip和网关信息：
```sh
# docker inspect nginx-app
"Gateway": "172.17.0.1",
"GlobalIPv6Address": "",
"GlobalIPv6PrefixLen": 0,
"IPAddress": "172.17.0.2",

# docker inspect bbox
"Gateway": "172.17.0.1",
"GlobalIPv6Address": "",
"GlobalIPv6PrefixLen": 0,
"IPAddress": "172.17.0.3",
```
可以看到容器默认时间是可以相互通信的，这是docker默认运行的通信方式。

还可以通过查看网桥信息看查看哪些容器网卡连接上来：
```sh
docker network inspect bridge

{
	"b5b9523f97b20c14a3bf19bff5d8b437c9f71750e58d5b2d993c28a133f4050e": {
		"Name": "nginx-app",
		"EndpointID": "b53b570b3a784dcc6dad452cefbe52ec64eb41908913f5db7ae25e0858254de0",
		"MacAddress": "02:42:ac:11:00:02",
		"IPv4Address": "172.17.0.2/16",
		"IPv6Address": ""
	},
	"bfd3b5566230e073cdd50ffa9d38fba52f6fae58f43397f572ccf12d017c024d": {
		"Name": "bbox",
		"EndpointID": "f08b6047d0de51f1f345cebf02e2afc286c639f86b31c3ea918bfb1d14856390",
		"MacAddress": "02:42:ac:11:00:03",
		"IPv4Address": "172.17.0.3/16",
		"IPv6Address": ""
	}
}
```
可以看到两个容器连接到了默认的bridge 网桥。


### 2. host 网络模式
- host 网络模式需要在创建容器时通过参数 --net host 或者 --network host 指定；

- 采用 host 网络模式的 Docker Container，可以直接使用宿主机的 IP 地址与外界进行通信，若宿主机的 eth0 是一个公有 IP，那么容器也拥有这个公有 IP。同时容器内服务的端口也可以使用宿主机的端口，无需额外进行 NAT 转换；

- host 网络模式可以让容器共享宿主机网络栈，这样的好处是外部主机与容器直接通信，但是容器的网络缺少隔离性。

通过 ip addr 命令查看容器内容网络信息 ，会发现跟宿主机的网络信息是一样的。也就说容器可以直接利用宿主机的网络ip进行直连。


### 3. none 网络模式
- none 网络模式是指禁用网络功能，只有 lo 接口 local 的简写，代表 127.0.0.1，即 localhost 本地环回接口。在创建容器时通过参数 --net none 或者 --network none 指定；
- none 网络模式即不为 Docker Container 创建任何的网络环境，容器内部就只能使用 loopback 网络设备，不会再有其他的网络资源。可以说 none 模式为 Docke Container 做了极少的网络设定，但是俗话说得好“少即是多”，在没有网络配置的情况下，作为 Docker 开发者，才能在这基础做其他无限多可能的网络定制开发。这也恰巧体现了 Docker 设计理念的开放。

### 4.container 网络模式
- Container 网络模式是 Docker 中一种较为特别的网络的模式。在创建容器时通过参数 --net container:已运行的容器名称|ID 或者 --network container:已运行的容器名称|ID 指定；
- 处于这个模式下的 Docker 容器会共享一个网络栈，这样两个容器之间可以使用 localhost 高效快速通信。
- Container 网络模式即新创建的容器不会创建自己的网卡，配置自己的 IP，而是和一个指定的容器共享 IP、端口范围等。同样两个容器除了网络方面相同之外，其他的如文件系统、进程列表等还是隔离的。

### link
docker run --link 可以用来连接两个容器，使得源容器（被链接的容器）和接收容器（主动去链接的容器）之间可以互相通信，并且接收容器可以获取源容器的一些数据，如源容器的环境变量。

这种方式官方已不推荐使用，并且在未来版本可能会被移除。

### 自定义网络
从 Docker 1.10 版本开始，docker daemon 实现了一个内嵌的 DNS server，使容器可以直接通过容器名称通信。方法很简单，只要在创建容器时使用 --name 为容器命名即可。
但是使用 Docker DNS 有个限制：只能在 user-defined 网络中使用。也就是说，默认的 bridge 网络是无法使用 DNS 的，所以我们就需要自定义网络。

通过 docker network create 命令可以创建自定义网络模式

        docker network create custom_network

值得注意的是，网络名称是网络名称，网络驱动是网络驱动。
```
[root@k8s-master ~]# docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
45e8ad7f7bb7   bridge    bridge    local
4838faec03a5   host      host      local
2996516fd1e1   none      null      local
```

通过自定义网络模式 custom_network 创建容器：

    docker run -di --name bbox05 --net custom_network busybox


通过 docker network connect 网络名称 容器名称 为容器连接新的网络模式。

    docker network connect bridge bbox05

通过 docker network disconnect 网络名称 容器名称 命令断开网络。

    docker network disconnect custom_network bbox05

通过 docker network rm 网络名称 命令移除自定义网络模式

    docker network rm custom_network

### 容器间网络通信

容器之间要互相通信，必须要有属于同一个网络的网卡。

从 Docker 1.10 版本开始，docker daemon 实现了一个内嵌的 DNS server，使容器可以直接通过容器名称通信。方法很简单，只要在创建容器时使用 --name 为容器命名即可。

先基于 bridge 网络模式创建自定义网络 custom_network，然后创建两个基于自定义网络模式的容器。

```sh
docker run -di --name custom_bbox01 --net custom_network busybox
docker run -di --name custom_bbox02 --net custom_network busybox
```

具体 IP 和容器名称进行网络通信:

    ping 172.19.0.3
    ping custom_bbox02
    
效果是一样的
