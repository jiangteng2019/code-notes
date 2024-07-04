## linux安装的初始化网络配置

1. 修改DNS服务器

```sh
# 到/etc目录下配置resolv.conf加入nameserver IP,如：
nameserver 8.8.8.8
nameserver 8.8.4.4
search localdomain
```

1. 启用网络连接

````sh
sudo vi /etc/sysconfig/network-scripts/ifcfg-ens33
# 修改配置ONBOOT=no----->ONBOOT=yes
# wq保存退出
# 重启网络服务
service network restart
```system/etc
1. 配置阿里云源

```sh
# 备份官方的原yum源的配置
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup

# 下载Centos-7.repo文件

wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo

# 或者
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repoyum in

#清除及生成缓存。
yum clean all
yum makecache
yum list

````

## QA

### ifcfg-ens33 配置作用：

`/etc/sysconfig/network-scripts/ifcfg-ens33` 这个文件在Linux系统下主要用于配置网络接口ens33的网络参数。

其中:

-   `/etc/sysconfig/network-scripts/` 这个目录下存放着所有网络接口的配置文件。

-   `ifcfg-ens33` 表示对ens33这个网络接口进行配置。ens33通常是系统的主网卡。

这个配置文件里面可以包含诸如IP地址,网关,DNS服务器,子网掩码等网络参数。通过修改这个文件来配置ens33接口的网络属性。

举个例子,一个ifcfg-ens33文件内容可能如下:

```
DEVICE=ens33
TYPE=Ethernet
ONBOOT=yes
NM_CONTROLLED=yes
BOOTPROTO=static
IPADDR=192.168.1.100
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
DNS1=8.8.8.8
```

这个文件配置了ens33采用静态IP地址,指定了IP、子网掩码、网关等信息。通过这个文件可以方便地管理网络接口的配置。

### ONBOOT=yes解释

ONBOOT=yes 这个配置指示网络接口(此处为ens33)是否在系统启动时被启用和启动。

ONBOOT有两种可选值:

-   yes:表示该网络接口在系统启动时会被自动启用和启动。IP地址等配置会被自动应用。

-   no:表示该网络接口在系统启动时不会自动启用。需要手动启用或启动该网络接口。

所以 ONBOOT=yes 的含义是ens33网络接口将在系统启动过程中自动启动和启用。对应的网络参数如IP地址、网关等也会自动生效。

这可以确保系统启动后,ens33网卡可以自动获取IP,从而启动网络服务和联网。是Linux系统中一个常用的基本网络配置。

将ONBOOT设置为yes可以避免系统启动后还需要额外手动配置或启用网卡的步骤,方便网络的自动运行。
