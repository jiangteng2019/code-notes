## centos安装docker-compose

```sh
# github上下载对应的版本和操作系统、硬件的二进制发行包:
https://github.com/docker/compose/releases/tag/v2.27.1

# 辅复制到该文件夹，并重命名为docker-compose
/usr/local/bin/docker-compose

# 设置权限
chmod +x /usr/local/bin/docker-compose

# 创建软连接
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# 测试
docker-compose version
```
