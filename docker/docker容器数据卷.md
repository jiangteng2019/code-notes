## docker容器数据卷

docker中存在多种挂载数据卷的方法：

### 1、创建容器时直接使用命令挂载：

```
docker run -it --name="centos01" -v /home/docker-centos:/home centos
```

将宿主机目录/home/docker-centos 挂载到 /home

### 2、匿名挂载

```
docker run -d -P --name nginx01 -v /etc/nginx nginx
```

系统会随机在指定的文件夹下创建一个文件夹 容器的/etc/nginx 目录

### 3、具名挂载

首先创建数据卷,创建容器的时候指定数据卷

```
docker create volume nginx-data
docker run -d -P --name nginx02 -v nginx-data:/etc/nginx nginx
```

### 4、数据卷容器

docker --volumes-from 命令用于在运行容器时共享另一个容器的卷（Volumes）。

具体来说，当你使用 docker run 命令创建一个新容器时，可以通过 --volumes-from 参数指定另一个已经存在的容器的名称或 ID，这样新容器就可以访问并共享该已存在容器中的卷。

```sh
# 创建一个nginx容器
docker run -it --name nginx1 -v /root:/root nginx /bin/bash

# 新建一个容器 nginx1;
docker run -it --name nginx2 --volumes-from nginx1 nginx /bin/bash

# 现在宿主机、nignx1容器、nginx2容器的 /root 文件夹可以同步改变数据了

```
