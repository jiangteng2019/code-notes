# Linux分区格式化挂载硬盘

## 注意

在分区之前，需要确认磁盘大小，和磁盘的分区表类型，如果磁盘空间大于2T，则必须要使用GPT分区表，再进行格式化、挂载。

## 如何查看当前使用的分区表

```sh
# 使用命令
parted /dev/vdb print
```

```sh
[root@localhost ~]# parted /dev/vdb print
Model: Virtio Block Device (virtblk)
Disk /dev/vdb: 4398GB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags:

Number  Start  End  Size  File system  Name  Flags

```



上面的Partition Table: gpt则标识当前使用GPT，如果是Partition Table: msdos，为MBR类型。
- gpt 表示磁盘使用的是 GPT 分区表。
- msdos 表示磁盘使用的是 MBR 分区表。



## 如何更改分区表类型为GPT
```sh
# 查看当前磁盘情况
lsblk
# 找到需要分区的磁盘 /dev/vdb

# 使用 parted 工具对磁盘进行操作：
parted /dev/vdb

# 在 parted 的交互环境中输入以下命令：
mklabel gpt

# 退出
quit

这将把磁盘的分区表格式更改为 GPT。
```


## GPT分区表下的磁盘分区、格式化、挂载
```sh
# 启动 parted, 将/dev/vdb 替换为你的目标磁盘
parted /dev/vdb 

# 创建分区
# 文件系统类型仍可以使用 ext4 或 xfs，但这只是一个标签，不会实际格式化分区。命令如下：
mkpart primary xfs 0% 100%

# 退出
quit

# 退出 parted 后，使用以下命令将新创建的分区格式化为 XFS：
mkfs.xfs /dev/vdb

# 出现该信息需要使用-f参数

mkfs.xfs: /dev/vdb appears to contain a partition table (gpt).
mkfs.xfs: Use the -f option to force overwrite.

# 继续使用命令 
mkfs.xfs -f /dev/vdb

[root@localhost ~]# mkfs.xfs -f /dev/vdb
meta-data=/dev/vdb               isize=512    agcount=4, agsize=268435455 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=1        finobt=0, sparse=0
data     =                       bsize=4096   blocks=1073741820, imaxpct=5
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0 ftype=1
log      =internal log           bsize=4096   blocks=521728, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0

# 创建挂载点：
sudo mkdir -p /mnt/myxfs

# 挂载分区：
sudo mount /dev/vdb /mnt/myxfs

# 验证挂载：
df -h | grep /mnt/myxfs

# 设置自动挂载（重要，重启后需要自动挂载）

# 编辑 /etc/fstab 文件，添加以下内容以在启动时自动挂载：
/dev/vdb  /mnt/myxfs  xfs  defaults  0  0

# 或者使用命令：
echo "/dev/vdb /mnt/myxfs xfs defaults 0 0" >> /etc/fstab

# 现在查看磁盘情况：
df- ah
debugfs                     0     0     0    - /sys/kernel/debug
hugetlbfs                   0     0     0    - /dev/hugepages
/dev/vda1               1014M  204M  811M  21% /boot
/dev/mapper/centos-home  142G   33M  142G   1% /home
tmpfs                    6.3G     0  6.3G   0% /run/user/0
systemd-1                   -     -     -    - /proc/sys/fs/binfmt_misc
binfmt_misc                 0     0     0    - /proc/sys/fs/binfmt_misc
/dev/vdb                 4.0T   33M  4.0T   1% /mnt/myxfs

```


## MBR分区表下的磁盘分区、格式化、挂载
```sh
# 使用
fdisk /dev/vdb
```

如果出现下述警告，必须使用GPT分区表，操作如上：

> WARNING: The size of this disk is 4.4 TB (4398046511104 bytes). DOS partition table format can not be used on drives for volumes larger than (2199023255040 bytes) for 512-byte sectors. Use parted(1) and GUID partition table format (GPT).

如果出现下述警告，表明使用fdisk命令分区GPT格式的分区表是有风险，分区应使用mkpart命令，参考上述内容。
> WARNING: fdisk GPT support is currently new, and therefore in an experimental phase. Use at your own discretion.

使用fdisk工具对vdb进行分区。
```sh
fdisk /dev/vdb
```
在交互式界面中：

1. 输入n，创建一个新分区。
1. 选择p（主分区）。
1. 按回车，使用默认的分区号（通常是1）。
1. 再次按回车，使用默认的起始扇区。
1. 按回车，使用默认的结束扇区以分配整个磁盘空间。
1. 输入w，保存并退出。
1. 完成后，运行以下命令确认分区是否成功：

```sh
lsblk
# 输出中应出现类似于：
# 出现上面4T下面2T的是因为这是使用MBR分区表的4T硬盘，只能识别2T的空间。
vdb             252:16   0     4T  0 disk
└─vdb1          252:17   0     2T  0 part

# 对新分区/dev/vdb1创建文件系统（如xfs）：
mkfs.xfs /dev/vdb1

# 对新分区/dev/vdb1创建文件系统（如ext4）：
# mkfs.ext4 /dev/vdb1

# 创建挂载点：
mkdir /mnt/newdisk

# 挂载新分区：
mount /dev/vdb1 /mnt/newdisk

# 验证挂载是否成功：
df -h

# 应显示类似以下的内容：
Filesystem      Size  Used Avail Use% Mounted on
/dev/vdb1        4T   1M   4T   0% /mnt/newdisk

# 配置开机自动挂载
# 编辑/etc/fstab文件，使分区在系统启动时自动挂载：
echo '/dev/vdb1 /mnt/newdisk ext4 defaults 0 0' >> /etc/fstab

```