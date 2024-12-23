# centos7.9搭建kafka集群
## Linux基础配置
```sh
# 确保页面联通阿里云：
ping mirrors.aliyun.com
# 备份官方的原yum源的配置：
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
# 下载Centos-7.repo文件
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo

```
``` sh
清除及生成缓存。
# 清除yum缓存
yum clean all
# 缓存阿里云源
yum makecache
# 测试阿里云源 
yum list
# 更新本安装包：
yum update
```

## 调整时区
```sh
# 查看当前时间同步服务器
chronyc sources
# 设置时区
timedatectl set-timezone Asia/Shanghai
```

## 安装JDK（kafka依赖）

```sh
# 下载rpm安装包
# 此地址不通
# wget https://download.oracle.com/java/17/latest/jdk-17_linux-x64_bin.rpm

wget https://download.oracle.com/java/17/archive/jdk-17.0.12_linux-x64_bin.rpm
# 上传安装包到集群中其他机器
scp jdk-17_linux-x64_bin.rpm root@10.139.203.35:/root
# 安装
sudo yum -y install ./jdk-17_linux-x64_bin.rpm
# 测试
java --version
```

## 下载kafka 并分发到节点机器

```sh
# 下载
wget https://downloads.apache.org/kafka/3.9.0/kafka_2.13-3.9.0.tgz
# 分发
scp kafka_2.13-3.9.0.tgz root@172.16.109.55:/root
# 分发
scp kafka_2.13-3.9.0.tgz root@172.16.109.56:/root
# 解压
tar -zxvf kafka_2.13-3.9.0.tgz

```

## 安装配置kafka

### 准备工作(数据存储位置、防火墙配置)
以下脚本的执行在kafka的bin目录
```sh
# 创建kafka数据目录如下:分别存储数据、日志、元数据
/mnt/myxfs/kafka/data
/mnt/myxfs/kafka/logs
/mnt/myxfs/kafka/meta

# 生成一个唯一的集群 ID（在任意一台服务器上执行）：
/opt/kafka/bin/kafka-storage.sh random-uuid
# 输出结果
8-OGSgPVQ7y9uxF_MLxqSg

# 防火墙配置：
# 确保开放必要的端口（9092 和 9093）：

firewall-cmd --add-port=9092/tcp --permanent
firewall-cmd --add-port=9093/tcp --permanent
firewall-cmd --reload
```

### 配置修改
```sh
# 修改配置文件
# 由于使用 kraft 模式启动，所以只需要修改/config/kraft 下的server.properties 文件

# 修改id,（每台机器均不相同）
node.id=1

# 角色配置，默认配置是有的，如果没有一定要加上
process.roles=broker,controller

# 增加选举者（每台机器都一样，根据机器所在的ip）
controller.quorum.voters=1@172.16.109.54:9093,2@172.16.109.55:9093,3@172.16.109.56:9093

# 监听配置 （每台机器根据自己所处的ip）
listeners=PLAINTEXT://172.16.109.54:9092,CONTROLLER://172.16.109.54:9093
advertised.listeners=PLAINTEXT://172.16.109.54:9092,CONTROLLER://172.16.109.54:9093

# 日志配置（根据实际需要存储日志的地方）
log.dirs=/mnt/myxfs/kafka/data
metadata.log.dir=/mnt/myxfs/kafka/meta
kafka.logs.dir=/mnt/myxfs/kafka/logs

# 其他配置保持默认，或者根据需要进行优化

```


### 启动kafka
```sh
# 格式化元数据存储（如未执行过）
# 一定要从kraft 目录下启动配置文件
./kafka-storage.sh format -t 8-OGSgPVQ7y9uxF_MLxqSg -c /root/kafka_2.13-3.9.0/config/kraft/server.properties

# 启动服务
# 一定要从kraft 目录下启动配置文件
./kafka-server-start.sh -daemon /root/kafka_2.13-3.9.0/config/kraft/server.properties

# 如果要停止服务，执行命令
./kafka-server-stop.sh

```
### 测试

```sh

#创建主题
./kafka-topics.sh --create --topic test-topic --partitions 3 --replication-factor 2 --bootstrap-server 172.16.109.54:9092

# 查看节点
./kafka-broker-api-versions.sh --bootstrap-server 172.16.109.54:9092

# 查看主题
./kafka-topics.sh --bootstrap-server 172.16.109.54:9092 --describe

# 启动生产者
./kafka-console-producer.sh --topic test-topic --bootstrap-server 172.16.109.54:9092

# 启动消费者（另一台机器）
./kafka-console-consumer.sh --topic test-topic --from-beginning --bootstrap-server 172.16.109.55:9092

# 生产者输入数据，消费者会接收到：
[root@localhost bin]# ./kafka-console-producer.sh --topic test-topic --bootstrap-server 172.16.109.54:9092
>123
>456
>789

# 消费者输出数据：
[root@localhost bin]# ./kafka-console-consumer.sh --topic test-topic --from-beginning --bootstrap-server 172.16.109.55:9092
123
456
789

```

## 设置开机自启动
创建 Kafka 的 systemd 服务文件 /etc/systemd/system/kafka.service：

**注意： 三台机器均需增加以下内容**

```sh
[Unit]
Description=Apache Kafka Server
After=network.target

[Service]
#User=kafka
#Group=kafka
ExecStart=/root/kafka_2.13-3.9.0/bin/kafka-server-start.sh /root/kafka_2.13-3.9.0/config/kraft/server.properties
ExecStop=/root/kafka_2.13-3.9.0/bin/kafka-server-stop.sh
Restart=on-failure
LimitNOFILE=100000

[Install]
WantedBy=multi-user.target
```
启用并启动：

```sh
sudo systemctl daemon-reload
sudo systemctl enable kafka
sudo systemctl start kafka
# 可以测试一下重启后是否自动启动
# 上述文件使用root用户启动kafka，如果需要使用kafka用户启动，需要自行配置kafka用户和对应目录权限。
```
## 调整文件句柄限制
**注意**

使用systemd启动时的Linux，在kafka的service中已经配置了最大文件句柄LimitNOFILE=100000,无需加入下述配置
```sh
# 修改 /etc/security/limits.conf：
kafka  -  nofile  100000
```

或者

```sh
# 根据实际配置文件格式调整
kafka  soft  nofile  100000
kafka  hard  nofile  100000
```

## 检查配置是否生效
```sh
# 获取 Kafka 服务对应的 Java 进程 ID
pidof java

# 查看
cat /proc/<PID>/limits | grep "Max open files"

# 输出
[root@localhost bin]# cat /proc/1193/limits | grep "Max open files"
Max open files            100000               100000               files
```
这样的输出已经证明文件句柄限制成功生效。



## QA 为什么需要调整文件句柄限制？
Kafka 是一个分布式消息队列，运行时需要管理大量的文件（如日志文件、分区文件等）。默认的文件句柄限制通常较低（例如 1024 或 4096），可能不足以满足 Kafka 的需求，从而导致以下问题：

- 出现 "Too many open files" 错误。
- Kafka 服务运行不稳定或崩溃。

通过将 nofile 设置为较高的值（如 100,000），可以确保 Kafka 能够正常运行，尤其是在高负载的生产环境中。