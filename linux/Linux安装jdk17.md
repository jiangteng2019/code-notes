## Linux安装jdk17

```sh
# 下载安装包
# 本机下载，远程服务无法连接公网
wget https://download.oracle.com/java/17/latest/jdk-17_linux-x64_bin.rpm
# 上传安装包
scp jdk-17_linux-x64_bin.rpm root@10.139.203.35:/root
# 安装
sudo yum -y install ./jdk-17_linux-x64_bin.rpm


```