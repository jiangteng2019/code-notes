# 镜像操作(以Nginx为例):

搜索docker镜像，有official标志的是官方镜像：

```
docker search nginx
```

下载镜像到本地:

```
docker pull nginx
```

查看本地已下载的镜像列表:

```
docker images
```

删除本地nginx镜像:

```
docker rmi nginx
```

# 容器操作

新建一个容器(不同于镜像操作的简单命令，启动容器需要输入相关参数)：

```
docker run -it --name nginx nginx /bin/bash
```

    -it 参数用于启动容器后，连接容器并提供一个交互式的终端
    --name 用于设置容器别名nginx
    nginx 为镜像名称
    /bin/bash 为其指定一个shell
    实际上新建一个容器会有更多的参数，不难发现，上述的nginx镜像在宿主机是无法访问，因此还需要加入端口映射参数，另外容器的文件也是隔离的，宿主机无法访问，因此还需要挂在数据卷，这些需配置更多参数。

退出容器，并停止容器:

```
exit
```

同上，退出容器并停止容器:

```
Ctrl+D
```

退出终端，但容器运行不会停止:

```
Ctrl+P Ctrl+Q
```

查看所有容器列表:

```
docker ps -a
```

查看正在运行的容器列表:

```
docker ps
```

启动一个未运行容器:

```
docker start nginx
```

重启容器:

```
docker restart nginx
```

连接到容器，并提供交互式输入终端:

```
docker attach nginx
```

同上，不同是docker exec 使用exit退出，容器不会终止:

```
docker exec -it nginx /bin/bash
```

停止容器:

```
docker stop nginx
```

删除容器:

```
docker rm nginx
```

使用 docker exec 连接到容器，并提供交互式输入终端，不同的是docker exec 使用 exit 退出后，容器不会终止。另外在一些官方应用镜像中，使用attach无法连接，必须使用exec。

# 端口映射

从镜像创建容器时，通过-p参数 指定端口映射关系或者 -P随机映射端口。

```bash
// 使用 -p 80:80 指定端口映射，即将宿主机的80端口映射到容器的80端口。
docker run -it --name nginx1 -p 80:80 nginx

// 使用-P 参数，宿主机将使用随机端口映射到容器的80端口。
docker run -it --name nginx2 -P nginx
```

# 挂载数据卷

数据卷实际上就是宿主机的某个文件夹，通过参数配置，由容器和宿主机共同管理的文件系统。

如果使用nginx部署一个web应用，需要将打包好的静态资源文件放到nginx目录 /usr/share/nginx/html/下。容器是隔离的文件系统，宿主机无法直接访问，需要将文件夹挂载到容器的目录下，通过“共享”目录实现文件操作：

```
docker run -d --name nginx3 -v /usr/share/nginx/html/ -p 80:80 nginx
```

查看容器的详细信息:

```
docker inspect nginx3
```

宿主机的source文件夹对应的路径将会被挂载到容器的 /usr/share/nginx/html/ 目录，两者共享对该目录的读写。

指定文件夹挂载：上述宿主机的文件夹命名使用了容器的id，不够友好，还可以指定宿主机的目录作为容器的数据卷：

```
docker run -d --name nginx4 -v /root/test/:usr/share/nginx/html/ -p 80:80 nginx
```

# 数据卷容器

数据卷容器是一个专门用来管理数据卷的容器，该容器主要是供其他容器的引用和使用。

创建数据卷容器：

```
docker run -it -v /usr/share/nginx/html/ --name data debian
```

挂载数据卷：

```
docker run -d --volumes-from data -p 80:80 --name nginx5 nginx
```

data容器、nginx5容器、以及宿主机对应的source目录，共享了该文件夹的读写。

# 容器连接：

通过端口映射，可以实现宿主机到容器的端口访问。但容器之间的访问需要通过容器连接来指定：

# 最佳实践

## 从docker镜像启动mysql官方镜像：

```
docker run -di --name=mysql -p 13306:3306 -e MYSQL_ROOT_PASSWORD=password mysql
```

连接到启动的容器中：注意使用attach命令无法连接。

```
docker exec -it mysql /bin/bash
```
