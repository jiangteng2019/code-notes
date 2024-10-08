# 什么是VXLAN

在传统的OSI模型中，数据从应用层逐层向下封装，最终通过物理层进行传输。而在VXLAN中，原始的二层以太网帧不再直接通过物理层进行层层转发，而是被封装到UDP报文中，通过L3网络进行传输。下面是具体的步骤和详细说明。

## 传统OSI模型通信过程
假设机器A和机器B需要通过网络进行通信，数据从应用层逐层向下封装：

- 应用层：

用户数据（例如HTTP请求）
- 传输层（TCP）：

将用户数据封装成TCP段，并添加TCP头部（源端口、目标端口等）。
- 网络层（IP）：

将TCP段封装成IP数据包，并添加IP头部（源IP、目标IP等）。
- 数据链路层（以太网）：

将IP数据包封装成以太网帧，并添加以太网头部（源MAC、目标MAC等）。
- 物理层：

将以太网帧转换成电信号或光信号，在物理介质上传输。
## VXLAN通信过程
在VXLAN中，原始的二层以太网帧被封装到UDP报文中，通过L3网络进行传输。具体步骤如下：

- 应用层：

用户数据（例如HTTP请求）
- 传输层（TCP）：

将用户数据封装成TCP段，并添加TCP头部（源端口、目标端口等）。
- 网络层（IP）：

将TCP段封装成IP数据包，并添加IP头部（源IP、目标IP等）。
- 数据链路层（以太网）：

将IP数据包封装成以太网帧，并添加以太网头部（源MAC、目标MAC等）。
- VXLAN封装：

- 将原始的以太网帧封装到UDP报文中，并添加VXLAN头部（VNI等）。
UDP报文的源端口通常是4789（默认端口号），也可以自定义。
- 网络层（IP）：

将UDP报文封装成新的IP数据包，并添加新的IP头部（源IP、目标IP等）。
- 数据链路层（以太网）：

将新的IP数据包封装成新的以太网帧，并添加新的以太网头部（源MAC、目标MAC等）。
- 物理层：

将新的以太网帧转换成电信号或光信号，在物理介质上传输。

## 示例
假设机器A和机器B通过VXLAN进行通信：

原始二层以太网帧：
```sh
Ethernet Header (源MAC, 目标MAC)
VLAN Tag (可选)
Payload (数据)
```
VXLAN封装后的UDP报文：

```sh
IP Header (源IP, 目标IP)
UDP Header (源端口, 目标端口=4789)
VXLAN Header (VNI, Flags)
Encapsulated Ethernet Frame (原始二层以太帧)
```
新的以太网帧：
```sh
Ethernet Header (源MAC, 目标MAC)
IP Header (源IP, 目标IP)
UDP Header (源端口, 目标端口=4789)
VXLAN Header (VNI, Flags)
Encapsulated Ethernet Frame (原始二层以太帧)
```
## 物理层通信：

将新的以太网帧转换成电信号或光信号，在物理介质上传输。
接收端解封装过程
- 物理层：

接收到电信号或光信号，并转换成新的以太网帧。
- 数据链路层（以太网）：

解析新的以太网帧，提取出新的IP数据包。
- 网络层（IP）：

解析新的IP数据包，提取出UDP报文。
- 传输层（UDP）：

解析UDP报文，提取出VXLAN头部和封装的原始以太网帧。
- VXLAN解封装：

解析VXLAN头部，提取出原始的以太网帧。
- 数据链路层（以太网）：

解析原始的以太网帧，提取出IP数据包。
- 网络层（IP）：

解析IP数据包，提取出TCP段。
- 传输层（TCP）：

解析TCP段，提取出用户数据。
- 应用层：

用户数据（例如HTTP响应）。
## 总结
通过VXLAN，原始的二层以太网帧被封装到UDP报文中，并通过L3网络进行传输。这种方式使得二层网络可以在L3网络中跨越多个子网，从而实现更大的网络扩展性。具体步骤包括：

- 原始二层以太网帧封装。
- UDP报文封装。
- 新的IP数据包封装。
- 新的以太网帧封装。
- 物理层通信。

在接收端，逐层解封装，最终恢复原始的二层以太网帧。