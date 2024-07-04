## Linux与宿主机共享文件夹

1. 在VMware中启用共享文件夹位置在： 虚拟机-设置-选项-共享文件夹，设置到对应的文件夹

1. 在虚拟机中执行命令

```
vmware-hgfsclient
```

1. 查看

```
cd /mnt/hgfs/share
```

可以看到文件

```
[root@k8s-master share]# pwd
/mnt/hgfs/share
```
