## harbor启用https

使用ip地址启用https协议访问harbor


### 创建目录
```sh
mkdir /root/cert
cd /root/cert/
```

### 生成 CA 证书

```sh
# 生成 CA 证书私钥
openssl genrsa -out ca.key 4096

# 生成 CA 证书
openssl req -x509 -new -nodes -sha512 -days 3650 \
 -subj "/C=CN/ST=Beijing/L=Beijing/O=example/OU=Personal/CN=10.139.203.31" \
 -key ca.key \
 -out ca.crt


# 生成 Server 私钥
openssl genrsa -out server.key 4096

# 生成 Server 证书签名请求
openssl req -sha512 -new \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=example/OU=Personal/CN=10.139.203.31" \
    -key server.key \
    -out server.csr

# 生成 x509 v3 扩展文件
cat > v3.ext <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = IP:10.139.203.31
EOF

# 使用 CA 证书签发 Server 证书
openssl x509 -req -sha512 -days 3650 \
    -extfile v3.ext \
    -CA ca.crt -CAkey ca.key -CAcreateserial \
    -in server.csr \
    -out server.crt

# 转换 server.crt 为 server.cert
openssl x509 -inform PEM -in server.crt -out server.cert


```
测试目录下应有下列文件：
```sh
[root@localhost cert]# ll
total 32
-rw-r--r--. 1 root root 2033 Jun 19 14:36 ca.crt
-rw-r--r--. 1 root root 3243 Jun 19 14:33 ca.key
-rw-r--r--. 1 root root   17 Jun 19 14:43 ca.srl
-rw-r--r--. 1 root root 2053 Jun 19 14:47 server.cert
-rw-r--r--. 1 root root 2053 Jun 19 14:43 server.crt
-rw-r--r--. 1 root root 1708 Jun 19 14:39 server.csr
-rw-r--r--. 1 root root 3243 Jun 19 14:36 server.key
-rw-r--r--. 1 root root  205 Jun 19 14:40 v3.ext

```


### docker证书配置
```sh
mkdir -p /etc/docker/certs.d/10.139.203.31
cp server.cert /etc/docker/certs.d/10.139.203.31
cp server.key /etc/docker/certs.d/10.139.203.31
cp ca.crt /etc/docker/certs.d/10.139.203.31

# 重启 Docker Engine
systemctl restart docker
```

### Harbor 证书配置
```sh
mkdir -p /data/cert
cp server.crt /data/cert/
cp server.key /data/cert/

```

配置文件
```sh
# http related config
# http:
  # port for http, default is 80. If https enabled, this port will redirect to https port
  # port: 80

# https related config
https:
  # https port for harbor, default is 443
  port: 443
  # The path of cert and key files for nginx
  certificate: /data/cert/server.crt
  private_key: /data/cert/server.key
  # enable strong ssl ciphers (default: false)
  # strong_ssl_ciphers: false

```

```sh
# 执行脚本
./prepare
# 删除容器
docker-compose down -v
# 重新启动容器
docker-compose up -d
```

参考链接：
https://cloud.tencent.com/developer/article/1865259