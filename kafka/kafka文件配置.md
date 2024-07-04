## kafka文件配置

```sh
# 启用KRaft模式，KRaft是一种复制协议，用于实现Kafka的高可用性和持久性。
KAFKA_ENABLE_KRAFT=yes

# 定义Kafka容器的角色，包括broker（代理）和controller（控制器）。
KAFKA_CFG_PROCESS_ROLES=broker,controller

# 定义控制器监听器的名称。
KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER

# 定义Kafka容器监听的网络地址和端口号，其中PLAINTEXT表示普通的文本协议。
KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093

# 定义监听器和安全协议之间的映射关系。
KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT

# 定义Kafka容器向外部客户端公布的网络地址和端口号。
KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://127.0.0.1:9092

# 定义Kafka代理的唯一标识符，每个代理在集群中都应具有唯一的ID。
KAFKA_BROKER_ID=3

# 定义KRaft集群的唯一标识符。
KAFKA_KRAFT_CLUSTER_ID=LelM2dIFQkiUFvXCEcqRWA

# 定义控制器的选举投票者列表，包括每个投票者的ID和网络地址。
KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@172.19.0.1:9093,2@172.19.0.2:9093,3@172.19.0.3:9093

# 允许使用普通文本协议进行监听。
ALLOW_PLAINTEXT_LISTENER=yes

# 定义Kafka节点的唯一标识符。
KAFKA_CFG_NODE_ID=3
```
