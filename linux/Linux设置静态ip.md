## Linux设置静态ip

在VMware中的CentOS系统中设置静态IP地址的步骤如下:

1. 打开终端窗口,使用root权限编辑网卡配置文件:

```
sudo vi /etc/sysconfig/network-scripts/ifcfg-enp0s3
```

注意:enp0s3是示例网卡名称,您的网卡名可能不同,可用`ip addr`命令查看。

2. 找到`BOOTPROTO`这一行,将它的值改为static。

```
BOOTPROTO=static
```

3. 添加或修改以下几行:

```
IPADDR=192.168.1.100  # 设置静态IP
NETMASK=255.255.255.0 # 子网掩码
GATEWAY=192.168.1.1 # 网关IP
DNS1=8.8.8.8 # 首选DNS
DNS2=8.8.4.4 # 备用DNS
```

上面的IP地址全是示例,您需要根据实际网络情况修改。

4. 保存并退出vi编辑器。

5. 重启网络服务使设置生效:

```
sudo systemctl restart network
```

6. 检查IP地址是否已正确设置:

```
ip addr
```

完成以上步骤后,CentOS系统就应该使用了指定的静态IP地址了。如果设置不生效,可重新检查配置文件是否有错误。
