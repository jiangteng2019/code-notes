## 搭建一个kafka服务

既然是简单搭建肯定是使用docker容器:

使用docker-compose直接拉取yml文件安装:

```
curl -sSL https://raw.githubusercontent.com/bitnami/containers/main/bitnami/kafka/docker-compose.yml > docker-compose.yml
docker-compose up -d
```

该命令会执行如下步骤

- 拉取文件
- 保存文件 docker-compose.yml 到当前文件夹
- docker-compose up -d 会在当前文件夹下搜索 docker-compose.yml 并运行 -d表示以守护进程方式运行容器，即在后台运行。

docker-compse 文件内容：

```yml
# Copyright VMware, Inc.
# SPDX-License-Identifier: APACHE-2.0

version: "2"

services:
  kafka:
    image: docker.io/bitnami/kafka:3.6
    ports:
      - "9092:9092"
    volumes:
      - "kafka_data:/bitnami"
    environment:
      # KRaft settings
      - KAFKA_CFG_NODE_ID=0
      - KAFKA_CFG_PROCESS_ROLES=controller,broker
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093
      # Listeners
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://:9092
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=PLAINTEXT
volumes:
  kafka_data:
    driver: local

```

使用docker ps 可以看到，kafka服务所在的容器已经启动，默认名为root-kafka-1
进入容器可以执行消息收发测试

```sh
docker exec -it root-kafka-1 /bin/bash
```

找到kafka服务脚本文件夹:
```sh
cd /opt/bitnami/kafka/bin/
```

启动生产者:
```sh
./kafka-console-producer.sh --broker-list localhost:9092 --topic test
```

另起一个终端，并启动消费者：
```sh
./kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test
```

在生产者控制台输入，可以再消费者终端上看到输出。

需要注意的是：3.0版本后的kafka服务不再依赖zookeeper服务。


> Apache Kafka Raft (KRaft) makes use of a new quorum controller service in Kafka which replaces the previous controller and makes use of an event-based variant of the Raft consensus protocol. This greatly simplifies Kafka’s architecture by consolidating responsibility for metadata into Kafka itself, rather than splitting it between two different systems: ZooKeeper and Kafka.

> Apache Kafka Raft（KRaft）在Kafka中使用了一个新的仲裁控制器服务，该服务取代了以前的控制器，并使用了Raft共识协议的基于事件的变体。这大大简化了Kafka的架构，将元数据的责任整合到Kafka本身，而不是将其分为两个不同的系统：ZooKeeper和Kafka