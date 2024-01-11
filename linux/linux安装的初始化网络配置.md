## linux安装的初始化网络配置

1. 修改DNS服务器

```sh
# 到/etc目录下配置resolv.conf加入nameserver IP,如： 
nameserver 8.8.8.8 
nameserver 8.8.4.4 
search localdomain 
```

1. 启用网络连接

```sh
sudo vi /etc/sysconfig/network-scripts/ifcfg-ens33
# 修改配置ONBOOT=no----->ONBOOT=yes
# wq保存退出
# 重启网络服务
service network restart
```
1. 配置阿里云源

```sh
# 备份官方的原yum源的配置
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup

# 下载Centos-7.repo文件

wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo

# 或者
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo

#清除及生成缓存。
yum clean all
yum makecache
yum list

```