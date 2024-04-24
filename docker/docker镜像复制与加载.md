## docker镜像复制与加载
```sh
# 保存镜像为文件
docker save -o C:\Users\admin\kk.tar.gz keking/kkfileview

# 复制镜像到远程主机
scp .\kk.tar.gz root@10.139.203.35:/root

# 文件中恢复镜像
docker load < kk.tar.gz

# 运行kkfileview镜像
docker run -it -p 8012:8012 keking/kkfileview:4.1.0

```