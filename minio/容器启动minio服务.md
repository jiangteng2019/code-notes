# 容器启动minio服务

## 下载镜像
```
docker pull docker.m.daocloud.io/minio/minio
```

## 启动
```
docker run -d -p 9000:9000 -p 9001:9001 --name minio  -e "MINIO_ROOT_USER=root" -e "MINIO_ROOT_PASSWORD=GeeSpace1234"  minio/minio server /data --console-address ":9001"

```