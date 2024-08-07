## Linux中的数据卷

Linux系统中出现很多看似独立磁盘设备的主要原因是Linux对存储的管理方式与Windows有较大区别。

在Windows系统中,确实是在初始化时直接将物理硬盘分区为C、D、E等逻辑分区,它们对应着实际的磁盘空间区块。而在Linux系统中,存储管理更加灵活和抽象:

1. 逻辑卷管理(LVM)
   Linux允许在多个底层物理磁盘之上创建逻辑卷组,然后在卷组上划分出多个逻辑卷,每个逻辑卷就相当于一个独立的磁盘设备。这就像给硬件资源做了一层虚拟化。

2. 文件系统层次
   上层的文件系统只关心通过逻辑卷获得的这些磁盘设备,而不关心它们的底层硬件细节。因此单个磁盘会被拆分成多个独立的逻辑卷供上层使用。

3. 内核虚拟文件系统
   Linux还有像tmpfs这种完全驻留在内存的虚拟文件系统,以及用于存储kernel和模块信息的sysfs、procfs等。它们看上去也像是磁盘设备。

4. 容器/虚拟机存储层
   诸如overlay、device mapper等存储驱动会为容器创建多层存储资源,每层对应一种磁盘设备。

所以在Linux世界里,磁盘已经不再是简单的物理存储块的映射,而是无数个逻辑存储资源的高度抽象。这增加了灵活性,但也引入了更多间接层,造成了您所观察到的现象。但底层物理磁盘数量并未改变。

使用df命令列出来的大部分"磁盘"设备实际上都是逻辑卷,而不是物理磁盘。

df -Th输出:

```
/dev/mapper/centos-root   xfs        47G   6.7G   41G  15% /
/dev/sda1                 xfs      1014M   184M  831M  19% /boot
```

这两项分别对应:

1. /dev/mapper/centos-root - 这是通过LVM(逻辑卷管理)创建的逻辑卷设备,供根文件系统"/"使用。

2. /dev/sda1 - 这是物理磁盘sda的第一个分区,用作/boot分区。

其余的则大部分都是临时存储或容器层,例如:

```
overlay                   overlay    47G   6.7G   41G  15% /run/...
tmpfs                     tmpfs     3.6G    12K  3.6G   1% /var/lib/kubelet/...
```

所以,我们可以看到绝大部分被df命令列出的"磁盘"都不是实际的物理磁盘设备,而是各种形式的逻辑卷、临时存储等,这些都是通过Linux内核各种存储功能组合构建出来的虚拟化设备。

只有少数设备如/dev/sda1等,是直接对应磁盘分区。但无论哪一种,在文件系统的视角里它们都是无所谓的存储设备而已。

这种高度抽象和虚拟化的存储管理模式,赋予了Linux更高的灵活性和资源利用能力。
