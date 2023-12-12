## 搭建一个kafka继续，不依赖zookeeper服务

同样是使用docker-compose启动，几经摸索，顺利产出了如下配置:
[docker-compose](./docker-compose.yml)

需要注意：
1. 由于docker容器内部网络不互通，docker-compose文件需要配置network，并且需要为每个容器指定固定的IP。

1. kafka默认的消息端口是9092，9093是控制器选举端口，因此9093端口不需要端口映射、9092端口需要映射宿主机端口进行消息投递与订阅服务。

1. 在配置选举者网络的时候需要使用指定的容器IP(172.19.0.3 ...)。不可以使用本机回环地址(127.0.0.1)。

如果顺利的话，运行docker-compose up -d 会启动三台docker，并运行kafka服务。使用命令
```
docker exec -it [容器name] /bin/bash
```
kafka集群内部会“屏蔽”内部kafka服务的IP的区别，因此可以在任意一台容器内，向集群内部的任意一个机器投递消息，并且在集群任意一台机器上订阅任意另一台机器上的消息，均可以收到完整的消息。即kafka集群，对于使用者来说只有topic主题区别。当然最好是一一对应上。


Kafka 集群能够在任意节点上发送和订阅消息的能力，主要得益于它的设计和架构。下面是 Kafka 集群工作原理的概述以及如何配置生产者和消费者：

##   Kafka 集群的工作原理
- 分区（Partitions）：

Kafka 的主要存储和处理单元是 topic 的分区。每个 topic 可以分割成多个分区。
分允许 Kafka 并行处理数据，增加吞吐量。
- 副本（Replicas）：

每个分区可以有多个副本，分布在不同的 Kafka broker 上。
副本的存在提供了数据冗余和高可用性。
- 生产者（Producers）：

生产者将消息发送到指定的 topic。
Kafka 生产者客户端会自动确定哪个分区和哪个 broker 接收特定消息。
- 消费者（Consumers）：
消费者从 topic 读取消息。
Kafka 消费者可以从集群中的任意 broker 读取数据。
负载均衡和高可用性：

Kafka 集群通过在 brokers 之间分配不同分区的副本来实现负载均衡。
如果一个 broker 失败，其他 broker 可以接管其角色。
### 生产者和消费者的配置
- 生产者配置：

生产者只需配置 Kafka 集群的一个或多个 broker 的地址（即 bootstrap-server）。
Kafka 客户端库会自动处理与特定分区和 broker 的连接。
- 消费者配置：

消费者配置与生产者类似，指定 bootstrap-server 为 Kafka 集群中的一个或多个 broker 地址。
消费者通过这些地址发现整个集群，并从指定的 topic 读取消息。
- 分区和复制因子：

当创建 topic 时，可以指定分区数量和复制因子。
分区数量决定了并发读写的能力，而复制因子决定了数据的可靠性和可用性。


### 在kafka中配置bootstrap servers时，应该配置几个节点的ip？
在Kafka中，使用bootstrap servers列表配置生产者和消费者时，通常推荐提供多个broker的信息，而不是单个broker的IP。这样做的好处包括：

1. **容错性**：如果你只配置了一个broker的IP，而这个broker不可用了（无论是因为网络问题、硬件故障还是维护），那么生产者和消费者都将无法连接到Kafka集群。如果你配置了多个broker的IP，即使其中一个broker宕机，客户端仍然可以连接到集群中的其他broker。

2. **负载均衡**：当客户端启动时，它会从提供的bootstrap servers列表中选择一个broker并与之建立连接，然后获取集群的元数据信息（包括所有broker的信息和topic的分区信息）。如果所有客户端都只配置了同一个broker的IP，那么这个broker在启动时将会遭受所有客户端连接的冲击，可能会导致不必要的负载。而配置多个broker可以在一定程度上分散这种初始连接时的压力。

3. **集群感知**：提供多个broker的IP可以让客户端更好地了解整个集群的状态，当集群中的broker发生变化时（比如新的broker加入或者现有的broker退出），客户端可以更加灵活地处理这些变化。

性能方面，配置多个broker的IP并不会直接提高生产者或消费者的性能，因为Kafka的生产和消费性能主要受到分区数、副本因子、网络带宽、broker性能、生产者和消费者配置等因素的影响。但是，从高可用性的角度来看，配置多个broker的IP会让你的Kafka客户端在面对集群中个别节点故障时更加健壮。

因此，建议在配置生产者和消费者时提供多个broker的IP地址，以确保最佳的可用性和稳定性。这并不是说配置单个broker的IP不能工作，而是在实际生产环境中，为了避免单点故障，推荐配置多个broker的IP。

## 常用的消息交互脚本
```sh
#创建topic
kafka-topics.sh --create --topic t1 --bootstrap-server 172.19.0.3:9092 --partitions 3 --replication-factor 3

#发送消息
kafka-console-producer.sh --topic t1 --bootstrap-server 172.19.0.3:9092

#消费消息
kafka-console-consumer.sh --topic t1 --bootstrap-server 172.19.0.3:9092 --from-beginning

#查看topic列表
kafka-topics.sh --list --bootstrap-server 172.19.0.3:9092

#检查topic
kafka-topics.sh --describe --topic t1 --bootstrap-server 172.19.0.3:9092

#删除topic
kafka-topics.sh --bootstrap-server 172.19.0.3:9092 --delete --topic t1,test1
```

## bootstrap.servers配置
`bootstrap.servers`是Kafka生产者和消费者配置的一个重要参数。这个参数的值是一个或多个Kafka broker的地址列表，格式为`host1:port1,host2:port2,...`。这个列表的作用是提供一个初始的端点，让生产者和消费者能够连接到Kafka集群。

当生产者或消费者启动并尝试连接到Kafka集群时，它们会使用`bootstrap.servers`列表中的地址来建立连接。一旦连接到集群，客户端就会获取到集群的所有broker信息，包括那些没有在`bootstrap.servers`列表中的broker。这意味着`bootstrap.servers`列表不需要包含集群中的所有broker，只需要包含足够的broker来建立初始连接即可。

这个参数的主要目的是提供一个初始的、可用的连接点，以便客户端能够找到并连接到Kafka集群。一旦连接建立，客户端就会从集群中获取完整的broker列表，以便在后续的操作中进行负载均衡和故障转移。

在实际使用中，为了提高可用性和容错性，通常推荐在`bootstrap.servers`列表中提供多个broker的地址。这样，即使列表中的某个broker不可用，客户端仍然可以连接到其他可用的broker。

需要注意的是，尽管`bootstrap.servers`列表中的broker不需要是集群中的所有broker，但是如果列表中的所有broker都不可用，那么客户端将无法连接到Kafka集群。因此，这个列表应该包含足够多的broker，以确保在某些broker不可用时，客户端仍然可以连接到集群。