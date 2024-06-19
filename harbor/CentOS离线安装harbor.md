## CentOS离线安装harbor

1. 首先下载harbor的安装包，然后解压，安装包在github上，下载地址：https://github.com/goharbor/harbor/releases

1. 假设你已经下载包harbor压缩包，并且已经上传到服务器,接下来解压安装包：
```bash
tar -zxvf harbor-offline-installer-v2.11.0.tgz
```

1. 进入harbor目录，先配置一下：
```sh
# 拷贝配置文件
cp harbor.yml.tmpl harbor.yml
# 修改配置文件harbor.yml
vi harbor.yml
# 注释掉关于https的配置，因为harbor默认是http的，如果要https的话，需要配置证书，这里我们先不配置

# https related config
# https:
  # https port for harbor, default is 443
  # port: 443
  # The path of cert and key files for nginx
  # certificate: /your/certificate/path
  # private_key: /your/private/key/path
  # enable strong ssl ciphers (default: false)
  # strong_ssl_ciphers: false

# 更改hostname地址，改为局域网地址即可
# The IP address or hostname to access admin UI and registry service.
# DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.
hostname: 10.139.203.31

# 执行安装
./install.sh

# 默认的登录账户与密码
Username: admin
Password: Harbor12345

```

### 注意：

由于https的配置比较复杂，这里先使用http协议进行访问。

harbor需要有docker环境的依赖，并且版本有对应的限制。
