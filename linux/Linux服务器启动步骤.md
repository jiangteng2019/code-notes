## Linux服务器启动步骤

### linux系统的启动步骤为：

1. 通电
1. BIOS启动
1. 主引导记录
1. 操作系统
1. 加载内核文件(/boot)
1. 初始化init进程（init进程是系统启动的第一个进程，用于初始化系统环境，pid为1 ，所有的进程都由其衍生，都是它的子进程）
1. 确定系统的运行级别，linux预置7种级别（0-6），0是关机，1是单用户模式，6是重启。系统从/etc/inittab 文件中确定当前的运行级别。initdefault的值是2，表明系统启动时的运行级别为2。每一个运行级别都对应一个启动目录

    /etc/rc0.d
    /etc/rc1.d
    /etc/rc2.d
    /etc/rc3.d
    /etc/rc4.d
    /etc/rc5.d
    /etc/rc6.d

系统启动时运行级别是2，意味着会从/etc/rc2.d 文件夹中启动里面的程序。同时/etc/rc2.d程序全部为链接，实际运行程序在/etc/init.d文件夹中。用于解决同一个程序多个副本在运行级别启动文件夹中，系统启动多个运行级别会启动重复的程序的问题。

文件名都是"字母S+两位数字+程序名"的形式。字母S表示Start，也就是启动的意思（启动脚本的运行参数为start），如果这个位置是字母K，就代表Kill（关闭）

```sh
[root@ls-8ob7vltm etc]# cd /etc/rc0.d/
[root@ls-8ob7vltm rc0.d]# ls -l
total 0
lrwxrwxrwx  1 root root 15 Dec 28  2022 K05jexec -> ../init.d/jexec
lrwxrwxrwx. 1 root root 19 May  7  2022 K50bcm-agent -> ../init.d/bcm-agent
lrwxrwxrwx. 1 root root 20 Jan 26  2021 K50netconsole -> ../init.d/netconsole
lrwxrwxrwx. 1 root root 17 May  7  2022 K88hosteye -> ../init.d/hosteye
lrwxrwxrwx. 1 root root 17 Jan 26  2021 K90network -> ../init.d/network

```

```bash
[root@ls-8ob7vltm rc0.d]# cd /etc/rc2.d/
[root@ls-8ob7vltm rc2.d]# ls -l
total 0
lrwxrwxrwx. 1 root root 20 Jan 26  2021 K50netconsole -> ../init.d/netconsole
lrwxrwxrwx. 1 root root 17 Jan 26  2021 S10network -> ../init.d/network
lrwxrwxrwx. 1 root root 17 May  7  2022 S12hosteye -> ../init.d/hosteye
lrwxrwxrwx. 1 root root 19 May  7  2022 S50bcm-agent -> ../init.d/bcm-agent
lrwxrwxrwx  1 root root 15 Dec 28  2022 S95jexec -> ../init.d/jexec

```

初始化程序之后，用户就可以登录。
